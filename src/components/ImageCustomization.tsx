import React from 'react';

interface Settings {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  width: number;
  height: number;
}

interface ImageCustomizationProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function ImageCustomization({ settings, onSettingsChange }: ImageCustomizationProps) {
  const handleChange = (key: keyof Settings, value: string | number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="w-full max-w-2xl space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900">Image Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Font Size</label>
          <input
            type="number"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Text Color</label>
          <input
            type="color"
            value={settings.textColor}
            onChange={(e) => handleChange('textColor', e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Background Color</label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="mt-1 block w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input
            type="number"
            value={settings.width}
            onChange={(e) => handleChange('width', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <input
            type="number"
            value={settings.height}
            onChange={(e) => handleChange('height', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}