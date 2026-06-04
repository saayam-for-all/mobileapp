import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Markdown from "react-native-markdown-display";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { moreInformationChat } from "../../services/requestServices";
import { colors, borderRadius } from "../../styles/theme";

const MAX_QUESTIONS = 5;

// TODO: replace hardcoded defaults with dynamic user_id and req_id
const buildPayload = () => ({
  user_id: "SID-00-000-000-050",
  req_id: "REQ-00-000-000-0085",
});

// TODO: replace stub with real API when endpoint is provided
async function translateText(text) {
  return text;
}

const counterColor = (remaining) => {
  if (remaining >= 3) return "#22C55E";
  if (remaining === 2) return "#FACC15";
  if (remaining === 1) return "#EF4444";
  return "#9CA3AF";
};

const MoreInfoChatModal = ({ show, onClose, requestData, initialResponse }) => {
  const [messages, setMessages] = useState([]);
  const [remaining, setRemaining] = useState(MAX_QUESTIONS);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (show && initialResponse) {
      setMessages([{ role: "assistant", content: initialResponse }]);
      setRemaining(MAX_QUESTIONS);
      setInputText("");
    }
  }, [show, initialResponse]);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  if (!show) return null;

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed || remaining <= 0 || isLoading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const payload = {
        ...buildPayload(),
        conversation_history: nextMessages,
      };
      const rawReply = await moreInformationChat(payload);
      const aiReply = rawReply?.body?.answer ?? "";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "An error occurred while fetching the response.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setRemaining((prev) => prev - 1);
    }
  };

  const handleClose = async () => {
    const key = `moreInfoCooldown_${requestData?.id ?? requestData?.subject ?? "default"}`;
    await AsyncStorage.setItem(
      key,
      JSON.stringify({ expiresAt: Date.now() + 30 * 60 * 1000 }),
    );
    onClose();
  };

  const isInputDisabled = remaining === 0 || isLoading;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={show}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More Information</Text>
          <View style={styles.headerRight}>
            <View
              style={[styles.counter, { backgroundColor: counterColor(remaining) }]}
            >
              <Text style={styles.counterText}>{remaining}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageRow,
                msg.role === "user"
                  ? styles.messageRowUser
                  : styles.messageRowAssistant,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.role === "user"
                    ? styles.bubbleUser
                    : styles.bubbleAssistant,
                ]}
              >
                {msg.role === "assistant" ? (
                  <Markdown style={markdownStyles}>
                    {msg.content}
                  </Markdown>
                ) : (
                  <Text style={styles.textUser}>{msg.content}</Text>
                )}
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={styles.messageRowAssistant}>
              <View style={[styles.messageBubble, styles.bubbleAssistant]}>
                <Text style={styles.thinkingText}>Thinking...</Text>
              </View>
            </View>
          )}

          {remaining === 0 && !isLoading && (
            <Text style={styles.noQuestionsText}>
              No questions remaining.
            </Text>
          )}
        </ScrollView>

        {/* Input area */}
        <View style={styles.inputArea}>
          <TextInput
            value={inputText}
            onChangeText={(text) => {
              if (text.length <= 250) setInputText(text);
            }}
            editable={!isInputDisabled}
            multiline
            maxLength={250}
            placeholder={
              remaining === 0
                ? "No questions remaining"
                : "Ask a follow-up question... (max 250 characters)"
            }
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={isInputDisabled || !inputText.trim()}
            style={[
              styles.sendButton,
              (isInputDisabled || !inputText.trim()) &&
                styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const markdownStyles = StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: 14,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 4,
  },
  link: {
    color: colors.primary,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === "ios" ? 56 : 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  counter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  closeButton: {
    paddingHorizontal: 4,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textMuted,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomRightRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: "#F3F4F6",
    borderBottomLeftRadius: 4,
  },
  textUser: {
    color: colors.white,
    fontSize: 14,
  },
  textAssistant: {
    color: colors.text,
    fontSize: 14,
  },
  thinkingText: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: "italic",
  },
  noQuestionsText: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    gap: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    backgroundColor: colors.white,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.lg,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MoreInfoChatModal;
