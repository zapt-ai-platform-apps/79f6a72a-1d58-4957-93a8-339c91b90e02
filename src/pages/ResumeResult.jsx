import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

function ResumeResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumeContent] = createSignal(location.state?.resumeContent || '');
  const resumeData = location.state?.resumeData;

  if (!resumeContent() || !resumeData) {
    navigate('/resume-builder');
  }

  const handleDownload = async () => {
    if (!resumeData) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.name,
                  bold: true,
                  size: 32,
                }),
              ],
            }),
            new Paragraph({
              text: `البريد الإلكتروني: ${resumeData.email} | الهاتف: ${resumeData.phone} | العنوان: ${resumeData.address}`,
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: 'الملخص الشخصي',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: resumeData.summary,
              spacing: { after: 200 },
            }),

            // Education
            new Paragraph({
              text: 'التعليم',
              heading: HeadingLevel.HEADING_1,
            }),
            ...resumeData.education.map((edu) => [
              new Paragraph({
                text: `${edu.degree} - ${edu.institution} (${edu.year})`,
                bullet: { level: 0 },
              }),
            ]).flat(),

            // Experience
            new Paragraph({
              text: 'الخبرات العملية',
              heading: HeadingLevel.HEADING_1,
            }),
            ...resumeData.experience.map((exp) => [
              new Paragraph({
                text: `${exp.title} - ${exp.company} (${exp.years})`,
                bullet: { level: 0 },
              }),
              new Paragraph({
                text: `المسؤوليات والإنجازات:`,
                indent: { left: 720 },
              }),
              new Paragraph({
                text: exp.responsibilities,
                indent: { left: 1440 },
              }),
            ]).flat(),

            // Skills
            new Paragraph({
              text: 'المهارات',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: resumeData.skills.join(', '),
              spacing: { after: 200 },
            }),

            // Languages
            new Paragraph({
              text: 'اللغات',
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: resumeData.languages.join(', '),
              spacing: { after: 200 },
            }),

            // Certifications
            new Paragraph({
              text: 'الشهادات',
              heading: HeadingLevel.HEADING_1,
            }),
            ...resumeData.certifications.map((cert) => [
              new Paragraph({
                text: cert,
                bullet: { level: 0 },
              }),
            ]).flat(),

            // References
            new Paragraph({
              text: 'المراجع',
              heading: HeadingLevel.HEADING_1,
            }),
            ...resumeData.references.map((ref) => [
              new Paragraph({
                text: `${ref.name} - ${ref.position}`,
                bullet: { level: 0 },
              }),
              new Paragraph({
                text: `معلومات الاتصال: ${ref.contact}`,
                indent: { left: 720 },
              }),
            ]).flat(),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'السيرة_الذاتية.docx');
  };

  return (
    <div class="w-full flex flex-col items-center p-4 h-full text-gray-800 pt-8 pb-16">
      <button
        onClick={() => navigate('/resume-builder')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h1 class="text-4xl font-bold text-purple-600 mb-6">السيرة الذاتية</h1>
      <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
        <p class="prose prose-lg text-gray-700 whitespace-pre-wrap mb-4">{resumeContent()}</p>
        <button
          onClick={handleDownload}
          class="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          تحميل كملف Word
        </button>
      </div>
    </div>
  );
}

export default ResumeResult;