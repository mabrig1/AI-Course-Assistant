import { View, Text } from "react-native";
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
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white">{course.code}</Text>
      <Text className="text-slate-300 text-lg mt-1">{course.title}</Text>

      <View className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700">
        <Text className="text-green-400 font-medium">Status</Text>
        <Text className="text-white mt-1 capitalize">{course.downloadStatus}</Text>
      </View>

      <Text className="text-slate-400 mt-6">
        Materials and offline AI for this course will appear here in the next iteration.
      </Text>
    </View>
  );
}
