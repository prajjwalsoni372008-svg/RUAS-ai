import mammoth from 'mammoth';
import * as cheerio from 'cheerio';

// Safe dynamic require for libraries with varied export formats
let PDFParseClass: any = null;
try {
  const pdfModule = require('pdf-parse');
  PDFParseClass = pdfModule.PDFParse || pdfModule.default || pdfModule;
} catch (e) {
  // handled at runtime
}

let WordExtractorClass: any = null;
try {
  WordExtractorClass = require('word-extractor');
} catch (e) {
  // handled at runtime
}

export interface ExtractedDocument {
  filename: string;
  extension: string;
  text: string;
  tables?: string[];
}

/**
 * Extracts raw text and structure from .docx, .pdf, .html, and .doc files.
 */
export async function extractTextFromFile(file: Express.Multer.File): Promise<ExtractedDocument> {
  const filename = file.originalname || 'document';
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  try {
    switch (ext) {
      case 'docx': {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return {
          filename,
          extension: ext,
          text: result.value || ''
        };
      }

      case 'pdf': {
        if (!PDFParseClass) {
          throw new Error('pdf-parse is not available');
        }
        if (typeof PDFParseClass === 'function' && PDFParseClass.prototype?.load) {
          const parser = new PDFParseClass({ data: file.buffer });
          await parser.load();
          const textResult = await parser.getText();
          return {
            filename,
            extension: ext,
            text: typeof textResult === 'string' ? textResult : (textResult?.text || '')
          };
        } else if (typeof PDFParseClass === 'function') {
          const data = await PDFParseClass(file.buffer);
          return {
            filename,
            extension: ext,
            text: data.text || ''
          };
        }
        throw new Error('Unable to initialize PDF parser');
      }

      case 'html':
      case 'htm': {
        const html = file.buffer.toString('utf-8');
        const $ = cheerio.load(html);
        $('script, style, noscript').remove();
        const text = $('body').text().replace(/\s+/g, ' ').trim();
        return {
          filename,
          extension: ext,
          text
        };
      }

      case 'doc': {
        if (!WordExtractorClass) {
          throw new Error('word-extractor is not available');
        }
        const extractor = new WordExtractorClass();
        const extracted = await extractor.extract(file.buffer);
        const text = extracted.getBody();
        return {
          filename,
          extension: ext,
          text: text || ''
        };
      }

      default:
        throw new Error(`Unsupported document extension .${ext}. Allowed formats are .docx, .pdf, .html, and .doc`);
    }
  } catch (err: any) {
    throw new Error(`Failed to extract content from ${filename}: ${err?.message || 'Corrupted or unreadable document.'}`);
  }
}
