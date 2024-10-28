import React from 'react';
import { fabric } from 'fabric';
import { Download } from 'lucide-react';

interface ImageGeneratorProps {
  csvData: Array<{
    Date: string;
    Time: string;
    Title: string;
    Location: string;
  }>;
}

// Curated gradient combinations for beautiful results
const gradientCombinations = [
  ['#4f46e5', '#818cf8'], // Indigo
  ['#2563eb', '#60a5fa'], // Blue
  ['#7c3aed', '#a78bfa'], // Purple
  ['#db2777', '#f472b6'], // Pink
  ['#ea580c', '#fb923c'], // Orange
  ['#059669', '#34d399'], // Emerald
  ['#0d9488', '#2dd4bf'], // Teal
  ['#4338ca', '#818cf8'], // Deep Blue
  ['#6d28d9', '#a78bfa'], // Violet
  ['#be185d', '#f472b6'], // Deep Pink
];

export function ImageGenerator({ csvData }: ImageGeneratorProps) {
  const getRandomGradient = () => {
    const index = Math.floor(Math.random() * gradientCombinations.length);
    return gradientCombinations[index];
  };

  const formatFileName = (date: string, title: string) => {
    try {
      let formattedDate = '';
      if (date) {
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          formattedDate = `${month}-${day}`;
        } else {
          const now = new Date();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          formattedDate = `${month}-${day}`;
        }
      }

      const cleanTitle = title
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50)
        : 'untitled';

      return `${formattedDate}-${cleanTitle}.png`;
    } catch (error) {
      console.error('Error formatting filename:', error);
      return `event-${Date.now()}.png`;
    }
  };

  const generateImage = async (event: {
    Date: string;
    Time: string;
    Title: string;
    Location: string;
  }) => {
    try {
      const canvas = new fabric.Canvas(null, {
        width: 1080,
        height: 1920,
        backgroundColor: '#ffffff',
      });

      // Get random gradient colors
      const [colorStart, colorEnd] = getRandomGradient();

      const gradient = new fabric.Gradient({
        type: 'linear',
        coords: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: canvas.height!,
        },
        colorStops: [
          { offset: 0, color: colorStart },
          { offset: 1, color: colorEnd },
        ],
      });

      const background = new fabric.Rect({
        width: canvas.width,
        height: canvas.height,
        fill: gradient,
      });
      canvas.add(background);

      // Add event details with beautiful typography
      const title = new fabric.Text(event.Title || 'Untitled Event', {
        left: 50,
        top: canvas.height! / 2 - 200,
        fontFamily: 'Arial',
        fontSize: 72,
        fill: '#ffffff',
        width: canvas.width! - 100,
        fontWeight: 'bold',
      });

      const dateTime = new fabric.Text(
        `${event.Date || 'Date TBD'} at ${event.Time || 'Time TBD'}`,
        {
          left: 50,
          top: canvas.height! / 2,
          fontFamily: 'Arial',
          fontSize: 48,
          fill: '#ffffff',
          width: canvas.width! - 100,
        }
      );

      const location = new fabric.Text(event.Location || 'Location TBD', {
        left: 50,
        top: canvas.height! / 2 + 100,
        fontFamily: 'Arial',
        fontSize: 48,
        fill: '#ffffff',
        width: canvas.width! - 100,
      });

      canvas.add(title, dateTime, location);

      // Add decorative elements with matching gradient color
      const circle = new fabric.Circle({
        radius: 200,
        fill: '#ffffff',
        opacity: 0.1,
        left: canvas.width! - 300,
        top: 100,
      });

      canvas.add(circle);

      // Convert to image and download
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = formatFileName(event.Date, event.Title);
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Generate Instagram Stories</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {csvData.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg text-gray-900">
              {event.Title || 'Untitled Event'}
            </h3>
            <p className="text-gray-600">
              {event.Date || 'Date TBD'} at {event.Time || 'Time TBD'}
            </p>
            <p className="text-gray-600">{event.Location || 'Location TBD'}</p>
            <button
              onClick={() => generateImage(event)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Image
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}