import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/Feather';
import * as FileSystem from "expo-file-system";
import api from '../services/api'
import { Buffer } from "buffer";

function detectAudioFormat(base64) {
    // Decode the full base64 then inspect the first bytes for reliable detection
    const bytes = Buffer.from(base64, "base64").slice(0, 32);
    if (bytes.slice(0, 4).toString() === "RIFF") return "WAV";
    if (bytes.slice(4, 8).toString() === "ftyp") return "MP4 / M4A";
    if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return "MP3";
    if (bytes.slice(0, 4).toString() === "OggS") return "OGG";
    return "UNKNOWN";
}

/* ================= RECORDING OPTIONS ================= */
const RECORDING_OPTIONS = {
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 16000,
        numberOfChannels: 1,        // ← mono is best
        bitRate: 64000,
    },
    ios: {
        extension: '.m4a',          // or .caf if you prefer, but m4a works
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 16000,
        numberOfChannels: 1,
        bitRate: 64000,
        linearPCMBitDepth: 16,      // not used for AAC, but safegit 
    },

};

/* ================= COMPONENT ================= */
export default function AudioRecorderTester({ onStop }) {
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [recordedUri, setRecordedUri] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [transcript, setTranscript] = useState(""); // New: Transcription text

    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        if (!isRecording) return;
        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 350);
        return () => clearInterval(interval);
    }, [isRecording]);

    const renderDots = () => `Recording${".".repeat(dotCount)}`;

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

    /* ================= START RECORDING ================= */
    const startRecording = async () => {
        try {
            const perm = await Audio.requestPermissionsAsync();
            const status = perm.status ?? (perm.granted ? 'granted' : 'denied');
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Microphone permission is required!');
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            if (recording) {
                try { await recording.stopAndUnloadAsync(); } catch { }
            }

            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(RECORDING_OPTIONS);
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
            Alert.alert('Error', err.message);
        }
    };

    /* ================= STOP RECORDING ================= */
    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();

            // Detect format
            const base64Audio = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const format = detectAudioFormat(base64Audio);
            console.log("🎵 Recorded audio format:", format, "URI:", uri);

            setIsRecording(false);
            setRecording(null);
            setAudioLevel(0);
            rippleScale.setValue(1);
            rippleOpacity.setValue(0);

            setRecordedUri(uri);
            setShowPreview(true);  // Show the "Send Audio" modal
        } catch (err) {
            console.error("Stop recording error:", err);
        }
    };


    /* ================= PLAY / PAUSE ================= */
    const playPauseAudio = async () => {
        try {
            if (!sound) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: recordedUri },
                    { shouldPlay: true }
                );
                setSound(newSound);
                setIsPlaying(true);
                newSound.setOnPlaybackStatusUpdate((status) => {
                    if (status.didJustFinish) setIsPlaying(false);
                });
            } else {
                const status = await sound.getStatusAsync();
                if (status.isPlaying) {
                    await sound.pauseAsync();
                    setIsPlaying(false);
                } else {
                    if (status.positionMillis >= status.durationMillis) {
                        await sound.setPositionAsync(0);
                    }
                    await sound.playAsync();
                    setIsPlaying(true);
                }
            }
        } catch (err) {
            console.error("Playback error:", err);
        }
    };

    const cleanupSound = async () => {
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
        setIsPlaying(false);
    };

    /* ================= SEND AUDIO ================= */
    const sendAudio = async () => {
        if (!recordedUri) return;
        try {
            setShowPreview(false);
            setIsSending(true);

            // Read file as Base64
            const base64Full = await FileSystem.readAsStringAsync(recordedUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            console.log(base64Full);
            const base64Audio = base64Full.replace(/^data:audio\/\w+;base64,/, "");

            // Detect actual recorded format and set encoding/sampleRate accordingly
            const format = detectAudioFormat(base64Audio);
            console.log("🎵 Detected format before send:", format);

            let encoding = "LINEAR16";
            let sampleRate = 44100;
            switch (format) {
                case "WAV":
                    encoding = "LINEAR16";
                    sampleRate = 44100;
                    break;
                case "MP4 / M4A":
                    encoding = "AAC";
                    sampleRate = 44100;
                    break;
                case "MP3":
                    encoding = "MP3";
                    sampleRate = 44100;
                    break;
                case "OGG":
                    encoding = "OGG_OPUS";
                    sampleRate = 16000;
                    break;
                default:
                    encoding = Platform.OS === "android" ? "OPUS_IN_WEBM" : "LINEAR16";
                    sampleRate = Platform.OS === "android" ? 16000 : 44100;
            }

            const payload = {
                audioContent: base64Audio,
            };

            // Call your backend
            const response = await api.post("/requests/v0.0.1/speechDetectC2", payload);

            console.log("📥 API response:", response.data);
            setTranscript(response.data.result || "");

            setIsSending(false);
            cleanupSound();
            Alert.alert("Success", "Audio sent and transcribed successfully!");
            onStop?.({ uri: recordedUri, response: response.data });
        } catch (err) {
            setIsSending(false);
            console.error("Send audio error:", err);
            Alert.alert("Error", "Failed to send and transcribe audio.");
        }
    };


    /* ================= UI ================= */
    return (
        <>
            <TouchableOpacity style={styles.startButton} onPress={startRecording}>
                <Icon name="mic" size={30} color="#000" />
            </TouchableOpacity>

            {/* RECORDING MODAL */}
            <Modal transparent animationType="fade" visible={isRecording}>
                <View style={styles.overlay}>
                    <View style={styles.floatingTab}>
                        <Text style={styles.recordingText}>{renderDots()}</Text>
                        <View style={styles.rippleWrapper}>
                            <Animated.View
                                style={[
                                    styles.rippleCircle,
                                    { transform: [{ scale: rippleScale }], opacity: rippleOpacity },
                                ]}
                            />
                            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
                                <View style={styles.squareInside} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PREVIEW MODAL */}
            <Modal transparent animationType="fade" visible={showPreview}>
                <View style={styles.overlay}>
                    <View style={styles.previewTab}>
                        <Text style={styles.previewTitle}>Preview Recording</Text>
                        <TouchableOpacity style={styles.playButton} onPress={playPauseAudio}>
                            <Icon name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
                        </TouchableOpacity>
                        {transcript ? (
                            <Text style={{ marginBottom: 15, fontStyle: 'italic' }}>{transcript}</Text>
                        ) : null}
                        <View style={styles.previewActions}>
                            <TouchableOpacity
                                style={styles.discardButton}
                                onPress={() => {
                                    cleanupSound();
                                    setShowPreview(false);
                                    setRecordedUri(null);
                                    setTranscript("");
                                }}
                            >
                                <Text style={styles.actionText}>Discard</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.sendButton} onPress={sendAudio}>
                                <Text style={styles.actionText}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* SENDING MODAL */}
            <Modal transparent animationType="fade" visible={isSending}>
                <View style={styles.overlay}>
                    <View style={styles.sendingTab}>
                        <Icon name="upload-cloud" size={40} color="#3b82f6" />
                        <Text style={styles.sendingText}>Processing audio...</Text>
                        <ActivityIndicator size="small" color="#3b82f6" style={{ marginTop: 10 }} />
                    </View>
                </View>
            </Modal>
        </>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
    floatingTab: { width: 300, height: 200, backgroundColor: "#fff", borderRadius: 20, padding: 25, alignItems: "center", justifyContent: "space-between", elevation: 12 },
    recordingText: { fontSize: 22, fontWeight: "700", color: "red" },
    rippleWrapper: { width: 40, height: 40, justifyContent: "center", alignItems: "center", marginVertical: 25 },
    rippleCircle: { position: "absolute", width: 40, height: 40, borderRadius: 20, backgroundColor: "#ff3b3044" },
    stopButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "red", justifyContent: "center", alignItems: "center" },
    squareInside: { width: 26, height: 26, backgroundColor: "#fff", borderRadius: 4 },
    startButton: { position: "absolute", bottom: 50, right: 4, width: 55, height: 55, justifyContent: "center", alignItems: "center" },
    previewTab: { width: 300, backgroundColor: "#fff", borderRadius: 20, padding: 25, alignItems: "center" },
    previewTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
    playButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center", marginBottom: 25 },
    previewActions: { flexDirection: "row", gap: 20 },
    discardButton: { backgroundColor: "#ef4444", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    sendButton: { backgroundColor: "#22c55e", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    actionText: { color: "#fff", fontWeight: "600" },
    sendingTab: { width: 250, height: 150, backgroundColor: "#fff", borderRadius: 20, padding: 25, alignItems: "center", justifyContent: "center", elevation: 12 },
    sendingText: { fontSize: 18, fontWeight: "600", marginTop: 15 },
});
