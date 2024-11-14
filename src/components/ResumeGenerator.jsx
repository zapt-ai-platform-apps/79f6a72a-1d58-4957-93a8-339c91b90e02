import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { setState } from '../store';

function ResumeGenerator() {
  const navigate = useNavigate();

  const [name, setName] = createSignal('');
  const [jobTitle, setJobTitle] = createSignal('');
  const [email, setEmail] = createSignal('');
  const [phone, setPhone] = createSignal('');
  const [address, setAddress] = createSignal('');
  const [summary, setSummary] = createSignal('');
  const [skills, setSkills] = createSignal('');
  const [workExperience, setWorkExperience] = createSignal('');
  const [education, setEducation] = createSignal('');
  const [certifications, setCertifications] = createSignal('');
  const [languages, setLanguages] = createSignal('');
  const [hobbies, setHobbies] = createSignal('');

  const handleGenerate = () => {
    setState('name', name());
    setState('jobTitle', jobTitle());
    setState('email', email());
    setState('phone', phone());
    setState('address', address());
    setState('summary', summary());
    setState('skills', skills());
    setState('workExperience', workExperience());
    setState('education', education());
    setState('certifications', certifications());
    setState('languages', languages());
    setState('hobbies', hobbies());
    navigate('/generated-resume');
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">منشئ السيرة الذاتية بالذكاء الاصطناعي</h2>
      <div class="w-full max-w-2xl space-y-4">
        <input type="text" placeholder="الاسم" value={name()} onInput={(e) => setName(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" />
        <input type="text" placeholder="المسمى الوظيفي" value={jobTitle()} onInput={(e) => setJobTitle(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" />
        <input type="email" placeholder="البريد الإلكتروني" value={email()} onInput={(e) => setEmail(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" />
        <input type="text" placeholder="رقم الهاتف" value={phone()} onInput={(e) => setPhone(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" />
        <input type="text" placeholder="العنوان" value={address()} onInput={(e) => setAddress(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" />
        <textarea placeholder="الملخص" value={summary()} onInput={(e) => setSummary(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="3" />
        <textarea placeholder="المهارات" value={skills()} onInput={(e) => setSkills(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="3" />
        <textarea placeholder="الخبرة العملية" value={workExperience()} onInput={(e) => setWorkExperience(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="3" />
        <textarea placeholder="التعليم" value={education()} onInput={(e) => setEducation(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="3" />
        <textarea placeholder="الشهادات" value={certifications()} onInput={(e) => setCertifications(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="2" />
        <textarea placeholder="اللغات" value={languages()} onInput={(e) => setLanguages(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="2" />
        <textarea placeholder="الهوايات" value={hobbies()} onInput={(e) => setHobbies(e.target.value)} class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border" rows="2" />
        <button
          onClick={handleGenerate}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!name() || !jobTitle() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!name() || !jobTitle()}
        >
          إنشاء السيرة الذاتية
        </button>
      </div>
    </div>
  );
}

export default ResumeGenerator;