import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load and compile resume template
const templatePath = join(process.cwd(), 'src/templates/resume.hbs');
const templateContent = readFileSync(templatePath, 'utf8');
const template = Handlebars.compile(templateContent);

export async function generateResumePDF(parsedData) {
  try {
    // Generate HTML from template
    const html = template(parsedData);

    // Launch browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox']
    });

    // Create new page
    const page = await browser.newPage();
    
    // Set content and wait for network idle
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    // Close browser
    await browser.close();

    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}