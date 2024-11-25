import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import BackButton from '../components/BackButton';

function JoinTheTeam() {
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = createSignal(false);

  const handleJoinNow = () => {
    if (acceptedTerms()) {
      // Navigate to the next step or show a success message
      alert('شكراً لانضمامك إلى فريقنا!');
    } else {
      alert('يرجى قبول الشروط والأحكام للمتابعة.');
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800 pt-8 pb-16">
      <BackButton />
      <h1 class="text-4xl font-bold text-purple-600 mb-6">انضم إلى الفريق</h1>
      <p class="text-lg text-center leading-relaxed max-w-2xl mb-8">
        نحن نقدم فرصة فريدة للانضمام إلى فريقنا المتميز والمساهمة في تطوير حلول تكنولوجية مبتكرة للأشخاص ذوي الإعاقة البصرية.
      </p>

      <div class="w-full max-w-md">
        <h2 class="text-2xl font-bold text-purple-600 mb-4">المتطلبات:</h2>
        <ul class="list-disc list-inside mb-6">
          <li>الشغف بمساعدة الآخرين وتطوير حلول مبتكرة.</li>
          <li>مهارات تواصل فعّالة.</li>
          <li>القدرة على العمل ضمن فريق متنوع.</li>
        </ul>

        <h2 class="text-2xl font-bold text-purple-600 mb-4">الشروط والأحكام:</h2>
        <p class="mb-6">
          بالانضمام إلى فريقنا، فإنك توافق على الالتزام بقيمنا وسياساتنا الداخلية، والحفاظ على سرية المعلومات والمشاريع التي تعمل عليها.
        </p>

        <div class="flex items-center mb-6">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptedTerms()}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            class="mr-2 cursor-pointer"
          />
          <label for="acceptTerms" class="cursor-pointer">أوافق على الشروط والأحكام</label>
        </div>

        <button
          onClick={handleJoinNow}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600
                transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer`}
        >
          انضم الآن
        </button>
      </div>
    </div>
  );
}

export default JoinTheTeam;