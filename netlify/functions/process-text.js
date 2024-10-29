import OpenAI from 'openai';

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
    const { text } = JSON.parse(event.body);
    console.log('📥 Received text input:', text.substring(0, 100) + '...');

    if (!text) {
      console.log('❌ No text provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No text provided' }),
      };
    }

    // Log API key presence (not the actual key!)
    console.log('🔑 API Key present?:', !!process.env.VITE_OPENAI_API_KEY);

    if (!process.env.VITE_OPENAI_API_KEY) {
      console.log('❌ Missing OpenAI API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }

    console.log('🤖 Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY,
    });

    console.log('🤖 Sending request to OpenAI...');
    try {
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

      console.log('✨ OpenAI response received:', {
        status: 'success',
        choicesLength: response.choices?.length,
        firstChoice: response.choices[0]?.message?.content?.substring(0, 100) + '...'
      });

      const events = parseOpenAIResponse(response.choices[0].message.content);
      console.log('📊 Parsed events:', JSON.stringify(events, null, 2));

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(events),
      };

    } catch (openaiError) {
      console.error('❌ OpenAI API Error:', {
        name: openaiError.name,
        message: openaiError.message,
        status: openaiError.status,
        response: openaiError.response?.data,
        stack: openaiError.stack
      });

      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'OpenAI API Error',
          details: openaiError.message,
          status: openaiError.status
        }),
      };
    }

  } catch (error) {
    console.error('❌ General Processing Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process text',
        details: error.message
      }),
    };
  }
}; 