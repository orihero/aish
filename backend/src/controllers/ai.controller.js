import axios from 'axios';

// AI Content Generation Controller
export const generateContent = async (req, res) => {
  try {
    const { description, contentType, currency } = req.body;

    if (!description || !contentType) {
      return res.status(400).json({
        success: false,
        message: 'Description and content type are required'
      });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'AI service not configured'
      });
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (contentType) {
      case 'title':
        systemPrompt = 'You are an expert job title generator. Generate a professional, concise job title based on the job description provided. Return only the job title, nothing else.';
        userPrompt = `Based on this job description, generate a professional job title:\n\n${description}`;
        break;
      
      case 'requirements':
        systemPrompt = 'You are an expert HR professional. Generate a list of job requirements based on the job description provided. Return a JSON array of strings, each representing a requirement.';
        userPrompt = `Based on this job description, generate 5-8 specific job requirements:\n\n${description}`;
        break;
      
      case 'responsibilities':
        systemPrompt = 'You are an expert HR professional. Generate a list of job responsibilities based on the job description provided. Return a JSON array of strings, each representing a responsibility.';
        userPrompt = `Based on this job description, generate 5-8 specific job responsibilities:\n\n${description}`;
        break;
      
      case 'salary':
        systemPrompt = `You are an expert salary analyst. Based on the job description, provide a realistic salary range in ${currency || 'USD'}. Return only the range in format "min-max" (e.g., "50000-70000"), nothing else.`;
        userPrompt = `Based on this job description, suggest a realistic salary range in ${currency || 'USD'}:\n\n${description}`;
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid content type'
        });
    }

    const response = await axios.post(
      process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-distill-llama-70b:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.3'),
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:5000',
          'X-Title': 'AI Content Generator'
        }
      }
    );

    let content = response.data.choices[0].message.content.trim();

    // Process response based on content type
    if (contentType === 'requirements' || contentType === 'responsibilities') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          content = parsed;
        } else {
          // If not JSON, split by lines and clean up
          content = content
            .split('\n')
            .map(line => line.replace(/^[-•*]\s*/, '').trim())
            .filter(line => line.length > 0)
            .slice(0, 8);
        }
      } catch (e) {
        // If JSON parsing fails, split by lines
        content = content
          .split('\n')
          .map(line => line.replace(/^[-•*]\s*/, '').trim())
          .filter(line => line.length > 0)
          .slice(0, 8);
      }
    }

    res.json({
      success: true,
      content
    });

  } catch (error) {
    console.error('AI Content Generation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate content',
      error: error.message
    });
  }
};
