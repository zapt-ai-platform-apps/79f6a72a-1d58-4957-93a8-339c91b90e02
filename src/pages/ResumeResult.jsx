import { useNavigate, useLocation } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';

function ResumeResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumeContent] = createSignal(location.state?.resumeContent || '');

  if (!location.state?.resumeContent) {
    navigate('/resume-builder');
  }

  const handleDownload = async () => {
    if (!resumeContent()) return;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({
            children: [new TextRun(resumeContent())],
          })],
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
        <div class="prose prose-lg text-gray-700 whitespace-pre-wrap">
          {resumeContent()}
        </div>
        <button
          onClick={handleDownload}
          class="mt-4 w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          تحميل
        </button>
      </div>
    </div>
  );
}

export default ResumeResult;