# SpecForge Architecture & Agent Guide

## 5-Line Application Architecture Summary
1. **Frontend (`src/`)**: Modular React 19 SPA with full dark canvas theme, featuring the Course Outcomes Studio, interactive $12 \times 3$ CO-PO matrix, and dynamic Annexure A drawer.
2. **Backend (`server.ts` & `server/`)**: Express service running on port 3000 that serves `GET /api/v1/health`, `GET /api/v1/llm-check`, `POST /api/v1/parse`, and `POST /api/v1/generate`.
3. **AI Gatekeeper (`server/llm.ts`)**: The single server-side module that interfaces with AI, receiving ephemeral keys via `x-llm-*` headers without persisting keys to disk or git.
4. **Ingestion & Validation (`server/parsers.ts` & `server/schema.ts`)**: Multipart file extractors (Mammoth, pdf-parse, Cheerio, WordExtractor) producing Zod-validated course specifications.
5. **Accreditation Config (`config/po_pso.json` & `config/specforge_output.schema.json`)**: Statutory reference databases powering dynamic tooltips, matrix mathematics, and JSON schema compliance.
