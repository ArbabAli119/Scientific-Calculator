let result = document.getElementById('result');
let buttons = document.querySelectorAll('.button');
let isFunction = false;
let isPi = false;
let isDegree = false;
let isOpenBracket = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        let buttonText = button.textContent;
        switch (buttonText) {
            case 'C':
                result.value = ''; // Clear the result
                isFunction = false;
                isPi = false;
                isDegree = false;
                isOpenBracket = false;
                break;
            case '⌫':
                result.value = result.value.slice(0, -1); // Remove the last character
                break;
            case '=':
                try {
                    let expression = result.value;

                    // Handle trigonometric functions without parentheses (e.g., cos60 -> cos(60))
                    expression = expression.replace(/(sin|cos|tan|cosec|sec|cot)(\d+)/g, (match, func, num) => `${func}(${num})`);

                    // Replace trigonometric functions with degree to radian conversion
                    expression = expression.replace(/sin\((.*?)\)/g, (match, p1) => `Math.sin((${p1}) * Math.PI / 180)`);
                    expression = expression.replace(/cos\((.*?)\)/g, (match, p1) => `Math.cos((${p1}) * Math.PI / 180)`);
                    expression = expression.replace(/tan\((.*?)\)/g, (match, p1) => `Math.tan((${p1}) * Math.PI / 180)`);
                    expression = expression.replace(/cosec\((.*?)\)/g, (match, p1) => `1 / Math.sin((${p1}) * Math.PI / 180)`);
                    expression = expression.replace(/sec\((.*?)\)/g, (match, p1) => `1 / Math.cos((${p1}) * Math.PI / 180)`);
                    expression = expression.replace(/cot\((.*?)\)/g, (match, p1) => `1 / Math.tan((${p1}) * Math.PI / 180)`);

                    // Handle square root: Replace '√' with 'Math.sqrt'
                    expression = expression.replace(/√(\d+|\([^)]+\))/g, (match, p1) => `Math.sqrt(${p1})`);

                    // Replace constants
                    expression = expression.replace(/π/g, 'Math.PI');
                    expression = expression.replace(/e/g, 'Math.E');

                    // Convert degrees to radians in standalone degree inputs
                    expression = expression.replace(/(\d+)deg/g, '($1 * Math.PI / 180)');
                    
                    // Evaluate the expression safely
                    result.value = eval(expression);
                } catch (e) {
                    result.value = 'Error'; // Handle invalid input
                }
                isFunction = false;
                isPi = false;
                isDegree = false;
                isOpenBracket = false;
                break;

            // Trigonometric and mathematical functions
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
            case 'cosec':
            case 'sec':
            case 'cot':
                result.value += buttonText + '(';
                isOpenBracket = true; // To ensure proper bracket handling
                break;

            // Square root function
            case '√':
                result.value += '√'; // Add square root symbol
                break;

            // Constants
            case 'e':
                result.value += 'e';
                break;
            case 'π':
                result.value += 'π';
                break;

            // Arithmetic operators
            case '+':
            case '-':
            case '×':
            case '÷':
                result.value += {
                    '+': '+',
                    '-': '-',
                    '×': '*',
                    '÷': '/'
                }[buttonText];
                break;

            // Power and brackets
            case 'x²':
                result.value += '**2';
                break;
            case '(':
                result.value += '(';
                isOpenBracket = true;
                break;
            case ')':
                if (isOpenBracket) {
                    result.value += ')';
                    isOpenBracket = false;
                }
                break;

            // Modulus and percentage
            case '%':
                result.value += '/100';
                break;

            default:
                result.value += buttonText; // Add number or other symbols
                break;
        }
    });
});
