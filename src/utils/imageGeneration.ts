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

const backgroundStyles = [
  'gradient',
  'scattered-squares',
  'floating-circles',
  'diagonal-lines',
  'geometric-pattern',
  'dots-grid'
] as const;

const addGradientBackground = (canvas: fabric.Canvas, colorStart: string, colorEnd: string) => {
  const gradient = new fabric.Gradient({
    type: 'linear',
    coords: { x1: 0, y1: 0, x2: 0, y2: canvas.height! },
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
};

const addScatteredSquares = (canvas: fabric.Canvas, baseColor: string) => {
  for (let i = 0; i < 15; i++) {
    const size = Math.random() * 200 + 50;
    const square = new fabric.Rect({
      left: Math.random() * canvas.width!,
      top: Math.random() * canvas.height!,
      width: size,
      height: size,
      angle: Math.random() * 45,
      fill: baseColor,
      opacity: 0.1,
    });
    canvas.add(square);
  }
};

const addFloatingCircles = (canvas: fabric.Canvas, baseColor: string) => {
  for (let i = 0; i < 20; i++) {
    const radius = Math.random() * 150 + 30;
    const circle = new fabric.Circle({
      left: Math.random() * canvas.width!,
      top: Math.random() * canvas.height!,
      radius: radius,
      fill: baseColor,
      opacity: 0.1,
    });
    canvas.add(circle);
  }
};

const addDiagonalLines = (canvas: fabric.Canvas, baseColor: string) => {
  for (let i = 0; i < 10; i++) {
    const line = new fabric.Line([
      Math.random() * canvas.width!,
      Math.random() * canvas.height!,
      Math.random() * canvas.width!,
      Math.random() * canvas.height!
    ], {
      stroke: baseColor,
      strokeWidth: 5,
      opacity: 0.1,
    });
    canvas.add(line);
  }
};

const addGeometricPattern = (canvas: fabric.Canvas, baseColor: string) => {
  const patternSize = 200;
  for (let x = 0; x < canvas.width!; x += patternSize) {
    for (let y = 0; y < canvas.height!; y += patternSize) {
      const shape = Math.random() > 0.5 ? 
        new fabric.Triangle({
          left: x,
          top: y,
          width: patternSize,
          height: patternSize,
        }) :
        new fabric.Rect({
          left: x,
          top: y,
          width: patternSize,
          height: patternSize,
        });
      
      shape.set({
        fill: baseColor,
        opacity: 0.1,
        angle: Math.random() * 90,
      });
      canvas.add(shape);
    }
  }
};

const addDotsGrid = (canvas: fabric.Canvas, baseColor: string) => {
  const spacing = 100;
  for (let x = 0; x < canvas.width!; x += spacing) {
    for (let y = 0; y < canvas.height!; y += spacing) {
      const circle = new fabric.Circle({
        left: x,
        top: y,
        radius: 5,
        fill: baseColor,
        opacity: 0.2,
      });
      canvas.add(circle);
    }
  }
};

export const generateSingleImage = async (event: {
  Date: string;
  Time: string;
  Title: string;
  Location: string;
}): Promise<{ dataUrl: string; fileName: string }> => {
  const canvas = new fabric.Canvas(null, {
    width: 1080,
    height: 1920,
    backgroundColor: '#ffffff',
  });

  const [colorStart, colorEnd] = getRandomGradient();
  
  // Randomly select a background style
  const backgroundStyle = backgroundStyles[Math.floor(Math.random() * backgroundStyles.length)];
  
  // Apply the selected background style
  addGradientBackground(canvas, colorStart, colorEnd);
  
  switch (backgroundStyle) {
    case 'scattered-squares':
      addScatteredSquares(canvas, '#ffffff');
      break;
    case 'floating-circles':
      addFloatingCircles(canvas, '#ffffff');
      break;
    case 'diagonal-lines':
      addDiagonalLines(canvas, '#ffffff');
      break;
    case 'geometric-pattern':
      addGeometricPattern(canvas, '#ffffff');
      break;
    case 'dots-grid':
      addDotsGrid(canvas, '#ffffff');
      break;
  }

  // Add text elements (keeping the same positioning)
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

  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });

  return {
    dataUrl,
    fileName: formatFileName(event.Date, event.Title),
  };
};