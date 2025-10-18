import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "./embeddings.js";

const client = new QdrantClient({
  url: "http://localhost:6333",
  checkCompatibility: false,
});

async function searchWithFilter(queryText, filter, limit = 5) {
  try {
    console.log(`\n🔍 Ricerca: "${queryText}"`);
    console.log(`📋 Filtri:`, JSON.stringify(filter, null, 2), "\n");

    const queryVector = await generateEmbedding(queryText);

    const results = await client.search("pets", {
      vector: queryVector,
      filter: filter,
      limit: limit,
    });

    console.log(`Trovati ${results.length} risultati:\n`);

    results.forEach((result, index) => {
      console.log(`${index + 1}. Score: ${result.score.toFixed(4)}`);
      console.log(
        `   ${result.payload.name} - ${result.payload.breed} ${result.payload.type}`,
      );
      console.log(
        `   Età: ${result.payload.age} anni, Personalità: ${result.payload.personality || "N/A"}`,
      );
      console.log("---");
    });
  } catch (error) {
    console.error("Errore durante la ricerca:", error);
  }
}

async function runFilteredSearches() {
  // ESEMPIO 1: Filtro semplice con AND
  // Cerca solo cani giovani (età < 5) e giocherelloni
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 1: Filtro AND - Cani giovani");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("playful energetic companion", {
    must: [
      { key: "type", match: { value: "dog" } },
      { key: "age", range: { lt: 5 } },
    ],
  });

  // ESEMPIO 2: Filtro con OR
  // Cerca gatti O uccelli indipendenti
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 2: Filtro OR - Gatti o Uccelli");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("independent pet that doesn't need much attention", {
    should: [
      { key: "type", match: { value: "cat" } },
      { key: "type", match: { value: "bird" } },
    ],
  });

  // ESEMPIO 3: Filtro con NOT
  // Cerca animali anziani (età > 10) ma NON rettili
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 3: Filtro NOT - Anziani ma no rettili");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("wise elderly pet with lots of experience", {
    must: [{ key: "age", range: { gt: 10 } }],
    must_not: [{ key: "type", match: { value: "reptile" } }],
  });

  // ESEMPIO 4: Range combinato
  // Cerca animali di età media (tra 5 e 10 anni)
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 4: Range - Età media (5-10 anni)");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("mature but still active pet", {
    must: [{ key: "age", range: { gte: 5, lte: 10 } }],
  });

  // ESEMPIO 5: Match Any - Razze specifiche
  // Cerca specifiche razze di cani
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 5: Match Any - Razze specifiche");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter(
    "loyal family dog",
    {
      must: [
        { key: "type", match: { value: "dog" } },
        {
          key: "breed",
          match: {
            any: ["Golden Retriever", "Beagle", "Havanese"],
          },
        },
      ],
    },
    10,
  );

  // ESEMPIO 6: Condizioni annidate complesse
  // Cerca: Cani CHE SIANO (cuccioli O energici) MA NON aggressivi
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 6: Logica complessa annidata");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("perfect family pet safe with children", {
    must: [
      { key: "type", match: { value: "dog" } },
      {
        should: [
          { key: "age", range: { lte: 3 } },
          { key: "personality", match: { value: "energetic" } },
        ],
      },
    ],
    must_not: [{ key: "personality", match: { value: "aggressive" } }],
  });

  // ESEMPIO 7: Solo filtri, nessuna ricerca semantica
  // Utile quando vuoi solo filtrare senza ordinare per similarità
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 7: Solo filtri - Tutti i gatti");
  console.log("═══════════════════════════════════════════");

  // Usa un vettore "neutro" per ottenere risultati senza preferenze semantiche
  const neutralVector = new Array(768).fill(0);

  const results = await client.search("pets", {
    vector: neutralVector,
    filter: {
      must: [{ key: "type", match: { value: "cat" } }],
    },
    limit: 5,
  });

  console.log(`Trovati ${results.length} gatti (ordinamento casuale):\n`);
  results.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.payload.name} - ${result.payload.breed}`,
    );
  });

  // ESEMPIO 8: Filtro con Match Except
  // Cerca cani, escluse personalità specifiche
  console.log("\n═══════════════════════════════════════════");
  console.log("ESEMPIO 8: Match Except - Escludi personalità");
  console.log("═══════════════════════════════════════════");

  await searchWithFilter("friendly social dog", {
    must: [
      { key: "type", match: { value: "dog" } },
      {
        key: "personality",
        match: {
          except: ["aggressive", "shy", "independent"],
        },
      },
    ],
  });
}

runFilteredSearches();
