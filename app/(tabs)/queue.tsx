import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useCourseStore } from "../../stores/courseStore";

export default function QueueScreen() {
  const { tutorQueue, clearTutorQueue } = useCourseStore();

  const pendingCount = tutorQueue.filter((q) => q.status === "pending").length;

  const handleClear = () => {
    if (tutorQueue.length === 0) return;
    Alert.alert("Clear Queue", "Remove all questions from the local queue?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearTutorQueue() },
    ]);
  };

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-2xl font-bold text-white">Tutor Queue</Text>
        {tutorQueue.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-red-400 text-sm">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-slate-400 mb-5">
        Questions the AI could not answer from your materials. They stay on this device until you are online, then they are sent to your NOUN tutor.
      </Text>

      {pendingCount > 0 && (
        <View className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl px-3 py-2 mb-4">
          <Text className="text-yellow-300 text-sm">
            {pendingCount} question{pendingCount > 1 ? "s" : ""} waiting to be sent
          </Text>
        </View>
      )}

      {tutorQueue.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-5xl mb-3">✅</Text>
          <Text className="text-slate-400 text-center">No pending questions</Text>
        </View>
      ) : (
        <FlatList
          data={tutorQueue}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
              <Text className="text-white leading-5">{item.question}</Text>
              <View className="flex-row justify-between items-center mt-3">
                <Text className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    item.status === "pending"
                      ? "bg-yellow-900/50"
                      : item.status === "sent"
                      ? "bg-blue-900/50"
                      : "bg-green-900/50"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      item.status === "pending"
                        ? "text-yellow-300"
                        : item.status === "sent"
                        ? "text-blue-300"
                        : "text-green-300"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
