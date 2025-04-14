import fontkit from '@pdf-lib/fontkit';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Load and compile resume template
const templatePath = join(process.cwd(), 'src/templates/resume.hbs');
const templateContent = readFileSync(templatePath, 'utf8');

export async function generateResumePDF(parsedData) {
  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Embed standard font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add page
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();

    // Set initial position
    let y = height - 50;
    const margin = 50;

    // Draw header
    page.drawText(parsedData.basics.name || '', {
      x: margin,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0)
    });

    y -= 30;
    
    // Draw contact info
    if (parsedData.basics.email) {
      page.drawText(`Email: ${parsedData.basics.email}`, {
        x: margin,
        y,
        size: 12,
        font
      });
      y -= 20;
    }

    if (parsedData.basics.phone) {
      page.drawText(`Phone: ${parsedData.basics.phone}`, {
        x: margin,
        y,
        size: 12,
        font
      });
      y -= 20;
    }

    // Draw sections
    const drawSection = (title, content) => {
      if (!content) return;
      
      y -= 30;
      page.drawText(title, {
        x: margin,
        y,
        size: 16,
        font: boldFont
      });
      
      y -= 20;
      page.drawText(content, {
        x: margin,
        y,
        size: 12,
        font,
        maxWidth: width - (margin * 2)
      });
    };

    // Draw summary
    if (parsedData.basics.summary) {
      drawSection('Summary', parsedData.basics.summary);
    }

    // Draw experience
    if (parsedData.work?.length) {
      y -= 30;
      page.drawText('Experience', {
        x: margin,
        y,
        size: 16,
        font: boldFont
      });

      parsedData.work.forEach(job => {
        y -= 25;
        page.drawText(`${job.position} at ${job.name}`, {
          x: margin,
          y,
          size: 14,
          font: boldFont
        });

        y -= 20;
        page.drawText(`${job.startDate} - ${job.endDate || 'Present'}`, {
          x: margin,
          y,
          size: 12,
          font
        });

        if (job.summary) {
          y -= 20;
          page.drawText(job.summary, {
            x: margin,
            y,
            size: 12,
            font,
            maxWidth: width - (margin * 2)
          });
        }
      });
    }

    // Serialize PDF
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}