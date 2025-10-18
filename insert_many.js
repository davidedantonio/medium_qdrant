import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "./embeddings.js";

const client = new QdrantClient({ url: "http://localhost:6333" });

const names = [
  "Luna",
  "Fido",
  "Fluffy",
  "Carina",
  "Spot",
  "Beethoven",
  "Baxter",
  "Max",
  "Bella",
  "Charlie",
];
const types = ["dog", "cat", "bird", "reptile"];
const breeds = [
  "Havanese",
  "Bichon Frise",
  "Beagle",
  "Cockatoo",
  "African Gray",
  "Tabby",
  "Iguana",
  "Golden Retriever",
];
const adjectives = [
  "friendly",
  "playful",
  "curious",
  "intelligent",
  "energetic",
  "calm",
  "independent",
  "loving",
  "shy",
  "brave",
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAge() {
  return Math.floor(Math.random() * 15) + 1;
}

async function insertManyPets() {
  try {
    const batchSize = 50; // Processa 50 alla volta
    const totalPets = 1000;
    let currentId = 6; // Partiamo da 6 perché 1-5 sono già usati

    console.log(
      `Inserimento di ${totalPets} animali in batch da ${batchSize}...\n`,
    );

    for (let batch = 0; batch < totalPets / batchSize; batch++) {
      const points = [];

      console.log(`Batch ${batch + 1}/${totalPets / batchSize}...`);

      for (let i = 0; i < batchSize; i++) {
        const name = getRandomItem(names);
        const type = getRandomItem(types);
        const breed = getRandomItem(breeds);
        const age = getRandomAge();
        const personality = getRandomItem(adjectives);

        const text = `${breed} ${type} named ${name}, ${age} years old, ${personality}`;

        // Genera embedding
        const vector = await generateEmbedding(text);

        points.push({
          id: currentId++,
          vector: vector,
          payload: {
            name: name,
            type: type,
            breed: breed,
            age: age,
            personality: personality,
          },
        });
      }

      // Inserisci il batch
      await client.upsert("pets", {
        wait: true,
        points: points,
      });

      console.log(
        `  ✓ Batch ${batch + 1} completato (${points.length} animali)`,
      );
    }

    // Verifica il conteggio finale
    const collectionInfo = await client.getCollection("pets");
    console.log(
      `\n✓ Totale punti nella collezione: ${collectionInfo.points_count}`,
    );
  } catch (error) {
    console.error("Errore durante l'inserimento:", error);
  }
}

insertManyPets();
