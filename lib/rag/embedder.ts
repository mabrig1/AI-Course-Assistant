/**
 * Embedding skeleton.
 * Phase 1: placeholder.
 * Phase 2: load quantized sentence-transformers via ONNX Runtime Mobile / TFLite.
 */

export async function embedText(text: string): Promise<Float32Array> {
  // TODO: Replace with real on-device embedding model
  // For now return a deterministic fake vector based on text length + hash
  const dim = 384; // all-MiniLM-L6-v2 style
  const vector = new Float32Array(dim);

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let i = 0; i < dim; i++) {
    vector[i] = Math.sin(hash * (i + 1) * 0.001) * 0.1;
  }

  return vector;
}

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-8);
}
