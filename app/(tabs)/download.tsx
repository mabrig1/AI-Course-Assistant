import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useCourseStore } from "../../stores/courseStore";

const AVAILABLE_COURSES = [
  {
    id: "cit101",
    code: "CIT 101",
    title: "Introduction to Computers",
    sizeMB: 12,
    description: "Hardware, software, OS, and basic ICT concepts",
  },
  {
    id: "gst101",
    code: "GST 101",
    title: "Use of English",
    sizeMB: 8,
    description: "Grammar, essay writing, and communication skills",
  },
  {
    id: "mth101",
    code: "MTH 101",
    title: "Elementary Mathematics",
    sizeMB: 15,
    description: "Number systems, algebra, and quadratic equations",
  },
  {
    id: "css101",
    code: "CSS 101",
    title: "Introduction to Sociology",
    sizeMB: 10,
    description: "Society, culture, socialization and institutions",
  },
];

export default function DownloadScreen() {
  const { courses, addCourse, updateCourse, updateCourseStatus } = useCourseStore();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (course: (typeof AVAILABLE_COURSES)[0]) => {
    Alert.alert(
      "Download Course",
      `This will download approximately ${course.sizeMB} MB of materials.\n\nRecommended on Wi-Fi or a sponsored data bundle.\n\nContinue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: async () => {
            setDownloadingId(course.id);

            // 1. Add course in downloading state
            addCourse({
              id: course.id,
              code: course.code,
              title: course.title,
              downloadStatus: "downloading",
              totalSizeBytes: course.sizeMB * 1024 * 1024,
            });

            // Simulate network download
            await new Promise((r) => setTimeout(r, 1800));

            // 2. Processing (chunking + embedding simulation)
            updateCourseStatus(course.id, "processing");
            await new Promise((r) => setTimeout(r, 1400));

            // 3. Mark ready
            updateCourse(course.id, {
              downloadStatus: "ready",
              materialCount: 3,
              chunkCount: 48 + Math.floor(Math.random() * 30),
              lastSyncedAt: Date.now(),
            });

            setDownloadingId(null);
            Alert.alert(
              "Ready Offline",
              `${course.code} has been processed and is now fully available offline.\n\nYou can ask questions about it in the Ask AI tab.`
            );
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-slate-900 p-4">
      <Text className="text-2xl font-bold text-white mb-1">Download Courses</Text>
      <Text className="text-slate-400 mb-5">
        Download once → study offline forever. All AI answers stay on your device.
      </Text>

      <FlatList
        data={AVAILABLE_COURSES}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const existing = courses.find((c) => c.id === item.id);
          const isDownloading = downloadingId === item.id;
          const status = existing?.downloadStatus;

          return (
            <View className="bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Text className="text-white font-bold text-lg">{item.code}</Text>
                  <Text className="text-slate-200 mt-0.5">{item.title}</Text>
                  <Text className="text-slate-500 text-sm mt-1">{item.description}</Text>
                  <Text className="text-slate-500 text-xs mt-2">~{item.sizeMB} MB</Text>
                </View>

                {status === "ready" && (
                  <View className="bg-green-900/60 px-2 py-1 rounded-full">
                    <Text className="text-green-400 text-xs font-medium">Ready</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                disabled={!!existing || isDownloading}
                onPress={() => handleDownload(item)}
                className={`mt-4 py-3 rounded-xl flex-row items-center justify-center ${
                  status === "ready"
                    ? "bg-green-900/40"
                    : isDownloading || status === "downloading" || status === "processing"
                    ? "bg-blue-900/60"
                    : "bg-green-600"
                }`}
              >
                {(isDownloading || status === "downloading" || status === "processing") && (
                  <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-semibold">
                  {status === "ready"
                    ? "Downloaded • Available Offline"
                    : status === "processing"
                    ? "Processing materials…"
                    : status === "downloading" || isDownloading
                    ? "Downloading…"
                    : "Download for Offline Use"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
