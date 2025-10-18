import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://localhost:11434" });

/**
 * Genera un embedding per un testo usando Ollama
 */
export async function generateEmbedding(text) {
  try {
    const response = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: text,
    });

    return response.embedding;
  } catch (error) {
    console.error("Errore durante la generazione dell'embedding:", error);
    throw error;
  }
}

/**
 * Genera embeddings per un array di testi
 */
export async function generateEmbeddings(texts) {
  const embeddings = [];

  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    embeddings.push(embedding);
  }

  return embeddings;
}
