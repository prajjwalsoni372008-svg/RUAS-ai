# SpecForge - Course Specification Builder

An accreditation review workspace and curriculum specification studio for engineering departments aligned with **NBA (National Board of Accreditation)** and **Washington Accord Tier-1** graduate attributes.

## Quick Start & Run Steps

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server** (Runs Express API + Vite frontend on port 3000):
   ```bash
   npm run dev
   ```

3. **Check Code & Type Safety**:
   ```bash
   npm run check
   ```

4. **Run Full Verification & Generate Output Dossiers**:
   ```bash
   npm run verify
   ```
   Generates `outputs/specforge_output.json` and `outputs/spec.html` for portal evaluation.

## AI Tools & Infrastructure

- **LLM Engine**: Google Gemini API via `@google/genai` TypeScript SDK (supported models: `gemini-2.5-flash`, `gemini-2.5-pro`), with multi-provider routing (OpenAI, Anthropic, Custom endpoints).
- **Security & Headers**: Client-side private key storage in browser `localStorage`. Dispatched exclusively via HTTP headers (`x-llm-provider`, `x-llm-key`, `x-llm-model`) with zero server disk logging.
- **Document Ingestion**: Server-side extraction supporting Word (`mammoth`, `word-extractor`), PDF (`pdf-parse`), and HTML (`cheerio`) with strict `zod` schema validation.
- **Annexure A Reference**: Program Outcomes (PO1–PO12), Program Specific Outcomes (PSO1–PSO3), and Bloom's Revised Taxonomy levels (L1–L6) dynamically managed in `config/po_pso.json`.
