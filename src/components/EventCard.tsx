import React from 'react';
import { Download } from 'lucide-react';

interface EventCardProps {
  event: {
    Time: string;
    Title: string;
    Location: string;
  };
  onGenerate: () => void;
}

export function EventCard({ event, onGenerate }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
      <h3 className="font-semibold text-lg text-gray-900">
        {event.Title || 'Untitled Event'}
      </h3>
      <p className="text-gray-600">
        {event.Time || 'Time TBD'}
      </p>
      <p className="text-gray-600">{event.Location || 'Location TBD'}</p>
      <button
        onClick={onGenerate}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download className="h-4 w-4 mr-2" />
        Generate Image
      </button>
    </div>
  );
}