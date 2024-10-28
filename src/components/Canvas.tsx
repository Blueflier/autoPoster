import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasProps {
  content: string;
  settings: {
    fontSize: number;
    fontFamily: string;
    textColor: string;
    backgroundColor: string;
    width: number;
    height: number;
  };
}

export function Canvas({ content, settings }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: settings.width,
      height: settings.height,
      backgroundColor: settings.backgroundColor,
    });

    const text = new fabric.Textbox(content, {
      left: 50,
      top: 50,
      width: settings.width - 100,
      fontSize: settings.fontSize,
      fontFamily: settings.fontFamily,
      fill: settings.textColor,
      textAlign: 'left',
    });

    fabricCanvasRef.current.add(text);
    return () => fabricCanvasRef.current?.dispose();
  }, [content, settings]);

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <canvas ref={canvasRef} />
      <button
        onClick={() => {
          const dataURL = fabricCanvasRef.current?.toDataURL();
          if (dataURL) {
            const link = document.createElement('a');
            link.download = 'generated-image.png';
            link.href = dataURL;
            link.click();
          }
        }}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
      >
        Download Image
      </button>
    </div>
  );
}