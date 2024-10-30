import { fabric } from 'fabric';

export const gradientCombinations = [
  ['#4f46e5', '#818cf8'],
  ['#2563eb', '#60a5fa'],
  ['#7c3aed', '#a78bfa'],
  ['#db2777', '#f472b6'],
  ['#ea580c', '#fb923c'],
  ['#059669', '#34d399'],
  ['#0d9488', '#2dd4bf'],
  ['#4338ca', '#818cf8'],
  ['#6d28d9', '#a78bfa'],
  ['#be185d', '#f472b6'],
];

export const getRandomGradient = () => {
  const index = Math.floor(Math.random() * gradientCombinations.length);
  return gradientCombinations[index];
};

export const formatFileName = (date: string, title: string) => {
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

export const generateSingleImage = async (event: {
  Time: string;
  Title: string;
  Location: string;
}): Promise<{ dataUrl: string; fileName: string }> => {
  const canvas = new fabric.Canvas(null, {
    width: 600,
    height: 800,
    backgroundColor: '#e5dfd1',
  });

  // Add the top horizontal line
  const topLine = new fabric.Line([50, 140, 550, 140], {
    stroke: '#9b3f3f',
    strokeWidth: 2
  });
  canvas.add(topLine);

  // Add the bottom horizontal line
  const bottomLine = new fabric.Line([50, 500, 550, 500], {
    stroke: '#9b3f3f',
    strokeWidth: 2
  });
  canvas.add(bottomLine);

  // Add the title/club name
  const title = new fabric.Text(event.Title || 'Untitled Event', {
    left: 200,
    top: 520,
    fontFamily: 'Times New Roman',
    fontSize: 36,
    fill: '#9b3f3f',
    fontWeight: 'bold'
  });
  canvas.add(title);

  // Add the time
  const timeText = new fabric.Text(event.Time || 'Time TBD', {
    left: 185,
    top: 560,
    fontFamily: 'Times New Roman',
    fontSize: 28,
    fill: '#9b3f3f',
    fontWeight: 'bold'
  });
  canvas.add(timeText);

  // Add "Biola Today" text
  const biolaToday = new fabric.Text('Biola\nToday', {
    left: 450,
    top: 700,
    fontFamily: 'Times New Roman',
    fontSize: 20,
    fill: '#9b3f3f',
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