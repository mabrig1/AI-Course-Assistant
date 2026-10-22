import { Course } from "../../stores/courseStore";

export interface AnswerResult {
  answer: string;
  citations: { page: number; section: string }[];
  shouldQueue: boolean;
  courseId?: string;
}

/**
 * Phase-1 offline answer generator.
 * Uses keyword + simple matching against known course content.
 * Later this will call real local embeddings + retriever.
 */
export async function generateAnswer(
  question: string,
  courses: Course[]
): Promise<AnswerResult> {
  const readyCourses = courses.filter((c) => c.downloadStatus === "ready");

  if (readyCourses.length === 0) {
    return {
      answer:
        "You haven’t downloaded any courses yet.\n\nGo to the Download tab, download at least one course, then come back and ask me. I only answer from materials you have stored on this device.",
      citations: [],
      shouldQueue: false,
    };
  }

  const lower = question.toLowerCase().trim();

  // ---------- CIT 101 ----------
  if (
    lower.includes("computer") ||
    lower.includes("hardware") ||
    lower.includes("software") ||
    lower.includes("cpu") ||
    lower.includes("input device") ||
    lower.includes("output device")
  ) {
    return {
      answer:
        "According to your CIT 101 materials, a computer system is made up of hardware and software.\n\n• Hardware = the physical parts (keyboard, mouse, monitor, CPU, storage).\n• Software = the programs and instructions that tell the hardware what to do.\n\nThe four main hardware units are: Input, Processing (CPU), Storage, and Output.",
      citations: [
        { page: 12, section: "1.2 Components of a Computer System" },
        { page: 15, section: "1.3 Hardware vs Software" },
      ],
      shouldQueue: false,
      courseId: "cit101",
    };
  }

  if (lower.includes("operating system") || lower.includes("os ") || lower.includes("windows") || lower.includes("linux")) {
    return {
      answer:
        "From CIT 101: An Operating System (OS) is system software that manages computer hardware and software resources and provides common services for computer programs. Examples include Windows, macOS, Linux, and Android.",
      citations: [{ page: 28, section: "2.1 Introduction to Operating Systems" }],
      shouldQueue: false,
      courseId: "cit101",
    };
  }

  // ---------- GST 101 ----------
  if (
    lower.includes("english") ||
    lower.includes("grammar") ||
    lower.includes("essay") ||
    lower.includes("writing") ||
    lower.includes("paragraph") ||
    lower.includes("sentence")
  ) {
    return {
      answer:
        "From GST 101 – Use of English:\n\nEffective academic writing requires clarity, coherence and correct grammar. A good essay usually has:\n\n1. Introduction (with thesis statement)\n2. Body paragraphs (each with a topic sentence)\n3. Conclusion\n\nAlways plan before you write.",
      citations: [
        { page: 8, section: "Unit 2: Essay Writing" },
        { page: 14, section: "Unit 3: Paragraph Development" },
      ],
      shouldQueue: false,
      courseId: "gst101",
    };
  }

  // ---------- MTH 101 ----------
  if (
    lower.includes("algebra") ||
    lower.includes("equation") ||
    lower.includes("quadratic") ||
    lower.includes("mathematics") ||
    lower.includes("set theory") ||
    lower.includes("number system")
  ) {
    return {
      answer:
        "From MTH 101 – Elementary Mathematics:\n\nA quadratic equation is any equation that can be written in the form ax² + bx + c = 0 (where a ≠ 0). Solutions can be found by factoring, completing the square, or using the quadratic formula.\n\nThe quadratic formula is: x = [-b ± √(b² - 4ac)] / 2a", 
      citations: [
        { page: 22, section: "3.2 Quadratic Equations" },
        { page: 9, section: "1.4 Number Systems" },
      ],
      shouldQueue: false,
      courseId: "mth101",
    };
  }

  // ---------- CSS 101 ----------
  if (
    lower.includes("sociology") ||
    lower.includes("society") ||
    lower.includes("culture") ||
    lower.includes("socialization") ||
    lower.includes("institution")
  ) {
    return {
      answer:
        "From CSS 101 – Introduction to Sociology:\n\nSociology is the scientific study of society, social relationships, and social institutions. Key concepts include culture, socialization, social structure, and social change.\n\nCulture consists of the shared beliefs, values, norms and material objects of a group.",
      citations: [
        { page: 5, section: "1.1 What is Sociology?" },
        { page: 18, section: "2.3 Culture and Society" },
      ],
      shouldQueue: false,
      courseId: "css101",
    };
  }

  // Fallback – queue for tutor
  const primaryCourse = readyCourses[0];
  return {
    answer:
      "I couldn’t find a clear answer in your currently downloaded course materials.\n\nI’ve added this question to the Tutor Queue. It will be sent automatically to your NOUN tutor when you next connect to the internet.\n\nYou can check the status in the Tutor Queue tab.",
    citations: [],
    shouldQueue: true,
    courseId: primaryCourse.id,
  };
}
