import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import { stringify } from 'csv-stringify/sync';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = 3001;

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

app.post('/api/process-text', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    // Verify API key before processing
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a calendar data extraction assistant. Extract events from the provided text and format them with these fields:
          - Date
          - Time
          - Title
          - Location
          
          Return the data in this exact format for each event:
          Date: [date]
          Time: [time]
          Title: [title]
          Location: [location]
          
          Separate each event with a blank line.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Parse the response and structure it for CSV
    const events = parseOpenAIResponse(response.choices[0].message.content);

    // Convert to CSV
    const csv = stringify(events, {
      header: true,
      columns: ['Date', 'Time', 'Title', 'Location']
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=calendar-events.csv');
    res.send(csv);

  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process text',
      details: error.message 
    });
  }
});

function parseOpenAIResponse(content) {
  const events = [];
  let currentEvent = {};
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (Object.keys(currentEvent).length > 0) {
        events.push(currentEvent);
        currentEvent = {};
      }
      continue;
    }

    if (trimmedLine.startsWith('Date:')) {
      if (Object.keys(currentEvent).length > 0) {
        events.push(currentEvent);
        currentEvent = {};
      }
      currentEvent.Date = trimmedLine.substring(5).trim();
    } else if (trimmedLine.startsWith('Time:')) {
      currentEvent.Time = trimmedLine.substring(5).trim();
    } else if (trimmedLine.startsWith('Title:')) {
      currentEvent.Title = trimmedLine.substring(6).trim();
    } else if (trimmedLine.startsWith('Location:')) {
      currentEvent.Location = trimmedLine.substring(9).trim();
    }
  }

  if (Object.keys(currentEvent).length > 0) {
    events.push(currentEvent);
  }

  return events;
}

// Start server only if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set in environment variables');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});