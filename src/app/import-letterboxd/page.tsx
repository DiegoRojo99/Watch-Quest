'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faSpinner, faCheck, faTimes, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/AuthProvider';

interface ImportResult {
  processed: number;
  imported: number;
  updated: number;
  failed: number;
  errors: string[];
}

export default function LetterboxdImport() {
  const { user } = useAuth();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<'diary' | 'watched'>('diary');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setImportResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !user) return;

    setIsImporting(true);
    setImportResult(null);

    try {
      const csvContent = await selectedFile.text();
      
      const idToken = await user.getIdToken();
      const response = await fetch('/api/import-letterboxd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          csvContent,
          importType
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult(data.results);
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import movies. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Import from Letterboxd</h1>
          <p className="text-gray-400">Please log in to import your Letterboxd data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faFileImport} className="mr-3 text-blue-400" />
        Import from Letterboxd
      </h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">How to export from Letterboxd:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Go to your Letterboxd profile settings</li>
          <li>Navigate to the &quot;Data&quot; or &quot;Export&quot; section</li>
          <li>Export your <strong>diary.csv</strong> (for movies with dates) or <strong>watched.csv</strong> (for all watched movies)</li>
          <li>Download the CSV file and upload it below</li>
        </ol>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Import Type:</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="diary"
                checked={importType === 'diary'}
                onChange={(e) => setImportType(e.target.value as 'diary' | 'watched')}
                className="mr-2"
              />
              <span>Diary (diary.csv) - Movies with watch dates</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="watched"
                checked={importType === 'watched'}
                onChange={(e) => setImportType(e.target.value as 'diary' | 'watched')}
                className="mr-2"
              />
              <span>Ratings List (ratings.csv) - All rated movies</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select CSV File:</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-green-400">
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <button
          onClick={handleImport}
          disabled={!selectedFile || isImporting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          {isImporting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Importing Movies...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Import Movies
            </>
          )}
        </button>

        {importResult && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Import Results:</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{importResult.processed}</div>
                <div className="text-sm text-gray-400">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{importResult.imported}</div>
                <div className="text-sm text-gray-400">Imported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{importResult.updated}</div>
                <div className="text-sm text-gray-400">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{importResult.failed}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-red-400">
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  Errors:
                </h4>
                <div className="max-h-40 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <p key={index} className="text-sm text-gray-300 mb-1">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-green-900 bg-opacity-50 rounded text-green-200 text-sm">
              <FontAwesomeIcon icon={faCheck} className="mr-2" />
              Import completed! Check your <a href="/watched-movies" className="underline hover:text-green-100">watched movies</a> and <a href="/diary" className="underline hover:text-green-100">diary</a> pages.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
