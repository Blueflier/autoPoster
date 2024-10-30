import OpenAI from 'openai';

function parseOpenAIResponse(content) {
  const lines = content.trim().split('\n');
  const events = [];

  // Skip the header row if it exists
  const startIndex = lines[0].toLowerCase().includes('time,title,location') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [Time, Title, Location] = line.split(',').map(item => item.trim());
    
    if (Time && Title && Location) {
      events.push({ Time, Title, Location });
    }
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

    console.log('🔑 API Key present?:', !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      console.log('❌ Missing OpenAI API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'OpenAI API key not configured' }),
      };
    }

    console.log('🤖 Initializing OpenAI client...');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log('🤖 Sending request to OpenAI...');
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a calendar data extraction assistant. Extract events from the provided text and format them with these fields for csv output:
            - Time
            - Title
            - Location
            
            Return the data in this exact format for each event:
            time,title,location
                        
            Some of the Location fields are abbreviated so please un-abbreviate them based on these examples:
            BUSNBL = Business; METZGR = Metzger; TAEAST = TalbotEast; SUTHLD ETHLEE AUD = Sutherland/Ethel; SOUBRU=Soubaru; feinbr = Feinberg;`,
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