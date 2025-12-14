import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Feather';
import * as FileSystem from "expo-file-system";
import api from './api';

const RECORDING_OPTIONS = {
    android: {
        extension: ".wav",
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 256000,
        isMeteringEnabled: true,
    },
    ios: {
        extension: ".wav",
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
        isMeteringEnabled: true,
    },
};


const wavToPcmBase64 = async (uri) => {
    const base64Wav = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    // WAV header = 44 bytes ≈ 60 Base64 chars
    return base64Wav.substring(60);
};

const uploadAudio = async (pcmBase64) => {
    const payload = {
        audioContent: pcmBase64,
        audioConfig: {
            encoding: "LINEAR16",
            sample_rate_hertz: 16000,
        },
    };

    console.log("Full API URL:", api.defaults.baseURL + "/requests/v0.0.1/upload-audio");

    try {
        const response = await api.post("/requests/v0.0.1/upload-audio", payload);
        console.log("API response:", response.data);
        return response.data;
    } catch (err) {
        if (err.response) {
            console.error("API responded with error:", err.response.data);
        } else if (err.request) {
            console.error("No response received, request:", err.request);
        } else {
            console.error("Axios setup error:", err.message);
        }
    }

    return null;
};


export default function AudioRecorder({ onStop }) {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    // Ripple animation values
    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    // DOT animation
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        if (!isRecording) return;
        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 350);
        return () => clearInterval(interval);
    }, [isRecording]);

    const renderDots = () => `Recording${".".repeat(dotCount)}`;

    // AUDIO → RIPPLE ANIMATION
    useEffect(() => {
        if (!isRecording) return;

        const intensity = Math.min(1, audioLevel * 2);

        Animated.parallel([
            Animated.timing(rippleScale, {
                toValue: 1 + intensity * 1.8,
                duration: 140,
                useNativeDriver: false,
            }),
            Animated.timing(rippleOpacity, {
                toValue: intensity,
                duration: 140,
                useNativeDriver: false,
            }),
        ]).start();
    }, [audioLevel, isRecording]);

    // START RECORDING
    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                alert('Microphone permission is required!');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            if (recording) {
                try {
                    await recording.stopAndUnloadAsync();
                } catch { }
                setRecording(null);
            }

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(
                RECORDING_OPTIONS
            );

            newRecording.setProgressUpdateInterval(100);
            newRecording.setOnRecordingStatusUpdate((status) => {
                if (typeof status.metering === "number") {
                    const level = Math.max(0, (status.metering + 160) / 160);
                    setAudioLevel(level);
                }
            });


            await newRecording.startAsync();
            setRecording(newRecording);
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    // STOP RECORDING
    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Reset recording state immediately
            setIsRecording(false);
            setRecording(null);
            setAudioLevel(0);
            rippleScale.setValue(1);
            rippleOpacity.setValue(0);

            // Convert WAV → PCM Base64
            const pcmBase64 = await wavToPcmBase64(uri);

            // Upload audio safely
            const response = await uploadAudio(pcmBase64);

            if (!response) {
                console.error("Upload failed, skipping transcription");
                if (onStop) onStop({ uri, requestId: null, transcription: null });
                return;
            }

            console.log("Request ID:", response.requestId);
            console.log("Transcription:", response.transcription);

            if (onStop) {
                onStop({
                    uri,
                    requestId: response.requestId,
                    transcription: response.transcription,
                });
            }
        } catch (err) {
            console.error("Stop recording error:", err);
        }
    };


    return (
        <>
            <TouchableOpacity style={styles.startButton} onPress={startRecording}>
                <Icon name="mic" size={30} color="#000" />
            </TouchableOpacity>

            <Modal transparent={true} animationType="fade" visible={isRecording}>
                <View style={styles.overlay}>
                    <View style={styles.floatingTab}>
                        <Text style={styles.recordingText}>{renderDots()}</Text>

                        {/* ------------------- RIPPLE + STOP BUTTON ------------------- */}
                        <View style={styles.rippleWrapper}>
                            <Animated.View
                                style={[
                                    styles.rippleCircle,
                                    {
                                        transform: [{ scale: rippleScale }],
                                        opacity: rippleOpacity,
                                    },
                                ]}
                            />

                            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                                <View style={styles.squareInside} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    floatingTab: {
        width: 300,
        height: 200,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        justifyContent: "space-between",
        elevation: 12,
    },
    recordingText: {
        fontSize: 22,
        fontWeight: "700",
        color: "red",
    },

    /* ----------------- RIPPLE CENTERING FIX ----------------- */
    rippleWrapper: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 25,
    },
    rippleCircle: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 40,       // smaller size
        height: 40,      // smaller size
        borderRadius: 20,
        backgroundColor: "#ff3b3044",
    },

    stopButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
    },
    squareInside: {
        width: 26,
        height: 26,
        backgroundColor: "#fff",
        borderRadius: 4,
    },

    startButton: {
        position: "absolute",
        bottom: 50,
        right: 4,
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
});
