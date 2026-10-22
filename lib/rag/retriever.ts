/**
 * Offline retriever skeleton.
 * Phase 1: simple keyword / future vector search over local chunks.
 */

import { getDB } from "../db";

export async function retrieveRelevantChunks(
  courseId: string,
  query: string,
  topK = 5
) {
  const db = await getDB();

  // Placeholder – real implementation will do cosine similarity on embeddings
  const rows = await db.getAllAsync(
    `SELECT * FROM chunks 
     WHERE course_id = ? 
     AND content LIKE ? 
     LIMIT ?`,
    [courseId, `%${query.split(" ")[0]}%`, topK]
  );

  return rows;
}
