# Dalle keywords al significato: effettuare ricerche semantiche in Qdrant

Questo repository contiene gli esempi pratici dell'articolo Medium 
["Dalle keywords al significato: effettuare ricerche semantiche in Qdrant"](https://davide-dantonio.medium.com/dalle-keywords-al-significato-effettuare-ricerche-semantiche-in-qdrant-47a28c3464e5).

Imparerai come implementare un sistema di ricerca semantica utilizzando Qdrant come vector database e embeddings per catturare il significato dei testi.

## 🚀 Quick Start

### Prerequisiti
- Node.js (v20 o superiore)
- Docker (per l'installazione locale di Qdrant)

### Installazione delle dipendenze
```bash
npm install
```

## 📦 Installare Qdrant

Questa tipologia di installazione prevede che tu abbia **Docker** installato sulla tua macchina.

In caso contrario, visita il [sito ufficiale di Qdrant](https://qdrant.tech/documentation/guides/installation/) per effettuare l'installazione che preferisci.

### Setup con Docker

Dal terminale, eseguire lo script `setup.sh` con il comando:
```bash
sh setup.sh
```

Questo avvierà un'istanza locale di Qdrant accessibile su `http://localhost:6333`.

## 🎯 Esecuzione degli esempi

[Aggiungi qui i comandi per eseguire i tuoi script di esempio]
```bash
# Esempio: creazione collection
npm run setup

# Esempio: creazione collection
npm run insert
node insrt_many.js

# Esempio: ricerca semantica
npm start
```

## 📚 Contenuto del repository

- Script dimostrativi degli esempi nell'articolo
- `setup.sh` - Script per avviare Qdrant con Docker

## 🔗 Link utili

- 📖 [Articolo completo su Medium](https://davide-dantonio.medium.com/dalle-keywords-al-significato-effettuare-ricerche-semantiche-in-qdrant-47a28c3464e5)
- 📘 [Documentazione Qdrant](https://qdrant.tech/documentation/)
- 🐙 [Qdrant GitHub](https://github.com/qdrant/qdrant)

## 🤝 Contributi

Feedback e contributi sono benvenuti! Sentiti libero di aprire issue o pull request.

## 📄 Licenza

MIT

---

⭐ Se questo repository ti è stato utile, lascia una stella!
