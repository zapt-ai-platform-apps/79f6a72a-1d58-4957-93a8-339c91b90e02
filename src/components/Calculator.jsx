import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';

function Calculator() {
  const navigate = useNavigate();
  const [displayValue, setDisplayValue] = createSignal('0');
  const [operator, setOperator] = createSignal(null);
  const [firstOperand, setFirstOperand] = createSignal(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = createSignal(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand()) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue() === '0' ? digit : displayValue() + digit);
    }
  };

  const inputDecimal = (dot) => {
    if (waitingForSecondOperand()) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue().includes('.')) {
      setDisplayValue(displayValue() + dot);
    }
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(displayValue());

    if (operator() && waitingForSecondOperand()) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand() == null && !isNaN(inputValue)) {
      setFirstOperand(inputValue);
    } else if (operator()) {
      const result = calculate(firstOperand(), inputValue, operator());
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand, secondOperand, operator) => {
    if (operator === '+') {
      return firstOperand + secondOperand;
    } else if (operator === '-') {
      return firstOperand - secondOperand;
    } else if (operator === '*') {
      return firstOperand * secondOperand;
    } else if (operator === '/') {
      return firstOperand / secondOperand;
    }
    return secondOperand;
  };

  const resetCalculator = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleKeyDown = (event) => {
    const { key } = event;
    if (/\d/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
      handleOperator('=');
    } else if (key === 'Backspace') {
      setDisplayValue(displayValue().slice(0, -1) || '0');
    } else if (key === 'Escape') {
      resetCalculator();
    }
  };

  return (
    <div class="h-full flex flex-col items-center p-4 text-gray-800" onKeyDown={handleKeyDown} tabindex="0">
      <button
        onClick={() => navigate('/')}
        class="self-start mb-4 text-2xl cursor-pointer"
      >
        🔙
      </button>
      <h2 class="text-3xl font-bold text-purple-600 mb-6">الآلة الحاسبة</h2>
      <div class="w-full max-w-xs">
        <div class="mb-4">
          <input
            type="text"
            readOnly
            value={displayValue()}
            aria-label="شاشة الآلة الحاسبة"
            class="w-full p-3 text-right border border-gray-300 rounded-lg focus:outline-none box-border"
          />
        </div>
        <div class="grid grid-cols-4 gap-2">
          <button
            onClick={resetCalculator}
            class="col-span-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            aria-label="مسح"
          >
            مسح
          </button>
          <button
            onClick={() => handleOperator('/')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="قسمة"
          >
            ÷
          </button>
          <button
            onClick={() => handleOperator('*')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="ضرب"
          >
            ×
          </button>
          <button
            onClick={() => inputDigit('7')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="7"
          >
            7
          </button>
          <button
            onClick={() => inputDigit('8')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="8"
          >
            8
          </button>
          <button
            onClick={() => inputDigit('9')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="9"
          >
            9
          </button>
          <button
            onClick={() => handleOperator('-')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="طرح"
          >
            -
          </button>
          <button
            onClick={() => inputDigit('4')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="4"
          >
            4
          </button>
          <button
            onClick={() => inputDigit('5')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="5"
          >
            5
          </button>
          <button
            onClick={() => inputDigit('6')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="6"
          >
            6
          </button>
          <button
            onClick={() => handleOperator('+')}
            class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 cursor-pointer"
            aria-label="جمع"
          >
            +
          </button>
          <button
            onClick={() => inputDigit('1')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="1"
          >
            1
          </button>
          <button
            onClick={() => inputDigit('2')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="2"
          >
            2
          </button>
          <button
            onClick={() => inputDigit('3')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="3"
          >
            3
          </button>
          <button
            onClick={() => handleOperator('=')}
            class="row-span-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer"
            aria-label="يساوي"
          >
            =
          </button>
          <button
            onClick={() => inputDecimal('.')}
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="فاصلة عشرية"
          >
            .
          </button>
          <button
            onClick={() => inputDigit('0')}
            class="col-span-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 cursor-pointer"
            aria-label="0"
          >
            0
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;