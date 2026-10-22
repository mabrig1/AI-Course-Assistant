# AI Course Assistant for NOUN Students

**Offline-First AI Course Assistant** built for students of the National Open University of Nigeria (NOUN).

## Problem
NOUN students study remotely under high data costs and unstable internet. They often wait days for tutor feedback.

## Solution
A mobile app that lets students download course materials once (preferably on Wi-Fi). After download they can ask unlimited questions **fully offline**. The AI answers only from the student’s own materials and cites the exact page/section. Questions the AI cannot answer are automatically queued and sent to the tutor when connectivity returns.

## Key Features (MVP)
- Offline-first architecture
- Download course materials (PDF + text)
- Local chunking + embeddings + retrieval (RAG)
- Grounded answers with citations
- Tutor follow-up queue (offline → auto-submit when online)
- Designed for low-end Android devices (Android 8+, 2GB RAM)
- Clear data usage indicators

## Tech Stack
- **Framework**: React Native + Expo (SDK 52+)
- **Navigation**: Expo Router
- **Local DB**: expo-sqlite
- **State**: Zustand
- **UI**: NativeWind + React Native Paper
- **Offline RAG**: Local embeddings + SQLite vector search (Phase 1) → small on-device LLM (Phase 2)

## Getting Started

```bash
npm install
npx expo start
```

## Project Structure
```
app/                  # Expo Router screens
components/           # Reusable UI components
lib/
  db.ts               # SQLite setup
  rag/                # Offline RAG pipeline
  sync/               # Moodle + queue logic
stores/               # Zustand stores
types/                # TypeScript types
```

## Roadmap
- **MVP**: Offline RAG + download manager + tutor queue
- **Phase 2**: On-device small LLM, full Moodle Web Services, admin dashboard

## License
MIT (or as agreed with NOUN partnership)

---
Built for Nigerian students. Privacy-first. Offline by design.
