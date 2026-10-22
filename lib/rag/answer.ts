import { Course } from "../../stores/courseStore";

/**
 * Phase-1 offline answer generator.
 * In production this will:
 * 1. Embed the question
 * 2. Retrieve top-k chunks from local SQLite
 * 3. Build a grounded answer (extractive or small LLM)
 * 4. Return citations
 */
export async function generateAnswer(
  question: string,
  courses: Course[]
): Promise<{
  answer: string;
  citations: { page: number; section: string }[];
  shouldQueue: boolean;
}> {
  const hasReadyCourses = courses.some((c) => c.downloadStatus === "ready");

  if (!hasReadyCourses) {
    return {
      answer:
        "You haven’t downloaded any courses yet. Go to the Download tab, download a course, then come back and ask me.",
      citations: [],
      shouldQueue: false,
    };
  }

  // Simple keyword heuristic for demo (replace with real RAG)
  const lower = question.toLowerCase();

  if (lower.includes("computer") || lower.includes("hardware") || lower.includes("software")) {
    return {
      answer:
        "According to your CIT 101 materials, a computer system consists of hardware (physical components) and software (programs and data). The main hardware units are input, processing (CPU), storage, and output devices.",
      citations: [
        { page: 12, section: "1.2 Components of a Computer System" },
        { page: 15, section: "1.3 Hardware vs Software" },
      ],
      shouldQueue: false,
    };
  }

  if (lower.includes("english") || lower.includes("grammar") || lower.includes("writing")) {
    return {
      answer:
        "From GST 101 – Use of English: Effective academic writing requires clarity, coherence, and correct grammar. Always plan your essay with an introduction, body paragraphs, and a conclusion.",
      citations: [{ page: 8, section: "Unit 2: Essay Writing" }],
      shouldQueue: false,
    };
  }

  // Fallback – queue for tutor
  return {
    answer:
      "I couldn’t find a clear answer in your currently downloaded course materials. I’ve added this question to the Tutor Queue. It will be sent automatically when you next connect to the internet.",
    citations: [],
    shouldQueue: true,
  };
}
