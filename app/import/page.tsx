'use client';

import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle2, XCircle, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { parseVocabularyData, parseCSVData } from '../../utils/import-parser';
import { useVocabularyStore } from '../../stores/vocabulary';
import { sampleTSVData, sampleVocabulary } from '../../data/sample-vocab';

export default function ImportPage() {
  const [importData, setImportData] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<any>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { addVocabulary } = useVocabularyStore();

  const handleTextImport = () => {
    if (!importData.trim()) return;

    const result = parseVocabularyData(importData);
    setParseResult(result);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
        
        // Auto-parse based on file type
        const result = selectedFile.name.endsWith('.csv') 
          ? parseCSVData(content)
          : parseVocabularyData(content);
        setParseResult(result);
      };
      reader.readAsText(selectedFile, 'UTF-8');
    }
  };

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.items.length === 0) return;

    setIsImporting(true);
    try {
      await addVocabulary(parseResult.items);
      setImportStatus('success');
      setImportData('');
      setFile(null);
      setParseResult(null);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = () => {
    setImportData('');
    setFile(null);
    setParseResult(null);
    setImportStatus('idle');
  };

  const handleLoadSampleData = async () => {
    setIsImporting(true);
    try {
      await addVocabulary(sampleVocabulary);
      setImportStatus('success');
    } catch (error) {
      console.error('Sample data loading failed:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
    }
  };

  const sampleData = `STT	Từ vựng	Nghĩa
1	안녕하세요	Xin chào
2	감사합니다	Cảm ơn
3	죄송합니다	Xin lỗi
4	네	Vâng
5	아니요	Không`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Import từ vựng</h1>
          <p className="text-muted-foreground">
            Nhập dữ liệu từ vựng để bắt đầu học tập
          </p>
        </div>
      </div>

      {/* Import Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Text Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Import từ văn bản
            </CardTitle>
            <CardDescription>
              Dán dữ liệu từ Excel hoặc Google Sheets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Dữ liệu từ vựng (định dạng: STT | Từ vựng | Nghĩa)
              </label>
              <textarea
                className="w-full h-32 mt-2 p-3 border rounded-md resize-none font-mono text-sm"
                placeholder={`Dán dữ liệu tại đây...\n\nVí dụ:\n${sampleData}`}
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </div>
            <Button onClick={handleTextImport} className="w-full">
              Phân tích dữ liệu
            </Button>
          </CardContent>
        </Card>

        {/* File Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import từ file
            </CardTitle>
            <CardDescription>
              Upload file .txt, .csv hoặc .tsv
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="file"
                accept=".txt,.csv,.tsv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            {file && (
              <div className="text-sm text-muted-foreground">
                File được chọn: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
            <Button
              onClick={() => {
                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                fileInput?.click();
              }}
              variant="outline"
              className="w-full"
            >
              Chọn file
            </Button>
          </CardContent>
        </Card>

        {/* Sample Data Loading */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Demo Data
            </CardTitle>
            <CardDescription>
              Load 50 sample Korean TOPIK 1 vocabulary words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Quickly get started with sample vocabulary including basic greetings, family terms, food, and common verbs.
            </div>
            <Button 
              onClick={handleLoadSampleData}
              disabled={isImporting}
              className="w-full"
            >
              {isImporting ? 'Loading...' : 'Load Sample Data'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Sample Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Dữ liệu mẫu
          </CardTitle>
          <CardDescription>
            Sao chép định dạng mẫu để import dễ dàng hơn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm font-mono overflow-x-auto">
            {sampleData}
          </pre>
          <Button
            variant="outline"
            onClick={() => navigator.clipboard.writeText(sampleData)}
            className="mt-4"
          >
            Sao chép mẫu
          </Button>
        </CardContent>
      </Card>

      {/* Parse Results */}
      {parseResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {parseResult.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Kết quả phân tích
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {parseResult.validLines}
                </div>
                <div className="text-sm text-muted-foreground">Từ hợp lệ</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">
                  {parseResult.totalLines}
                </div>
                <div className="text-sm text-muted-foreground">Tổng dòng</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {parseResult.errors.length}
                </div>
                <div className="text-sm text-muted-foreground">Lỗi</div>
              </div>
            </div>

            {parseResult.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-destructive mb-2">Lỗi phát hiện:</h4>
                <div className="bg-destructive/10 p-3 rounded-md max-h-32 overflow-y-auto">
                  {parseResult.errors.map((error: string, index: number) => (
                    <div key={index} className="text-sm text-destructive">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parseResult.validLines > 0 && (
              <div>
                <h4 className="font-medium mb-2">Preview ({Math.min(5, parseResult.items.length)} từ đầu):</h4>
                <div className="space-y-2">
                  {parseResult.items.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="bg-muted p-2 rounded text-sm">
                      <span className="font-mono text-primary">{item.ko}</span> - {item.vi}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleConfirmImport}
                disabled={parseResult.validLines === 0 || isImporting}
                className="flex-1"
              >
                {isImporting ? 'Đang import...' : `Import ${parseResult.validLines} từ`}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Xóa
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Status */}
      {importStatus === 'success' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              <span>Import thành công! Dữ liệu đã được thêm vào thư viện.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {importStatus === 'error' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="h-5 w-5" />
              <span>Import thất bại! Vui lòng thử lại.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Định dạng dữ liệu:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Mỗi dòng là một từ vựng</li>
              <li>Các cột cách nhau bởi Tab hoặc 2+ khoảng trắng</li>
              <li>Định dạng: [STT] [Từ tiếng Hàn] [Nghĩa tiếng Việt]</li>
              <li>STT là tùy chọn, có thể bỏ qua</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Các file được hỗ trợ:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>.txt - File text thông thường</li>
              <li>.csv - File CSV với dấu phẩy phân cách</li>
              <li>.tsv - File TSV với Tab phân cách</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}