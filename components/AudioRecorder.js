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
const MAX_FILE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB

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

const formatDuration = (ms) => formatTime(Math.floor(ms / 1000));

function formatFileSize(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2);
}

/* ================= RECORDER HOOK ================= */
function useRecorder({ onStopped }) {
    const { startRecording, stopRecording, isRecording, analysisData } = useAudioRecorder();

    const timerRef = useRef(null);
    const [elapsedSeconds, setElapsed] = useState(0);

    const audioLevel = analysisData?.rms ?? 0;

    // Refs to prevent double-start and double-stop races
    const isStartingRef = useRef(false);
    const isStoppingRef = useRef(false);

    useEffect(() => {
        if (!isRecording) {
            setElapsed(0);
            return;
        }
        const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [isRecording]);

    const stop = useCallback(async () => {
        // Guard: prevent double-stop
        if (isStoppingRef.current) return;
        isStoppingRef.current = true;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        try {
            const result = await stopRecording();

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                playThroughEarpieceAndroid: false,
            });

            if (result?.fileUri) {
                const info = await FileSystem.getInfoAsync(result.fileUri);

                // Compute duration from PCM file size: size / (sampleRate * channels * bytesPerSample)
                // pcm_16bit = 2 bytes per sample
                const durationMs = info.exists
                    ? Math.round((info.size / (RECORDING_CONFIG.sampleRate * RECORDING_CONFIG.channels * 2)) * 1000)
                    : undefined;

                console.log("=== RECORDING STOPPED ===");
                console.log("File URI:", result.fileUri);
                console.log("File Size:", info.size, "bytes");
                console.log("File Size (MB):", formatFileSize(info.size), "MB");
                console.log("Mime Type:", result?.mimeType);
                console.log("Channels:", result?.channels);
                console.log("Sample Rate:", result?.sampleRate);
                console.log("Duration (ms) [computed]:", durationMs);

                if (info.size > MAX_FILE_SIZE_BYTES) {
                    console.warn("File exceeds max size:", formatFileSize(info.size), "MB");
                    Alert.alert(
                        "File Too Large",
                        `Recording is ${formatFileSize(info.size)} MB. Maximum allowed is ${formatFileSize(MAX_FILE_SIZE_BYTES)} MB.`,
                        [
                            {
                                text: "OK",
                                onPress: async () => {
                                    await FileSystem.deleteAsync(result.fileUri, { idempotent: true });
                                },
                            },
                        ]
                    );
                    return;
                }

                onStopped?.({ uri: result.fileUri, durationMs, status: "stopped" });
            }
        } catch (err) {
            console.error("stopRecording error", err);
        } finally {
            isStoppingRef.current = false;
        }
    }, [stopRecording, onStopped]);

    const start = useCallback(async () => {
        // Guard: prevent double-start — check both react state and ref
        if (isRecording || isStartingRef.current) return;
        isStartingRef.current = true;

        try {
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

            // Auto-stop after max duration
            timerRef.current = setTimeout(() => {
                stop();
            }, MAX_RECORDING_SECONDS * 1000);

        } catch (err) {
            console.error("startRecording error", err);
            Alert.alert("Error", err.message);
        } finally {
            isStartingRef.current = false;
        }
    }, [isRecording, startRecording, stop]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (isRecording) {
                stopRecording().catch(() => { });
            }
        };
    }, []); // intentionally empty — only runs on unmount

    return { isRecording, audioLevel, elapsedSeconds, start, stop };
}

/* ================= PLAYER HOOK ================= */
function usePlayer(uri) {
    const soundRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Unload when uri changes or on unmount
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync().catch(() => { });
                soundRef.current = null;
            }
        };
    }, [uri]);

    const playPause = useCallback(async () => {
        if (!uri) return;

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false,
            shouldDuckAndroid: false,
        });

        if (soundRef.current) {
            const status = await soundRef.current.getStatusAsync();
            if (status.isPlaying) {
                await soundRef.current.pauseAsync();
                setIsPlaying(false);
            } else {
                // Replay from start if finished
                if (status.positionMillis >= status.durationMillis && status.durationMillis > 0) {
                    await soundRef.current.setPositionAsync(0);
                }
                await soundRef.current.playAsync();
                setIsPlaying(true);
            }
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
                (status) => {
                    // Auto-reset isPlaying when playback finishes
                    if (status.didJustFinish) setIsPlaying(false);
                }
            );
            soundRef.current = newSound;
            setIsPlaying(true);
        }
    }, [uri]);

    const cleanup = useCallback(async () => {
        if (soundRef.current) {
            await soundRef.current.stopAsync().catch(() => { });
            await soundRef.current.unloadAsync().catch(() => { });
            soundRef.current = null;
            setIsPlaying(false);
        }
    }, []);

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
                // Double-check file size before encoding
                const info = await FileSystem.getInfoAsync(uri);
                if (info.size > MAX_FILE_SIZE_BYTES) {
                    throw new Error(
                        `File size (${formatFileSize(info.size)} MB) exceeds maximum allowed (${formatFileSize(MAX_FILE_SIZE_BYTES)} MB)`
                    );
                }

                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                console.log("Base64 (first 80 chars):", base64.substring(0, 80));

                const response = await api.post("v1/request/speechDetectV2", {
                    audioContent: base64,
                });

                console.log("Full API response:", JSON.stringify(response.data, null, 2));

                const result = (response.data || [])
                    .map(item => item.transcript)
                    .filter(Boolean)
                    .join(' ');
                setTranscript(result);

                // Only call parent callback here — after user confirms Send
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
function AudioRecorderInner({ onStop = () => { }, startTrigger }) {
    const [recordedUri, setRecordedUri] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [dotCount, setDotCount] = useState(0);

    const rippleScale = useRef(new Animated.Value(1)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;

    const { isRecording, audioLevel, elapsedSeconds, start, stop } = useRecorder({
        onStopped: ({ uri, durationMs }) => {
            setRecordedUri(uri);
            setAudioDuration(durationMs || 0);
            setShowPreview(true);
        },
    });

    const { isPlaying, playPause, cleanup } = usePlayer(recordedUri);
    const { isSending, error, send, reset } = useTranscription({
        // Called only after successful transcription send
        onSuccess: onStop,
    });

    const [audioDuration, setAudioDuration] = useState(0);

    // Start recording when trigger flips to true
    const prevTriggerRef = useRef(false);
    useEffect(() => {
        if (startTrigger && !prevTriggerRef.current && !isRecording) {
            start();
        }
        prevTriggerRef.current = startTrigger;
    }, [startTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

    // Animated dots while recording
    useEffect(() => {
        if (!isRecording) return;
        const id = setInterval(() => setDotCount((p) => (p + 1) % 4), 350);
        return () => clearInterval(id);
    }, [isRecording]);

    // Ripple animation driven by audio level
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
        await cleanup();
        if (recordedUri) {
            await FileSystem.deleteAsync(recordedUri, { idempotent: true });
        }
        setRecordedUri(null);
        setShowPreview(false);
        reset();
        // Notify parent that recorder was dismissed without a transcript
        onStop({ uri: null, transcript: null });
    };

    const handleSend = async () => {
        if (!recordedUri) return;
        setShowPreview(false);
        await cleanup();
        try {
            await send(recordedUri);
            Alert.alert("Success", "Audio sent successfully");
        } catch {
            Alert.alert("Send Failed", error || "Something went wrong");
        }
    };

    const timerProgress = elapsedSeconds / MAX_RECORDING_SECONDS;
    const timerColor = timerProgress >= 0.85 ? "#ef4444" : "#22c55e";

    return (
        <>
            {/* Recording in-progress modal */}
            <Modal transparent visible={isRecording} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.floatingTab}>
                        <Text style={[styles.timerText, { color: timerColor }]}>
                            {formatTime(elapsedSeconds)} / {formatTime(MAX_RECORDING_SECONDS)}
                        </Text>
                        <Text style={styles.recordingText}>
                            Recording{".".repeat(dotCount)}
                        </Text>
                        <TouchableOpacity style={styles.stopButton} onPress={stop}>
                            <View style={styles.squareInside} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Preview modal */}
            <Modal transparent visible={showPreview} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.previewTab}>
                        <Text style={styles.previewTitle}>Preview Recording</Text>
                        <TouchableOpacity style={styles.playButton} onPress={playPause}>
                            <Icon name={isPlaying ? "pause" : "play"} size={32} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.previewDuration}>
                            {formatTime(elapsedSeconds)} / {formatDuration(audioDuration)}
                        </Text>
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

            {/* Sending/processing modal */}
            <Modal transparent visible={isSending} animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.sendingTab}>
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text style={styles.sendingText}>Processing audio...</Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

/* ================= PROVIDER WRAPPER ================= */
export default function AudioRecorder(props) {
    return (
        <AudioRecorderProvider>
            <AudioRecorderInner {...props} />
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
    previewDuration: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "600",
        marginTop: 12,
        marginBottom: 18,
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
});