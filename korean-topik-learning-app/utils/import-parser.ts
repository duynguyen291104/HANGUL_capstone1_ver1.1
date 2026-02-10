import { VocabularyItem } from '../lib/types';
import { generateId, normalizeKorean, normalizeVietnamese } from '../lib/utils';

export interface ParseResult {
  success: boolean;
  items: VocabularyItem[];
  errors: string[];
  totalLines: number;
  validLines: number;
}

export function parseVocabularyData(data: string): ParseResult {
  const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const items: VocabularyItem[] = [];
  const errors: string[] = [];
  let validLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i];
    
    // Skip header lines or empty lines
    if (line.toLowerCase().includes('stt') && line.toLowerCase().includes('từ vựng')) {
      continue;
    }

    try {
      const item = parseLine(line, lineNumber);
      if (item) {
        items.push(item);
        validLines++;
      }
    } catch (error) {
      errors.push(`Line ${lineNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    success: errors.length === 0,
    items,
    errors,
    totalLines: lines.length,
    validLines
  };
}

function parseLine(line: string, lineNumber: number): VocabularyItem | null {
  // Split by tab first, then by multiple spaces as fallback
  let parts = line.split('\t');
  if (parts.length < 3) {
    parts = line.split(/\s{2,}/); // Split by 2 or more spaces
  }
  
  if (parts.length < 2) {
    throw new Error('Line must contain at least Korean word and Vietnamese meaning');
  }

  let stt: number | undefined;
  let ko: string;
  let vi: string;

  if (parts.length >= 3) {
    // Format: STT | Korean | Vietnamese
    const sttStr = parts[0].trim();
    ko = parts[1].trim();
    vi = parts[2].trim();
    
    // Try to parse STT
    const sttNum = parseInt(sttStr, 10);
    if (!isNaN(sttNum)) {
      stt = sttNum;
    }
  } else {
    // Format: Korean | Vietnamese
    ko = parts[0].trim();
    vi = parts[1].trim();
  }

  // Validation
  if (!ko || !vi) {
    throw new Error('Both Korean word and Vietnamese meaning are required');
  }

  // Check if Korean contains Hangul characters
  const hasHangul = /[\u3131-\uD79D]/.test(ko);
  if (!hasHangul) {
    console.warn(`Line ${lineNumber}: "${ko}" doesn't contain Hangul characters`);
  }

  // Generate tags based on content (optional)
  const tags = generateTags(ko, vi);

  return {
    id: generateId(),
    stt,
    ko: ko.trim(),
    vi: vi.trim(),
    tags,
    addedAt: Date.now()
  };
}

function generateTags(ko: string, vi: string): string[] {
  const tags: string[] = [];
  const viLower = vi.toLowerCase();
  
  // Basic categorization based on Vietnamese meaning
  if (viLower.includes('màu') || viLower.includes('color')) {
    tags.push('màu sắc');
  }
  if (viLower.includes('đồ ăn') || viLower.includes('thức ăn') || viLower.includes('món')) {
    tags.push('đồ ăn');
  }
  if (viLower.includes('gia đình') || viLower.includes('anh') || viLower.includes('chị') || viLower.includes('em')) {
    tags.push('gia đình');
  }
  if (viLower.includes('thời gian') || viLower.includes('ngày') || viLower.includes('tháng') || viLower.includes('năm')) {
    tags.push('thời gian');
  }
  if (viLower.includes('cơ thể') || viLower.includes('đầu') || viLower.includes('tay') || viLower.includes('chân')) {
    tags.push('cơ thể');
  }
  if (viLower.includes('nghề nghiệp') || viLower.includes('công việc')) {
    tags.push('nghề nghiệp');
  }
  if (viLower.includes('học tập') || viLower.includes('trường') || viLower.includes('giáo')) {
    tags.push('học tập');
  }
  
  return tags;
}

export function exportVocabularyData(items: VocabularyItem[]): string {
  const header = 'STT\tTừ vựng\tNghĩa\tTags\tNgày thêm';
  const rows = items.map((item, index) => {
    const stt = item.stt || index + 1;
    const tags = item.tags?.join(', ') || '';
    const addedDate = item.addedAt ? new Date(item.addedAt).toLocaleDateString('vi-VN') : '';
    return `${stt}\t${item.ko}\t${item.vi}\t${tags}\t${addedDate}`;
  });
  
  return [header, ...rows].join('\n');
}

export function parseCSVData(csvText: string): ParseResult {
  // Simple CSV parser - assumes comma-separated values
  const lines = csvText.split('\n');
  const items: VocabularyItem[] = [];
  const errors: string[] = [];
  let validLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const line = lines[i].trim();
    
    if (!line) continue;
    
    // Skip header
    if (i === 0 && (line.toLowerCase().includes('korean') || line.toLowerCase().includes('từ vựng'))) {
      continue;
    }

    try {
      // Simple CSV parsing - handle commas within quotes
      const columns = parseCSVLine(line);
      
      if (columns.length < 2) {
        errors.push(`Line ${lineNumber}: Need at least Korean word and Vietnamese meaning`);
        continue;
      }

      let stt: number | undefined;
      let ko: string;
      let vi: string;

      if (columns.length >= 3 && !isNaN(parseInt(columns[0].trim()))) {
        stt = parseInt(columns[0].trim());
        ko = columns[1].trim();
        vi = columns[2].trim();
      } else {
        ko = columns[0].trim();
        vi = columns[1].trim();
      }

      if (!ko || !vi) {
        errors.push(`Line ${lineNumber}: Missing Korean word or Vietnamese meaning`);
        continue;
      }

      items.push({
        id: generateId(),
        stt,
        ko,
        vi,
        tags: generateTags(ko, vi),
        addedAt: Date.now()
      });

      validLines++;
    } catch (error) {
      errors.push(`Line ${lineNumber}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  return {
    success: errors.length === 0,
    items,
    errors,
    totalLines: lines.length,
    validLines
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}