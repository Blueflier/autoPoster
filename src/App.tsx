import React, { useState, useCallback } from 'react';
import { Calendar, FileDown, Loader2, Upload } from 'lucide-react';
import axios from 'axios';
import { ImageGenerator } from './components/ImageGenerator';
import { CSVPreview } from './components/CSVPreview';

interface CSVData {
  Date: string;
  Time: string;
  Title: string;
  Location: string;
  [key: string]: string;
}

export function App() {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<CSVData[] | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageGenerator, setShowImageGenerator] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post('/api/process-text', 
        { text },
        { responseType: 'blob' }
      );

      // Parse the CSV data for preview
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result as string;
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {} as any);
        }).filter(row => row.Date);
        setParsedData(data);
        setShowPreview(true);
        setShowImageGenerator(false);
      };
      reader.readAsText(new Blob([response.data]));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCsvUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        const data = rows.slice(1).map(row => {
          const values = row.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.trim()] = values[index]?.trim();
            return obj;
          }, {} as any);
        }).filter(row => row.Date);
        setParsedData(data);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDataUpdate = (newData: Array<any>) => {
    setParsedData(newData);
  };

  const handleDownload = () => {
    if (!parsedData) return;

    // Convert the parsed data to CSV format
    const csvData = parsedData.map(row => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendar-events.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Calendar className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-3 text-4xl font-extrabold text-gray-900">
            Calendar Text to Instagram Stories
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Convert calendar events to Instagram-ready story images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* CSV Upload Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Existing CSV</h2>
            <p className="text-gray-600 mb-6">
              Already have a CSV file? Upload it directly to generate Instagram stories.
            </p>
            <label className="block w-full group cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors duration-300">
                <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  Choose a CSV file or drag and drop
                </span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </div>
            </label>
          </div>

          {/* Text Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Paste Calendar Text</h2>
            <p className="text-gray-600 mb-6">
              Paste your calendar text here to convert it into Instagram stories.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                id="calendar-text"
                name="calendar-text"
                rows={6}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                placeholder="Paste your calendar text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={!text.trim() || isProcessing}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileDown className="-ml-1 mr-3 h-5 w-5" />
                    Convert to CSV
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {showPreview && (
          <>
            <CSVPreview 
              data={parsedData || []} 
              onUpdate={handleDataUpdate} 
              onDownload={handleDownload} 
            />
            
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowImageGenerator(true)}
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
              >
                Generate Instagram Stories
              </button>
            </div>

            {showImageGenerator && (
              <div className="mt-8">
                <ImageGenerator 
                  csvData={parsedData || []} 
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}