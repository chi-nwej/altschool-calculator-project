document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display-value");
  const historyList = document.getElementById("history-list");
  let currentInput = "0";
  let previousInput = "";
  let operation = null;
  let shouldResetDisplay = false;
  const calculationHistory = [];

  // Add event listeners to all buttons
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const number = button.dataset.number;

      if (number) {
        inputNumber(number);
      } else if (action) {
        switch (action) {
          case "add":
          case "subtract":
          case "multiply":
          case "divide":
          case "power":
            handleOperator(action);
            break;
          case "decimal":
            inputDecimal();
            break;
          case "clear":
            clearCalculator();
            break;
          case "calculate":
            calculate();
            break;
          case "percent":
            handlePercent();
            break;
          case "delete":
            handleDelete();
            break;
        }
      }
      updateDisplay();
    });
  });

  // Add keyboard support
  document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (!isNaN(key) || key === ".") {
      // Numbers and decimal
      if (key === ".") {
        inputDecimal();
      } else {
        inputNumber(key);
      }
    } else if (["+", "-", "*", "/", "^"].includes(key)) {
      // Operators
      const operatorMap = {
        "+": "add",
        "-": "subtract",
        "*": "multiply",
        "/": "divide",
        "^": "power",
      };
      handleOperator(operatorMap[key]);
    } else if (key === "%") {
      handlePercent();
    } else if (key === "Enter" || key === "=") {
      calculate();
    } else if (key === "Escape") {
      clearCalculator();
    } else if (key === "Backspace") {
      handleDelete();
    }

    updateDisplay();
  });

  function inputNumber(number) {
    if (shouldResetDisplay) {
      currentInput = number;
      shouldResetDisplay = false;
    } else {
      currentInput = currentInput === "0" ? number : currentInput + number;
    }
  }

  function inputDecimal() {
    if (shouldResetDisplay) {
      currentInput = "0.";
      shouldResetDisplay = false;
      return;
    }

    if (!currentInput.includes(".")) {
      currentInput += ".";
    }
  }

  function handleOperator(op) {
    if (previousInput === "" || operation === null) {
      previousInput = currentInput;
    } else if (!shouldResetDisplay) {
      previousInput = calculate(false);
    }

    operation = op;
    shouldResetDisplay = true;
  }

  function calculate(updateDisplay = true) {
    const prev = Number.parseFloat(previousInput);
    const current = Number.parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    let operationSymbol;

    switch (operation) {
      case "add":
        result = prev + current;
        operationSymbol = "+";
        break;
      case "subtract":
        result = prev - current;
        operationSymbol = "−";
        break;
      case "multiply":
        result = prev * current;
        operationSymbol = "×";
        break;
      case "divide":
        if (current === 0) {
          result = "Error";
          operationSymbol = "÷";
        } else {
          result = prev / current;
          operationSymbol = "÷";
        }
        break;
      case "power":
        result = Math.pow(prev, current);
        operationSymbol = "^";
        break;
      default:
        return currentInput;
    }

    if (result === "Error") {
      clearCalculator();
      currentInput = "Error";
      return "Error";
    }

    // Format the result to avoid extremely long decimals
    result = Number.parseFloat(result.toFixed(10));

    if (updateDisplay) {
      // Add to history
      const historyItem = {
        expression: `${prev} ${operationSymbol} ${current}`,
        result: result,
      };
      calculationHistory.push(historyItem);
      updateHistory();

      operation = null;
      previousInput = "";
      currentInput = result.toString();
      shouldResetDisplay = true;
    }

    return result.toString();
  }

  function handlePercent() {
    const current = Number.parseFloat(currentInput);
    currentInput = (current / 100).toString();
  }

  function handleDelete() {
    if (currentInput.length === 1 || currentInput === "Error") {
      currentInput = "0";
    } else {
      currentInput = currentInput.slice(0, -1);
    }
  }

  function clearCalculator() {
    currentInput = "0";
    previousInput = "";
    operation = null;
    shouldResetDisplay = false;
  }

  function updateDisplay() {
    display.textContent = currentInput;
  }

  function updateHistory() {
    historyList.innerHTML = "";

    // Show only the last 5 calculations
    const recentHistory = calculationHistory.slice(-5);

    recentHistory.forEach((item) => {
      const historyItem = document.createElement("div");
      historyItem.className = "history-item";

      const expression = document.createElement("span");
      expression.className = "history-expression";
      expression.textContent = item.expression;

      const result = document.createElement("span");
      result.className = "history-result";
      result.textContent = "= " + item.result;

      historyItem.appendChild(expression);
      historyItem.appendChild(result);
      historyList.appendChild(historyItem);
    });
  }
});
