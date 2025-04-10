import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

export async function analyzeResume(pdfText) {
  try {
    // Load and parse PDF
    const pdfDoc = await PDFDocument.load(pdfText);
    const pages = pdfDoc.getPages();
    
    // Extract text from all pages
    let extractedText = '';
    for (const page of pages) {
      const text = await page.getTextContent();
      extractedText += text.items.map(item => item.str).join(' ');
    }
    
    // Analyze extracted text using AI
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: 'deepseek-ai/deepseek-coder-33b-instruct',
      messages: [
        {
          role: 'user',
          content: `
            You are a professional resume parser. Analyze the following resume text and extract information into a structured JSON format.
            The output should follow this exact structure, including all fields (leave them empty if not found):
            
            ${JSON.stringify({
              basics: {
                name: '',
                label: '',
                image: '',
                email: '',
                phone: '',
                url: '',
                summary: '',
                location: {
                  address: '',
                  postalCode: '',
                  city: '',
                  region: '',
                  countryCode: ''
                },
                profiles: []
              },
              work: [],
              volunteer: [],
              education: [],
              certifications: [],
              awards: [],
              publications: [],
              skills: [],
              languages: [],
              interests: [],
              projects: [],
              references: []
            }, null, 2)}

            Here is the resume text to analyze:
            ${extractedText}
          `
        }
      ],
      temperature: 0.1
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL,
        'X-Title': 'Resume Analyzer'
      }
    });

    const parsedResponse = JSON.parse(response.data.choices[0].message.content);
    return parsedResponse;
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error('Failed to analyze resume');
  }
}