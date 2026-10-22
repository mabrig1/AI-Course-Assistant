import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useCourseStore } from "../../stores/courseStore";

export default function MyCoursesScreen() {
  const { courses } = useCourseStore();

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-4">My Courses</Text>

      {courses.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-400 text-center text-lg">
            No courses downloaded yet.{\n}Go to the Download tab to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/course/${item.id}`} asChild>
              <TouchableOpacity className="bg-slate-800 rounded-xl p-4 mb-3 border border-slate-700">
                <Text className="text-white font-semibold text-lg">{item.code}</Text>
                <Text className="text-slate-300 mt-1">{item.title}</Text>
                <Text className="text-green-400 text-sm mt-2">
                  {item.downloadStatus === "ready" ? "Ready offline" : item.downloadStatus}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}
