import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCourseStore } from "../../stores/courseStore";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courses } = useCourseStore();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <View className="flex-1 bg-slate-900 items-center justify-center">
        <Text className="text-white">Course not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-900" contentContainerStyle={{ padding: 16 }}>
      <Text className="text-3xl font-bold text-white">{course.code}</Text>
      <Text className="text-slate-300 text-lg mt-1 mb-6">{course.title}</Text>

      <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
        <Text className="text-slate-400 text-sm mb-1">Status</Text>
        <Text
          className={`text-lg font-semibold ${
            course.downloadStatus === "ready" ? "text-green-400" : "text-blue-300"
          }`}
        >
          {course.downloadStatus === "ready"
            ? "Ready for Offline Use"
            : course.downloadStatus}
        </Text>
      </View>

      {course.downloadStatus === "ready" && (
        <>
          <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
            <Text className="text-slate-400 text-sm mb-1">Local Materials</Text>
            <Text className="text-white text-lg">
              {course.materialCount ?? 0} files • {course.chunkCount ?? 0} searchable chunks
            </Text>
          </View>

          <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700 mb-4">
            <Text className="text-slate-400 text-sm mb-1">Last Processed</Text>
            <Text className="text-white">
              {course.lastSyncedAt
                ? new Date(course.lastSyncedAt).toLocaleString()
                : "—"}
            </Text>
          </View>

          <View className="bg-green-900/20 border border-green-800/50 rounded-2xl p-4">
            <Text className="text-green-300 font-medium mb-1">Offline AI Ready</Text>
            <Text className="text-slate-300 text-sm leading-5">
              You can now ask questions about this course in the Ask AI tab. All answers will be generated from the materials stored on this device.
            </Text>
          </View>
        </>
      )}

      {course.downloadStatus !== "ready" && (
        <Text className="text-slate-500 mt-4">
          Finish downloading and processing this course to unlock offline AI questions.
        </Text>
      )}
    </ScrollView>
  );
}
