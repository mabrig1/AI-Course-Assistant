/**
 * Offline tutor question queue + background sync logic.
 */

import { getDB } from "../db";

export async function enqueueTutorQuestion(
  courseId: string,
  question: string,
  contextSnippet?: string
) {
  const db = await getDB();
  const id = `tq_${Date.now()}`;

  await db.runAsync(
    `INSERT INTO tutor_queue (id, course_id, question, context_snippet, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`,
    [id, courseId, question, contextSnippet || null, Date.now()]
  );

  return id;
}

export async function getPendingQuestions() {
  const db = await getDB();
  return db.getAllAsync(
    `SELECT * FROM tutor_queue WHERE status = 'pending' ORDER BY created_at ASC`
  );
}

export async function markAsSent(id: string) {
  const db = await getDB();
  await db.runAsync(
    `UPDATE tutor_queue SET status = 'sent', sent_at = ? WHERE id = ?`,
    [Date.now(), id]
  );
}
