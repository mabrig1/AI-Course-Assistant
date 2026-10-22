import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useCourseStore } from "../../stores/courseStore";

// Mock available courses (will later come from Moodle API)
const AVAILABLE_COURSES = [
  { id: "cit101", code: "CIT 101", title: "Introduction to Computers", sizeMB: 12 },
  { id: "gst101", code: "GST 101", title: "Use of English", sizeMB: 8 },
  { id: "mth101", code: "MTH 101", title: "Elementary Mathematics", sizeMB: 15 },
  { id: "css101", code: "CSS 101", title: "Introduction to Sociology", sizeMB: 10 },
];

export default function DownloadScreen() {
  const { courses, addCourse, updateCourseStatus } = useCourseStore();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (course: typeof AVAILABLE_COURSES[0]) => {
    Alert.alert(
      "Download Course",
      `This will download ~${course.sizeMB} MB. Recommended on Wi-Fi.\n\nContinue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: async () => {
            setDownloading(course.id);
            addCourse({
              id: course.id,
              code: course.code,
              title: course.title,
              downloadStatus: "downloading",
              totalSizeBytes: course.sizeMB * 1024 * 1024,
            });

            // Simulate download + processing
            await new Promise((r) => setTimeout(r, 2500));

            updateCourseStatus(course.id, "ready");
            setDownloading(null);
            Alert.alert("Success", `${course.code} is now available offline.`);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-2">Download Courses</Text>
      <Text className="text-slate-400 mb-6">
        Download once. Study offline forever.
      </Text>

      <FlatList
        data={AVAILABLE_COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const alreadyDownloaded = courses.find((c) => c.id === item.id);
          const isDownloading = downloading === item.id;

          return (
            <View className="bg-slate-800 rounded-xl p-4 mb-3 border border-slate-700">
              <Text className="text-white font-semibold text-lg">{item.code}</Text>
              <Text className="text-slate-300 mt-1">{item.title}</Text>
              <Text className="text-slate-500 text-sm mt-1">~{item.sizeMB} MB</Text>

              <TouchableOpacity
                disabled={!!alreadyDownloaded || isDownloading}
                onPress={() => handleDownload(item)}
                className={`mt-3 py-2 px-4 rounded-lg ${
                  alreadyDownloaded
                    ? "bg-green-900"
                    : isDownloading
                    ? "bg-blue-900"
                    : "bg-green-600"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  {alreadyDownloaded
                    ? "Downloaded"
                    : isDownloading
                    ? "Downloading..."
                    : "Download"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
