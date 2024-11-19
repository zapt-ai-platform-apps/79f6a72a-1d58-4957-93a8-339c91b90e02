import { useNavigate } from '@solidjs/router';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      class="self-start mb-4 flex items-center text-2xl cursor-pointer"
    >
      <span class="mr-2">🔙</span>
      <span>العودة</span>
    </button>
  );
}

export default BackButton;