import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "./embeddings.js";

const client = new QdrantClient({
  url: "http://localhost:6333",
  checkCompatibility: false,
});

async function insertPets() {
  try {
    // Dati degli animali
    const petsData = [
      {
        id: 1,
        text: "Havanese dog named Luna, 8 years old, very friendly and playful",
        payload: { name: "Luna", type: "dog", breed: "Havanese", age: 8 },
      },
      {
        id: 2,
        text: "Beagle dog named Fido, 5 years old, loves to run and play fetch",
        payload: { name: "Fido", type: "dog", breed: "Beagle", age: 5 },
      },
      {
        id: 3,
        text: "Tabby cat named Fluffy, 3 years old, independent and curious",
        payload: { name: "Fluffy", type: "cat", breed: "Tabby", age: 3 },
      },
      {
        id: 4,
        text: "African Gray parrot named Carina, 12 years old, very intelligent",
        payload: {
          name: "Carina",
          type: "bird",
          breed: "African Gray",
          age: 12,
        },
      },
      {
        id: 5,
        text: "Golden Retriever puppy named Buddy, 1 year old, energetic and loves people",
        payload: {
          name: "Buddy",
          type: "dog",
          breed: "Golden Retriever",
          age: 1,
        },
      },
    ];

    console.log("Generazione embeddings...");

    // Genera embeddings e crea i punti
    const points = [];
    for (const pet of petsData) {
      console.log(`Processando: ${pet.payload.name}...`);
      const vector = await generateEmbedding(pet.text);

      points.push({
        id: pet.id,
        vector: vector,
        payload: pet.payload,
      });
    }

    // Inserisci i punti nella collezione
    await client.upsert("pets", {
      wait: true,
      points: points,
    });

    console.log(`\n✓ Inseriti ${points.length} animali nella collezione!`);

    // Verifica il conteggio
    const collectionInfo = await client.getCollection("pets");
    console.log(
      `Totale punti nella collezione: ${collectionInfo.points_count}`,
    );
  } catch (error) {
    console.error("Errore durante l'inserimento:", error);
  }
}

insertPets();
