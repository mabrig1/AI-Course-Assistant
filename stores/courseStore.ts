import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Course {
  id: string;
  code: string;
  title: string;
  downloadStatus: "pending" | "downloading" | "ready" | "error";
  totalSizeBytes?: number;
  lastSyncedAt?: number;
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
  updateCourseStatus: (id: string, status: Course["downloadStatus"]) => void;
  addToTutorQueue: (q: Omit<TutorQuestion, "id" | "createdAt" | "status">) => void;
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

      updateCourseStatus: (id, status) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.id === id ? { ...c, downloadStatus: status } : c
          ),
        })),

      addToTutorQueue: (q) =>
        set((state) => ({
          tutorQueue: [
            {
              ...q,
              id: Date.now().toString(),
              status: "pending",
              createdAt: Date.now(),
            },
            ...state.tutorQueue,
          ],
        })),
    }),
    {
      name: "noun-ai-course-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
