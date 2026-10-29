import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { generateSpecForgeCurriculum, generateJson } from './server/llm';
import { extractTextFromFile } from './server/parsers';
import { ParsedCourseSpecificationSchema } from './server/schema';

dotenv.config();

const app = express();
const port = 3000;

// Configure multer memory storage for document uploads (up to 25MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(express.json({ limit: '10mb' }));

// (4) GET /api/v1/health returning { success: true, data: { status: 'up' } }
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'up'
    }
  });
});

// GET /api/v1/llm-check
app.get('/api/v1/llm-check', (req: Request, res: Response) => {
  const provider = (req.headers['x-llm-provider'] as string) || 'gemini';
  const model = (req.headers['x-llm-model'] as string) || 'gemini-2.5-flash';
  const hasKey = Boolean(req.headers['x-llm-key'] || process.env.GEMINI_API_KEY);

  res.json({
    success: true,
    data: {
      status: 'ok',
      provider,
      model,
      keyConfigured: hasKey
    }
  });
});

// POST /api/v1/parse (multipart/form-data, fields 'spec' and 'blueprint')
app.post(
  '/api/v1/parse',
  upload.fields([
    { name: 'spec', maxCount: 1 },
    { name: 'blueprint', maxCount: 1 }
  ]),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
      const specFile = files?.['spec']?.[0];
      const blueprintFile = files?.['blueprint']?.[0];

      if (!specFile) {
        return res.status(400).json({
          success: false,
          error: 'Course specification file is required. Please upload a .docx, .pdf, .html, or .doc file.'
        });
      }

      // Extract text from course specification
      const specDoc = await extractTextFromFile(specFile);

      // Extract optional question-paper blueprint
      let blueprintDoc = undefined;
      if (blueprintFile) {
        blueprintDoc = await extractTextFromFile(blueprintFile);
      }

      // Call generateJson from server/llm.ts
      const structuredData = await generateJson(
        specDoc.text,
        blueprintDoc?.text || '',
        req
      );

      // Validate result with Zod
      const validatedData = ParsedCourseSpecificationSchema.parse(structuredData);

      return res.json({
        success: true,
        data: validatedData,
        meta: {
          specFilename: specDoc.filename,
          specFormat: specDoc.extension,
          hasBlueprint: Boolean(blueprintDoc)
        }
      });
    } catch (err: any) {
      console.error('Document parsing error:', err);
      return res.status(422).json({
        success: false,
        error: err?.message || 'Failed to extract and structure document data.'
      });
    }
  }
);

// POST /api/v1/generate returning format in config/specforge_output.schema.json
app.post('/api/v1/generate', async (req: Request, res: Response) => {
  try {
    const result = await generateSpecForgeCurriculum(req);
    res.setHeader('Content-Type', 'application/json');
    res.json(result);
  } catch (error: any) {
    console.error('Error generating curriculum specification:', error);
    res.status(500).json({
      error: 'Failed to generate curriculum specification',
      message: error?.message || 'Unknown error'
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SpecForge Studio server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
