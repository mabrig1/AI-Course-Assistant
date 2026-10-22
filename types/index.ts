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

export interface Material {
  id: string;
  courseId: string;
  title: string;
  type: "pdf" | "html" | "text";
  localPath: string;
  pageCount?: number;
  downloadedAt: number;
}

export interface Chunk {
  id: string;
  materialId: string;
  courseId: string;
  content: string;
  pageNumber: number;
  sectionTitle: string;
  chunkIndex: number;
  embedding?: Float32Array;
}

export interface TutorQuestion {
  id: string;
  courseId: string;
  question: string;
  status: "pending" | "sent" | "answered" | "failed";
  createdAt: number;
  tutorReply?: string;
}

export interface Citation {
  page: number;
  section: string;
  snippet?: string;
}
