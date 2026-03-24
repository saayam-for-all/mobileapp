import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    Alert,
    ActivityIndicator,
} from "react-native";

import { useAudioRecorder, AudioRecorderProvider, ExpoAudioStreamModule } from "@siteed/expo-audio-studio";
import { Audio } from "expo-av";

import Icon from "react-native-vector-icons/Feather";
import * as FileSystem from "expo-file-system";
import api from "../services/api";

const MAX_RECORDING_SECONDS = 60;

const RECORDING_CONFIG = {
    sampleRate: 16000,
    channels: 1,
    encoding: "pcm_16bit",
    interval: 100,
    enableProcessing: true,
    features: {
        energy: true,
        rms: true,
    },
};

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/* ================= RECORDER HOOK ================= */
function useRecorder({ onStopped }) {
    const { startRecording, stopRecording, isRecording, analysisData } = useAudioRecorder();

    const timerRef = useRef(null);
    const [elapsedSeconds, setElapsed] = useState(0);

    const audioLevel = analysisData?.rms ?? 0;

    useEffect(() => {
        if (!isRecording) {
            setElapsed(0);
            return;
        }
        const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isRecording]);

    const stop = useCallback(async () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        try {
            const result = await stopRecording();

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                playThroughEarpieceAndroid: false,
            });

            if (result?.fileUri) {
                // 1. You MUST fetch the file info here before logging 'info.size'
                const info = await FileSystem.getInfoAsync(result.fileUri);

                console.log("=== RECORDING STOPPED ===");
                console.log("File URI:", result.fileUri);

                // 2. Now 'info' exists and has a 'size' property
                console.log("File Size:", info.size, "bytes");

                console.log("Mime Type:", result?.mimeType);
                console.log("Channels:", result?.channels);
                console.log("Sample Rate:", result?.sampleRate);
                console.log("Duration (ms):", result?.duration);

                onStopped(result.fileUri);
            }
        } catch (err) {
            console.error("stopRecording error", err);
        }
    }, [stopRecording, onStopped]);

    const start = useCallback(async () => {
        try {
            if (isRecording) return;

            const { granted } = await ExpoAudioStreamModule.requestPermissionsAsync();
            if (!granted) {
                Alert.alert("Permission Required", "Microphone permission needed");
                return;
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            await startRecording(RECORDING_CONFIG);

            timerRef.current = setTimeout(stop, MAX_RECORDING_SECONDS * 1000);
        } catch (err) {
            console.error("startRecording error", err);
            Alert.alert("Error", err.message);
        }
    }, [isRecording, startRecording, stop]);

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording().catch(() => { });
            }
        };
    }, [isRecording, stopRecording]);

    return { isRecording, audioLevel, elapsedSeconds, start, stop };
}

/* ================= PLAYER HOOK ================= */
function usePlayer(uri) {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        return () => {
            if (sound) sound.unloadAsync().catch(() => { });
        };
    }, [sound]);

    const playPause = useCallback(async () => {
        if (!uri) return;

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: false,  
        });

        if (sound) {
            const status = await sound.getStatusAsync();
            if (status.isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                if (status.positionMillis >= status.durationMillis && status.durationMillis > 0) {
                    await sound.setPositionAsync(0);
                }
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
            setSound(newSound);
            setIsPlaying(true);
        }
    }, [sound, uri]);

    const cleanup = useCallback(async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setIsPlaying(false);
            setSound(null);
        }
    }, [sound]);

    return { isPlaying, playPause, cleanup };
}

/* ================= TRANSCRIPTION ================= */
function useTranscription({ onSuccess }) {
    const [isSending, setIsSending] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [error, setError] = useState(null);

    const send = useCallback(
        async (uri) => {
            setIsSending(true);
            setError(null);
            try {
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                console.log("Base64 (first 80 chars):", base64.substring(0, 80));

                const response = await api.post("v1/request/speechDetectV2", {
                    audioContent: base64,
                });

                console.log("Full API response:", JSON.stringify(response.data, null, 2));

                const result = response.data[0]?.transcript ?? "";
                setTranscript(result);
                onSuccess?.({ uri, response: response.data, transcript: result });

                await FileSystem.deleteAsync(uri, { idempotent: true });
            } catch (err) {
                setError(err.message || "Failed to send audio");
                console.error("send error:", err);
                throw err;
            } finally {
                setIsSending(false);
            }
        },
        [onSuccess]
    );

    const reset = useCallback(() => {
        setTranscript("");
        setError(null);
    }, []);

    return { isSending, transcript, error, send, reset };
}

/* ================= MAIN COMPONENT ================= */
function AudioRecorderTesterInner({ onStop = () => { } }) {
    const [recordedUri, setRecordedUri] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [dotCount, setDotCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    const { isRecording, audioLevel, elapsedSeconds, start, stop } = useRecorder({
        onStopped: (uri) => {
            setRecordedUri(uri);
            setShowPreview(true);
        },
    });

    const { isPlaying, playPause, cleanup } = usePlayer(recordedUri);
    const { isSending, transcript, error, send, reset } = useTranscription({ onSuccess: onStop });

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!isRecording) return;
        const id = setInterval(() => setDotCount((p) => (p + 1) % 4), 350);
        return () => clearInterval(id);
    }, [isRecording]);

    useEffect(() => {
        if (!isRecording) return;
        const intensity = Math.min(1, audioLevel * 5);
        Animated.parallel([
            Animated.timing(rippleScale, {
                toValue: 1 + intensity * 2,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(rippleOpacity, {
                toValue: Math.max(0.2, intensity),
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
    }, [audioLevel, isRecording]);

    const discardRecording = async () => {
        cleanup();
        if (recordedUri) await FileSystem.deleteAsync(recordedUri, { idempotent: true });
        setRecordedUri(null);
        setShowPreview(false);
        reset();
    };

    const handleSend = async () => {
        if (!recordedUri) return;
        setShowPreview(false);
        cleanup();

        try {
            await send(recordedUri);
            Alert.alert("Success", "Audio sent successfully");
        } catch {
            Alert.alert("Send Failed", error || "Something went wrong");
        }
    };

    const timerProgress = elapsedSeconds / MAX_RECORDING_SECONDS;
    const timerColor = timerProgress >= 0.85 ? "#ef4444" : "#22c55e";

    if (!mounted) return null;

    return (
        <>
            <TouchableOpacity style={styles.startButton} onPress={start} disabled={isRecording}>
                <Icon name="mic" size={30} color="#000" />
            </TouchableOpacity>

            {mounted && (
                <>
                    <Modal transparent visible={isRecording}>
                        <View style={styles.overlay}>
                            <View style={styles.floatingTab}>
                                <Text style={[styles.timerText, { color: timerColor }]}>
                                    {formatTime(elapsedSeconds)} / {formatTime(MAX_RECORDING_SECONDS)}
                                </Text>
                                <Text style={styles.recordingText}>Recording{".".repeat(dotCount)}</Text>
                                <TouchableOpacity style={styles.stopButton} onPress={stop}>
                                    <View style={styles.squareInside} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal transparent visible={showPreview}>
                        <View style={styles.overlay}>
                            <View style={styles.previewTab}>
                                <Text style={styles.previewTitle}>Preview Recording</Text>
                                <TouchableOpacity style={styles.playButton} onPress={playPause}>
                                    <Icon name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
                                </TouchableOpacity>
                                <View style={styles.previewActions}>
                                    <TouchableOpacity style={styles.discardButton} onPress={discardRecording}>
                                        <Text style={styles.actionText}>Discard</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                        <Text style={styles.actionText}>Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <Modal transparent visible={isSending}>
                        <View style={styles.overlay}>
                            <View style={styles.sendingTab}>
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text style={styles.sendingText}>Processing audio...</Text>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </>
    );
}

/* ================= PROVIDER ================= */
export default function AudioRecorderTester(props) {
    return (
        <AudioRecorderProvider>
            <AudioRecorderTesterInner {...props} />
        </AudioRecorderProvider>
    );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.72)",
        justifyContent: "center",
        alignItems: "center",
    },
    floatingTab: {
        width: 300,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
    },
    timerText: {
        fontSize: 28,
        fontWeight: "800",
    },
    recordingText: {
        fontSize: 16,
        fontWeight: "700",
        color: "red",
        marginVertical: 10,
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
        right: 5,
        width: 55,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    previewTab: {
        width: 300,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: "700",
    },
    playButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#3b82f6",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
    },
    previewActions: {
        flexDirection: "row",
        gap: 16,
    },
    discardButton: {
        backgroundColor: "#ef4444",
        padding: 10,
        borderRadius: 10,
    },
    sendButton: {
        backgroundColor: "#22c55e",
        padding: 10,
        borderRadius: 10,
    },
    actionText: {
        color: "#fff",
        fontWeight: "600",
    },
    sendingTab: {
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
    },
    sendingText: {
        marginTop: 10,
        fontWeight: "600",
    },
    transcriptBox: {
        margin: 16,
        padding: 14,
        backgroundColor: "#f0fdf4",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#bbf7d0",
    },
    transcriptLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: "#16a34a",
        marginBottom: 4,
    },
    transcriptText: {
        fontSize: 15,
        color: "#1f2937",
    },
});