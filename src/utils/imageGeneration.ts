import { fabric } from 'fabric';


export const formatFileName = (title: string) => {
  try {
    const cleanTitle = title
      ? title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 50)
      : 'untitled';

    return `${cleanTitle}.png`;
  } catch (error) {
    console.error('Error formatting filename:', error);
    return `event-${Date.now()}.png`;
  }
};

export const generateSingleImage = async (event: {
  Time: string;
  Title: string;
  Location: string;
}): Promise<{ dataUrl: string; fileName: string }> => {
  const canvas = new fabric.Canvas(null, {
    width: 1080,
    height: 1920,
    backgroundColor: '#ddd2c2',
  });

  // Add the top horizontal line
  const topLine = new fabric.Line([100, 380, 980, 380], {
    stroke: '#af3a3a',
    strokeWidth: 6
  });
  canvas.add(topLine);

  // Add the bottom horizontal line
  const bottomLine = new fabric.Line([100, 1150, 980, 1150], {
    stroke: '#af3a3a',
    strokeWidth: 6
  });
  canvas.add(bottomLine);

  // Add the title/club name
  const title = new fabric.Text(event.Title || 'Untitled Event', {
    top: 1400,
    fontFamily: 'Alice',
    fontSize: 80,
    fill: '#af3a3a',
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center',
    left: canvas.getWidth() / 2 // center horizontally
  });
  canvas.add(title);

  // Add the time
  const timeText = new fabric.Text(event.Time || 'Time TBD', {
    top: 1500,
    fontFamily: 'Alice',
    fontSize: 90,
    fill: '#af3a3a',
    fontWeight: 'bold',
    originX: 'center',
    originY: 'center',
    left: canvas.getWidth() / 2 
  });
  canvas.add(timeText);

  // Add "Biola Today" text
  const biolaToday = new fabric.Text('Biola\nToday', {
    left: 850,
    top: 1700,
    fontFamily: 'Alice',
    fontSize: 70,
    fill: '#af3a3a',
    fontStyle: 'italic',
    fontWeight: 'bold'
  });
  canvas.add(biolaToday);

  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });

  // Simplified fileName without date
  const fileName = `${event.Title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.png`;

  return {
    dataUrl,
    fileName,
  };
};