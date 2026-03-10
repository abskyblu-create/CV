import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { PortfolioData } from '../context/PortfolioContext';

export const generateResumePDF = (data: PortfolioData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { personalInfo, experiences, education, skills, languages } = data;

  // Helper for text wrapping and positioning
  let y = 15;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 2 * margin;

  // 1. Header: Name & Contact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(personalInfo.name.toUpperCase(), margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const contactInfo = `${personalInfo.location} | ${personalInfo.email} | ${personalInfo.linkedin}`;
  doc.text(contactInfo, margin, y);
  y += 8;

  // 2. Professional Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PROFESSIONAL SUMMARY', margin, y);
  y += 1.5;
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 4;

  // 3. Experience
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PROFESSIONAL EXPERIENCE', margin, y);
  y += 1.5;
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  experiences.forEach((exp) => {
    if (y > 270) {
      doc.addPage();
      y = 15;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(exp.role.toUpperCase(), margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 4;

    doc.setFont('helvetica', 'bolditalic');
    doc.setFontSize(9);
    doc.text(exp.company, margin, y);
    doc.setFont('helvetica', 'italic');
    doc.text(exp.location, pageWidth - margin, y, { align: 'right' });
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    exp.highlights.forEach((highlight: string) => {
      const bullet = '• ';
      const text = bullet + highlight;
      const lines = doc.splitTextToSize(text, contentWidth - 4);
      
      if (y + lines.length * 4 > 285) {
        doc.addPage();
        y = 15;
      }
      
      doc.text(lines, margin + 2, y);
      y += lines.length * 4;
    });
    y += 3;
  });

  // 4. Education
  if (y > 260) {
    doc.addPage();
    y = 15;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('EDUCATION', margin, y);
  y += 1.5;
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  education.forEach((edu) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(edu.degree, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(edu.period, pageWidth - margin, y, { align: 'right' });
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`${edu.school}, ${edu.location}`, margin, y);
    y += 6;
  });

  // 5. Skills
  if (y > 260) {
    doc.addPage();
    y = 15;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TECHNICAL SKILLS', margin, y);
  y += 1.5;
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  Object.values(skills).forEach((skillGroup: any) => {
    const skillText = `${skillGroup.title}: ${skillGroup.items.join(', ')}`;
    const skillLines = doc.splitTextToSize(skillText, contentWidth);
    
    if (y + skillLines.length * 4 > 285) {
      doc.addPage();
      y = 15;
    }
    
    doc.text(skillLines, margin, y);
    y += skillLines.length * 4 + 1.5;
  });
  y += 3;

  // 6. Languages
  if (y > 275) {
    doc.addPage();
    y = 15;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('LANGUAGES', margin, y);
  y += 1.5;
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const langText = languages.map((l: any) => `${l.name} (${l.level})`).join(' | ');
  doc.text(langText, margin, y);

  // Save the PDF
  doc.save(`${personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
};
