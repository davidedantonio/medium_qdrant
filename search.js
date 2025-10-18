import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "./embeddings.js";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const client = new QdrantClient({
  url: "http://localhost:6333",
  checkCompatibility: false,
});

async function searchPets(queryText, limit = 5) {
  try {
    console.log(`\n🔍 Ricerca: "${queryText}"\n`);

    // Genera embedding per la query
    const queryVector = await generateEmbedding(queryText);

    // Cerca i punti più simili
    const results = await client.search("pets", {
      vector: queryVector,
      limit: limit,
    });

    console.log(`Trovati ${results.length} risultati:\n`);

    results.forEach((result, index) => {
      console.log(`${index + 1}. Score: ${result.score.toFixed(4)}`);
      console.log(`   Nome: ${result.payload.name}`);
      console.log(`   Tipo: ${result.payload.type}`);
      console.log(`   Razza: ${result.payload.breed}`);
      console.log(`   Età: ${result.payload.age} anni`);
      if (result.payload.personality) {
        console.log(`   Personalità: ${result.payload.personality}`);
      }
      console.log("---");
    });
  } catch (error) {
    console.error("Errore durante la ricerca:", error);
  }
}

async function askQuestion() {
  let answer = await rl.question(
    'Inserisci la tua domanda (o "exit" per uscire): ',
  );
  while (answer.toLowerCase() !== "exit") {
    await searchPets(answer);
    answer = await rl.question(
      'Inserisci la tua domanda (o "exit" per uscire): ',
    );
  }
  rl.close();
}

askQuestion();
