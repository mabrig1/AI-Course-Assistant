import { View, Text, FlatList } from "react-native";
import { useCourseStore } from "../../stores/courseStore";

export default function QueueScreen() {
  const { tutorQueue } = useCourseStore();

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-2">Tutor Queue</Text>
      <Text className="text-slate-400 mb-6">
        Questions the AI couldn’t answer. They will be sent when you are online.
      </Text>

      {tutorQueue.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-500 text-center">
            No pending questions.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tutorQueue}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-slate-800 rounded-xl p-4 mb-3 border border-slate-700">
              <Text className="text-white">{item.question}</Text>
              <View className="flex-row justify-between mt-3">
                <Text className="text-xs text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
                <Text
                  className={`text-xs font-medium ${
                    item.status === "pending"
                      ? "text-yellow-400"
                      : item.status === "sent"
                      ? "text-blue-400"
                      : "text-green-400"
                  }`}
                >
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
