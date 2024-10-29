import OpenAI from 'openai';

// Initialize OpenAI with API key from Netlify environment variables
const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
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

export const handler = async (event, context) => {
  try {
    // Log the raw event body
    console.log('📦 Raw event body:', event.body);

    const { text } = JSON.parse(event.body);

    // Log parsed text input with more detail
    console.log('📥 Received text input:', {
      length: text?.length || 0,
      preview: text?.substring(0, 100) + '...',
      isString: typeof text === 'string'
    });

    if (!text) {
      console.log('❌ No text provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No text provided' }),
      };
    }

    // Verify API key before processing
    if (!process.env.VITE_OPENAI_API_KEY) {
      console.log('❌ Missing OpenAI API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }

    console.log('🤖 Sending request to OpenAI with model:', 'gpt-4o-mini');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
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
          
          Separate each event with a blank line.
          
          Some of the Location fields are abbreviated so please un-abbreviate them based on these examples:
          BUSNBL = Business; METZGR = Metzger; TAEAST = TalbotEast; SUTHLD ETHLEE AUD = Sutherland/Ethel; SOUBRU=Soubaru; feinbr = Feinberg;

          Look out for any other abbreviations and try your best to guess. If the location seems like a proper noun like <GIUMARRA>, feel free to ignore it.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('✨ OpenAI response status:', response.choices ? 'Success' : 'No choices returned');
    console.log('✨ First choice content:', response.choices[0]?.message?.content?.substring(0, 100) + '...');

    // Parse the response and structure it for CSV
    const events = parseOpenAIResponse(response.choices[0].message.content);
    
    console.log('📊 Parsed events count:', events.length);
    console.log('📊 First event:', events[0]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(events),
    };
  } catch (error) {
    console.error('❌ Processing error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process text',
        details: error.message,
      }),
    };
  }
}; 