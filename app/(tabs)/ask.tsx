import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCourseStore } from "../../stores/courseStore";
import { generateAnswer } from "../../lib/rag/answer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { page: number; section: string }[];
}

export default function AskScreen() {
  const { courses, addToTutorQueue } = useCourseStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I’m your offline AI Course Assistant.\n\nI only answer from the course materials you have downloaded on this device. Ask me anything about CIT 101, GST 101, MTH 101 or CSS 101 after you download them.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const question = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate thinking time (real RAG will take longer on device)
    await new Promise((r) => setTimeout(r, 700));

    const result = await generateAnswer(question, courses);

    if (result.shouldQueue && result.courseId) {
      addToTutorQueue({
        courseId: result.courseId,
        question,
      });
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.answer,
      citations: result.citations,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  const readyCount = courses.filter((c) => c.downloadStatus === "ready").length;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-900"
    >
      {/* Status bar */}
      <View className="px-4 py-2 bg-slate-800 border-b border-slate-700">
        <Text className="text-xs text-slate-400">
          {readyCount === 0
            ? "No courses ready offline"
            : `${readyCount} course${readyCount > 1 ? "s" : ""} available offline`}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View
            className={`mb-4 max-w-[88%] ${
              item.role === "user" ? "self-end" : "self-start"
            }`}
          >
            <View
              className={`rounded-2xl px-4 py-3 ${
                item.role === "user"
                  ? "bg-green-600"
                  : "bg-slate-800 border border-slate-700"
              }`}
            >
              <Text className="text-white leading-5">{item.content}</Text>

              {item.citations && item.citations.length > 0 && (
                <View className="mt-3 pt-2 border-t border-slate-600">
                  <Text className="text-xs text-slate-400 mb-1">Sources from your materials:</Text>
                  {item.citations.map((c, i) => (
                    <Text key={i} className="text-xs text-green-400">
                      • Page {c.page} — {c.section}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      />

      <View className="flex-row items-center p-3 border-t border-slate-800 bg-slate-900">
        <TextInput
          className="flex-1 bg-slate-800 text-white rounded-full px-4 py-3 mr-2"
          placeholder="Ask about your course materials..."
          placeholderTextColor="#64748B"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
          multiline={false}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !input.trim()}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            loading || !input.trim() ? "bg-slate-700" : "bg-green-600"
          }`}
        >
          <Text className="text-white text-lg font-bold">{loading ? "…" : "↑"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
