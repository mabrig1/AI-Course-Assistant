# AI Course Assistant for NOUN Students

**Offline-First AI Course Assistant** for National Open University of Nigeria (NOUN) students.

## Problem
NOUN students study remotely under high data costs and unstable internet. They often wait days for tutor feedback.

## Solution
Download course materials once (preferably on Wi-Fi). Ask unlimited questions **fully offline**. The AI answers only from the student’s own materials and cites page/section. Unanswerable questions are queued and auto-sent to the tutor when connectivity returns.

## Current Status (v0.2)
- Working Expo Router + tab navigation
- Offline-first Zustand store (persisted)
- Download flow with realistic processing simulation
- Offline RAG skeleton with grounded answers + citations
- Tutor Queue fully wired (questions the AI cannot answer are saved)
- SQLite schema ready for production offline storage
- Designed for Android 8+ / low-end devices

## Key Features
- Offline-first architecture
- Download course materials
- Local chunking + retrieval (RAG)
- Grounded answers with citations
- Tutor follow-up queue
- Clear data usage indicators

## Tech Stack
- React Native + Expo (SDK 52+)
- Expo Router
- expo-sqlite
- Zustand + AsyncStorage
- NativeWind + React Native Paper

## Getting Started

```bash
git clone https://github.com/mabrig1/AI-Course-Assistant.git
cd AI-Course-Assistant
npm install
npx expo start
```

## Project Structure
```
app/                  # Screens (Expo Router)
components/           # UI components (coming)
lib/
  db.ts               # SQLite
  rag/                # Offline RAG pipeline
  sync/               # Queue + future Moodle
stores/               # Zustand
types/
```

## Roadmap
- **v0.3**: Real PDF text extraction + local embeddings
- **v0.4**: Moodle Web Services layer
- **Phase 2**: On-device small LLM + Admin dashboard

## License
MIT (open for NOUN partnership discussion)

---
Built for Nigerian students. Privacy-first. Offline by design.
