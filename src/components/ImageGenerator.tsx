import React from 'react';
import { Package } from 'lucide-react';
import JSZip from 'jszip';
import { EventCard } from './EventCard';
import { generateSingleImage } from '../utils/imageGeneration';

interface ImageGeneratorProps {
  csvData: Array<{
    Date: string;
    Time: string;
    Title: string;
    Location: string;
  }>;
}

export function ImageGenerator({ csvData }: ImageGeneratorProps) {
  const [isGeneratingZip, setIsGeneratingZip] = React.useState(false);

  const generateImage = async (event: {
    Date: string;
    Time: string;
    Title: string;
    Location: string;
  }) => {
    try {
      const { dataUrl, fileName } = await generateSingleImage(event);
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const downloadAllImages = async () => {
    try {
      setIsGeneratingZip(true);
      const zip = new JSZip();

      // Generate all images in parallel
      const imagePromises = csvData.map(generateSingleImage);
      const images = await Promise.all(imagePromises);

      // Add each image to the zip file
      images.forEach(({ dataUrl, fileName }) => {
        const imageData = dataUrl.split('base64,')[1];
        zip.file(fileName, imageData, { base64: true });
      });

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'instagram-stories.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error generating zip file:', error);
      alert('Failed to generate zip file. Please try again.');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Generate Instagram Stories</h2>
        <button
          onClick={downloadAllImages}
          disabled={isGeneratingZip || csvData.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="h-4 w-4 mr-2" />
          {isGeneratingZip ? 'Generating...' : 'Download All'}
        </button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {csvData.map((event, index) => (
          <EventCard
            key={index}
            event={event}
            onGenerate={() => generateImage(event)}
          />
        ))}
      </div>
    </div>
  );
}