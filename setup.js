import { QdrantClient } from "@qdrant/js-client-rest";
import { Ollama } from "ollama";

// Connettiti a Qdrant (in locale)
const qdrantClient = new QdrantClient({
  url: "http://localhost:6333",
  checkCompatibility: false,
});

// Connettiti a Ollama
const ollama = new Ollama({ host: "http://localhost:11434" });

async function setup() {
  try {
    // Prima verifica se la collezione esiste già
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === "pets",
    );

    if (collectionExists) {
      console.log('Collezione "pets" già esistente. Eliminazione...');
      await qdrantClient.deleteCollection("pets");
    }

    // Genera un embedding di test per ottenere la dimensione
    const testEmbedding = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: "test",
    });

    const vectorSize = testEmbedding.embedding.length;
    console.log(`Dimensione vettori: ${vectorSize}`);

    // Crea la collezione "pets"
    await qdrantClient.createCollection("pets", {
      vectors: {
        size: vectorSize, // nomic-embed-text genera vettori di 768 dimensioni
        distance: "Cosine", // metrica di distanza: Cosine, Euclid, Dot
      },
    });

    console.log('Collezione "pets" creata con successo!');

    // Verifica che la collezione esista
    const allCollections = await qdrantClient.getCollections();
    console.log(
      "Collezioni disponibili:",
      allCollections.collections.map((c) => c.name),
    );
  } catch (error) {
    console.error("Errore durante il setup:", error);
  }
}

setup();
