import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Course {
  id: string;
  code: string;
  title: string;
  downloadStatus: "pending" | "downloading" | "processing" | "ready" | "error";
  totalSizeBytes?: number;
  lastSyncedAt?: number;
  materialCount?: number;
  chunkCount?: number;
}

export interface TutorQuestion {
  id: string;
  courseId: string;
  question: string;
  status: "pending" | "sent" | "answered" | "failed";
  createdAt: number;
  tutorReply?: string;
}

interface CourseState {
  courses: Course[];
  tutorQueue: TutorQuestion[];
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  updateCourseStatus: (id: string, status: Course["downloadStatus"]) => void;
  addToTutorQueue: (q: { courseId: string; question: string }) => void;
  clearTutorQueue: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      courses: [],
      tutorQueue: [],

      addCourse: (course) =>
        set((state) => ({
          courses: [...state.courses.filter((c) => c.id !== course.id), course],
        })),

      updateCourse: (id, updates) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),

      updateCourseStatus: (id, status) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, downloadStatus: status } : c
          ),
        })),

      addToTutorQueue: ({ courseId, question }) =>
        set((state) => ({
          tutorQueue: [
            {
              id: `tq_${Date.now()}`,
              courseId,
              question,
              status: "pending",
              createdAt: Date.now(),
            },
            ...state.tutorQueue,
          ],
        })),

      clearTutorQueue: () => set({ tutorQueue: [] }),
    }),
    {
      name: "noun-ai-course-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
