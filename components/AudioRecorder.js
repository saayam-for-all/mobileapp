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
                Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );

            newRecording.setProgressUpdateInterval(100);
            newRecording.setOnRecordingStatusUpdate((status) => {
                if (status.metering !== undefined) {
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

            setIsRecording(false);
            setRecording(null);
            setAudioLevel(0);

            rippleScale.setValue(1);
            rippleOpacity.setValue(0);

            if (onStop) onStop(uri);
        } catch (err) {
            console.error('Stop recording error:', err);
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

        borderRadius: 35,
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
