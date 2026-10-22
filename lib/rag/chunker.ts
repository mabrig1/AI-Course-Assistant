/**
 * Simple text chunker for course materials.
 * In production: better sentence-aware chunking + overlap.
 */

export interface Chunk {
  content: string;
  pageNumber: number;
  sectionTitle: string;
  chunkIndex: number;
}

export function chunkText(
  text: string,
  options: {
    chunkSize?: number;
    overlap?: number;
    pageNumber?: number;
    sectionTitle?: string;
  } = {}
): Chunk[] {
  const {
    chunkSize = 500,
    overlap = 80,
    pageNumber = 1,
    sectionTitle = "General",
  } = options;

  const chunks: Chunk[] = [];
  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end).trim();

    if (content.length > 50) {
      chunks.push({
        content,
        pageNumber,
        sectionTitle,
        chunkIndex: index++,
      });
    }

    start += chunkSize - overlap;
  }

  return chunks;
}
