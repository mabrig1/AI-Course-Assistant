import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useCourseStore } from "../../stores/courseStore";

export default function MyCoursesScreen() {
  const { courses } = useCourseStore();
  const readyCourses = courses.filter((c) => c.downloadStatus === "ready");

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-1">My Courses</Text>
      <Text className="text-slate-400 mb-5">
        {readyCourses.length === 0
          ? "Download courses to start studying offline"
          : `${readyCourses.length} course${readyCourses.length > 1 ? "s" : ""} ready offline`}
      </Text>

      {courses.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">📚</Text>
          <Text className="text-slate-300 text-center text-lg font-medium mb-2">
            No courses yet
          </Text>
          <Text className="text-slate-500 text-center">
            Go to the Download tab and get your first course. After download you can ask questions completely offline.
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/course/${item.id}`} asChild>
              <TouchableOpacity className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">{item.code}</Text>
                    <Text className="text-slate-300 mt-1">{item.title}</Text>
                  </View>
                  <View
                    className={`px-2.5 py-1 rounded-full ${
                      item.downloadStatus === "ready"
                        ? "bg-green-900/50"
                        : item.downloadStatus === "processing" || item.downloadStatus === "downloading"
                        ? "bg-blue-900/50"
                        : "bg-slate-700"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        item.downloadStatus === "ready"
                          ? "text-green-400"
                          : "text-blue-300"
                      }`}
                    >
                      {item.downloadStatus === "ready"
                        ? "Offline"
                        : item.downloadStatus}
                    </Text>
                  </View>
                </View>

                {item.downloadStatus === "ready" && (
                  <Text className="text-slate-500 text-xs mt-3">
                    {item.chunkCount ?? 0} chunks • Ready for AI questions
                  </Text>
                )}
              </TouchableOpacity>
            </Link>
          )}
        />
      )}
    </View>
  );
}
