import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

interface CSVData {
  Time: string;
  Title: string;
  Location: string;
  [key: string]: string; // For any additional fields
}

interface CSVPreviewProps {
  data: CSVData[];
  onUpdate: (newData: CSVData[]) => void;
  onDownload: () => void;
}

export function CSVPreview({ data, onUpdate, onDownload }: CSVPreviewProps) {
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEditing = (rowIndex: number, field: string, value: string) => {
    setEditingCell({ rowIndex, field });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editingCell) return;

    const newData = [...data];
    newData[editingCell.rowIndex] = {
      ...newData[editingCell.rowIndex],
      [editingCell.field]: editValue,
    };

    onUpdate(newData);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Preview Calendar Events</h2>
        <p className="text-sm text-gray-500">Click on any cell to edit</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data[0] || {}).map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.entries(row).map(([field, value]) => (
                  <td
                    key={field}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {editingCell?.rowIndex === rowIndex && editingCell?.field === field ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between group">
                        <span>{value}</span>
                        <button
                          onClick={() => startEditing(rowIndex, field, value)}
                          className="invisible group-hover:visible p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
} 
