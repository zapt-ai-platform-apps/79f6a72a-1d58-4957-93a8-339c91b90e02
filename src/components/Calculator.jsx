import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { evaluate } from 'mathjs';

function Calculator() {
  const navigate = useNavigate();
  const [expression, setExpression] = createSignal('');
  const [result, setResult] = createSignal('');
  const [history, setHistory] = createSignal([]);

  const handleButtonClick = (value) => {
    setExpression(expression() + value);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression(expression().slice(0, -1));
  };

  const handleCalculate = () => {
    try {
      const evalResult = evaluate(expression());
      setResult(evalResult.toString());
      setHistory([...history(), { expression: expression(), result: evalResult.toString() }]);
      setExpression('');
    } catch (error) {
      alert('خطأ في التعبير');
    }
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if ((/\d/).test(key) || '+-*/().^%'.includes(key)) {
      setExpression(expression() + key);
    } else if (key === 'Enter') {
      handleCalculate();
    } else if (key === 'Backspace') {
      handleDelete();
    } else if (key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div class="min-h-screen flex flex-col items-center p-4 text-gray-800" onKeyDown={handleKeyDown} tabindex="0">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
        aria-label="عودة"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الآلة الحاسبة</h2>
      <div class="w-full max-w-xs">
        <div class="mb-4">
          <input
            type="text"
            readOnly
            value={expression()}
            aria-label="شاشة الإدخال"
            class="w-full p-3 text-right border border-gray-300 rounded-lg focus:outline-none box-border"
          />
          <input
            type="text"
            readOnly
            value={result()}
            aria-label="شاشة النتيجة"
            class="w-full p-3 mt-2 text-right border border-gray-300 rounded-lg focus:outline-none box-border"
          />
        </div>
        {/* Buttons */}
        <div class="grid grid-cols-4 gap-2">
          <button
            onClick={handleClear}
            class="col-span-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            aria-label="مسح"
          >
            مسح
          </button>
          <button
            onClick={handleDelete}
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 cursor-pointer"
            aria-label="حذف"
          >
            حذف
          </button>
          <button
            onClick={() => handleButtonClick('/')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="قسمة"
          >
            ÷
          </button>
          <button
            onClick={() => handleButtonClick('sqrt(')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="الجذر التربيعي"
          >
            √
          </button>
          <button
            onClick={() => handleButtonClick('7')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="7"
          >
            7
          </button>
          <button
            onClick={() => handleButtonClick('8')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="8"
          >
            8
          </button>
          <button
            onClick={() => handleButtonClick('9')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="9"
          >
            9
          </button>
          <button
            onClick={() => handleButtonClick('*')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="ضرب"
          >
            ×
          </button>
          <button
            onClick={() => handleButtonClick('sin(')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="جيب"
          >
            sin
          </button>
          <button
            onClick={() => handleButtonClick('cos(')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="جيب التمام"
          >
            cos
          </button>
          <button
            onClick={() => handleButtonClick('tan(')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="ظل"
          >
            tan
          </button>
          <button
            onClick={() => handleButtonClick('-')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="طرح"
          >
            -
          </button>
          <button
            onClick={() => handleButtonClick('4')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="4"
          >
            4
          </button>
          <button
            onClick={() => handleButtonClick('5')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="5"
          >
            5
          </button>
          <button
            onClick={() => handleButtonClick('6')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="6"
          >
            6
          </button>
          <button
            onClick={() => handleButtonClick('+')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="جمع"
          >
            +
          </button>
          <button
            onClick={() => handleButtonClick('log(')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="لوغاريتم"
          >
            log
          </button>
          <button
            onClick={() => handleButtonClick('(')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="فتح قوس"
          >
            (
          </button>
          <button
            onClick={() => handleButtonClick(')')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="إغلاق قوس"
          >
            )
          </button>
          <button
            onClick={handleCalculate}
            class="row-span-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
            aria-label="يساوي"
          >
            =
          </button>
          <button
            onClick={() => handleButtonClick('1')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="1"
          >
            1
          </button>
          <button
            onClick={() => handleButtonClick('2')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="2"
          >
            2
          </button>
          <button
            onClick={() => handleButtonClick('3')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="3"
          >
            3
          </button>
          <button
            onClick={() => handleButtonClick('^')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="أس"
          >
            ^
          </button>
          <button
            onClick={() => handleButtonClick('.')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="فاصلة عشرية"
          >
            .
          </button>
          <button
            onClick={() => handleButtonClick('0')}
            class="col-span-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="0"
          >
            0
          </button>
          <button
            onClick={() => handleButtonClick('%')}
            class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer"
            aria-label="نسبة مئوية"
          >
            %
          </button>
        </div>
        {/* History */}
        <div class="mt-6">
          <h3 class="text-xl font-bold text-purple-600 mb-2">التاريخ</h3>
          <ul class="space-y-1 max-h-32 overflow-y-auto">
            <For each={history()}>
              {(item) => (
                <li class="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                  <span>{item.expression} = {item.result}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Calculator;