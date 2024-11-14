import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { evaluate } from 'mathjs';

function Calculator() {
  const [expression, setExpression] = createSignal('');
  const [result, setResult] = createSignal('');
  const [history, setHistory] = createSignal([]);
  const navigate = useNavigate();

  const calculate = () => {
    try {
      const evalResult = evaluate(expression());
      setResult(evalResult);
      setHistory([...history(), `${expression()} = ${evalResult}`]);
      setExpression('');
    } catch (error) {
      alert('خطأ في التعبير الرياضي');
    }
  };

  return (
    <div class="flex flex-col items-center p-4 h-full text-gray-800 pb-16">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الآلة الحاسبة</h2>

      <div class="w-full max-w-md space-y-4">
        <input
          type="text"
          value={expression()}
          onInput={(e) => setExpression(e.target.value)}
          placeholder="أدخل التعبير الرياضي"
          class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        />
        <button
          onClick={calculate}
          class={`w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${!expression() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!expression()}
        >
          احسب
        </button>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <h3 class="text-xl font-semibold mb-2">النتيجة: {result()}</h3>
          <h4 class="text-lg font-semibold mb-2">التاريخ:</h4>
          <ul class="list-disc list-inside">
            {history().map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Calculator;