document.addEventListener("DOMContentLoaded", () => {
  var displayElement = document.getElementById("display-value");
  var historyListElement = document.getElementById("history-list");

  // store our calculator state
  var currentNumber = "0";
  var previousNumber = "";
  var currentOperation = null;
  var needToClearDisplay = false; // Whether to clear the display on next number input
  var historyArray = []; // store calculation history

  // Add click handlers to all the buttons
  var allButtons = document.querySelectorAll(".btn");
  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      var buttonAction = this.dataset.action;
      var buttonNumber = this.dataset.number;

      // If number
      if (buttonNumber) {
        handleNumberInput(buttonNumber);
      } else if (buttonAction) {
        // if operation
        if (buttonAction == "add") {
          handleOperatorInput("add");
        } else if (buttonAction == "subtract") {
          handleOperatorInput("subtract");
        } else if (buttonAction == "multiply") {
          handleOperatorInput("multiply");
        } else if (buttonAction == "divide") {
          handleOperatorInput("divide");
        } else if (buttonAction == "power") {
          handleOperatorInput("power");
        } else if (buttonAction == "decimal") {
          handleDecimalInput();
        } else if (buttonAction == "clear") {
          clearCalculator();
        } else if (buttonAction == "calculate") {
          performCalculation();
        } else if (buttonAction == "percent") {
          handlePercentInput();
        } else if (buttonAction == "delete") {
          handleBackspaceInput();
        }
      }

      // Update display
      updateDisplayValue();
    });
  }

  document.addEventListener("keydown", (event) => {
    var keyPressed = event.key;

    if (keyPressed >= "0" && keyPressed <= "9") {
      handleNumberInput(keyPressed);
    }
    // Handle decimal point
    else if (keyPressed == ".") {
      handleDecimalInput();
    }
    // Handle operators
    else if (keyPressed == "+") {
      handleOperatorInput("add");
    } else if (keyPressed == "-") {
      handleOperatorInput("subtract");
    } else if (keyPressed == "*") {
      handleOperatorInput("multiply");
    } else if (keyPressed == "/") {
      handleOperatorInput("divide");
    } else if (keyPressed == "^") {
      handleOperatorInput("power");
    }
    // Handle equals/enter
    else if (keyPressed == "Enter" || keyPressed == "=") {
      performCalculation();
    }
    // Handle escape (clear)
    else if (keyPressed == "Escape") {
      clearCalculator();
    }
    // Handle backspace
    else if (keyPressed == "Backspace") {
      handleBackspaceInput();
    }
    // Handle percent
    else if (keyPressed == "%") {
      handlePercentInput();
    }

    // Update the display
    updateDisplayValue();
  });

  // Function to handle when a number button is pressed
  function handleNumberInput(number) {
    // If we need to clear the display first
    if (needToClearDisplay == true) {
      currentNumber = number;
      needToClearDisplay = false;
    } else {
      // If the display shows 0, replace it, otherwise add to it
      if (currentNumber == "0") {
        currentNumber = number;
      } else {
        currentNumber = currentNumber + number;
      }
    }
  }

  // Function to handle decimal point button
  function handleDecimalInput() {
    // If we need to clear the display first
    if (needToClearDisplay == true) {
      currentNumber = "0.";
      needToClearDisplay = false;
      return;
    }

    // Only add decimal if there isn't one already
    if (currentNumber.indexOf(".") == -1) {
      currentNumber = currentNumber + ".";
    }
  }

  // Function to handle operator buttons (+, -, *, /)
  function handleOperatorInput(operator) {
    // If this is the first number in the calculation
    if (previousNumber == "" || currentOperation == null) {
      previousNumber = currentNumber;
    }
    // If we already have a first number and an operation
    else if (needToClearDisplay == false) {
      // Calculate the result so far
      var result = performCalculation(false);
      previousNumber = result;
    }

    // Set the current operation and prepare for next number
    currentOperation = operator;
    needToClearDisplay = true;
  }

  // Function to perform the calculation
  function performCalculation(updateDisplay) {
    // Default parameter value
    if (updateDisplay === undefined) {
      updateDisplay = true;
    }

    // Convert string numbers to actual numbers
    var firstNumber = Number.parseFloat(previousNumber);
    var secondNumber = Number.parseFloat(currentNumber);

    // Check if we have valid numbers
    if (isNaN(firstNumber) || isNaN(secondNumber)) {
      return;
    }

    var calculationResult;
    var operationSymbol;

    // Perform the right operation based on what button was pressed
    if (currentOperation == "add") {
      calculationResult = firstNumber + secondNumber;
      operationSymbol = "+";
    } else if (currentOperation == "subtract") {
      calculationResult = firstNumber - secondNumber;
      operationSymbol = "−";
    } else if (currentOperation == "multiply") {
      calculationResult = firstNumber * secondNumber;
      operationSymbol = "×";
    } else if (currentOperation == "divide") {
      // Check for division by zero
      if (secondNumber == 0) {
        calculationResult = "Error";
        operationSymbol = "÷";
      } else {
        calculationResult = firstNumber / secondNumber;
        operationSymbol = "÷";
      }
    } else if (currentOperation == "power") {
      calculationResult = Math.pow(firstNumber, secondNumber);
      operationSymbol = "^";
    } else {
      return currentNumber;
    }

    // division by zero error handling
    if (calculationResult == "Error") {
      clearCalculator();
      currentNumber = "Error";
      return "Error";
    }

    // Round the result to avoid very long decimals
    calculationResult = Number.parseFloat(calculationResult.toFixed(10));

    // If = was pressed
    if (updateDisplay == true) {
      // Add this calculation to the history
      var historyItem = {
        expression: firstNumber + " " + operationSymbol + " " + secondNumber,
        result: calculationResult,
      };
      historyArray.push(historyItem);
      updateHistoryDisplay();

      // Reset
      currentOperation = null;
      previousNumber = "";
      currentNumber = calculationResult.toString();
      needToClearDisplay = true;
    }

    return calculationResult.toString();
  }

  // Function to handle percent button
  function handlePercentInput() {
    var number = Number.parseFloat(currentNumber);
    currentNumber = (number / 100).toString();
  }

  // Function to handle backspace button
  function handleBackspaceInput() {
    // If there's only one digit or there's an error
    if (currentNumber.length == 1 || currentNumber == "Error") {
      currentNumber = "0";
    } else {
      // Remove the last character
      currentNumber = currentNumber.substring(0, currentNumber.length - 1);
    }
  }

  // Function to clear the calculator
  function clearCalculator() {
    currentNumber = "0";
    previousNumber = "";
    currentOperation = null;
    needToClearDisplay = false;
  }

  // Function to update what's shown on the calculator display
  function updateDisplayValue() {
    displayElement.textContent = currentNumber;
  }

  // Function to update the history section
  function updateHistoryDisplay() {
    // Clear the current history display
    historyListElement.innerHTML = "";

    // Get only the last 5 calculations
    var startIndex = 0;
    if (historyArray.length > 5) {
      startIndex = historyArray.length - 5;
    }

    // Add each history item to the display
    for (var i = startIndex; i < historyArray.length; i++) {
      var item = historyArray[i];

      // Create a div for this history item
      var historyItemDiv = document.createElement("div");
      historyItemDiv.className = "history-item";

      // Create a span for the expression
      var expressionSpan = document.createElement("span");
      expressionSpan.className = "history-expression";
      expressionSpan.textContent = item.expression;

      // Create a span for the result
      var resultSpan = document.createElement("span");
      resultSpan.className = "history-result";
      resultSpan.textContent = "= " + item.result;

      // Add the spans to the div
      historyItemDiv.appendChild(expressionSpan);
      historyItemDiv.appendChild(resultSpan);

      // Add the div to the history list
      historyListElement.appendChild(historyItemDiv);
    }
  }
});
