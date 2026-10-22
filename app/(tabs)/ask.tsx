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
  const { courses } = useCourseStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I’m your offline AI Course Assistant. Ask me anything about your downloaded courses. I only answer from your materials.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulate offline RAG
    await new Promise((r) => setTimeout(r, 800));

    const result = await generateAnswer(userMsg.content, courses);

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: result.answer,
      citations: result.citations,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-900"
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View
            className={`mb-4 max-w-[85%] ${
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
              <Text className="text-white">{item.content}</Text>

              {item.citations && item.citations.length > 0 && (
                <View className="mt-3 pt-2 border-t border-slate-600">
                  <Text className="text-xs text-slate-400 mb-1">Sources:</Text>
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
          placeholder="Ask about your course..."
          placeholderTextColor="#64748B"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !input.trim()}
          className="bg-green-600 w-12 h-12 rounded-full items-center justify-center"
        >
          <Text className="text-white text-lg">{loading ? "..." : "↑"}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
