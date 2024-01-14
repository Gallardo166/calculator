function add(firstNumber, secondNumber) {
    return Math.round((firstNumber + secondNumber) * (10 ** 7))/(10 ** 7);
};

function subtract(firstNumber, secondNumber) {
    return Math.round((firstNumber - secondNumber) * (10 ** 7))/(10 ** 7);
};

function multiply(firstNumber, secondNumber) {
    return Math.round((firstNumber * secondNumber) * (10 ** 7))/(10 ** 7)
};

function divide(firstNumber, secondNumber) {
    return Math.round((firstNumber / secondNumber) * (10 ** 7))/(10 ** 7);
};

let firstNumber, secondNumber, operator;

function operate(operator, firstNumber, secondNumber) {
    switch (operator) {
        case "+": 
            return add(firstNumber,secondNumber);
        case "−":
        case "-":
            return subtract(firstNumber, secondNumber);
        case "×":
            return multiply(firstNumber, secondNumber);
        case "÷":
            return divide(firstNumber, secondNumber);
    };
};

let values = [];
let currentNumber = "";
let finalValue = 0;

const history = document.querySelector("#history");
const result = document.querySelector("#result");
const buttons = Array.from(document.querySelectorAll("button"))
buttons.forEach(button => button.addEventListener("click", ()=> {
    switch (button.textContent) {
        case "−":
            if (values.length == 0 || (!(values.length > 0 && values[values.length - 1].charCodeAt(0) > 47 && values[values.length - 1].charCodeAt(0) < 58))) {
                history.textContent += button.textContent;
            } else history.textContent += " " + button.textContent + " ";
            values.push("-");
            if (checkOperator(values) === false) result.textContent = "Error";
            break;
        case "÷":
        case "×":
        case "+":
            history.textContent += " " + button.textContent + " ";
            values.push(button.textContent)
            if (checkOperator(values) === false) result.textContent = "Error";
            break;
        case "Clear":
            history.textContent = "";
            result.textContent = "";
            values = [];
            break;
        case "=":
            if (checkOperator(values)) {
                history.textContent = result.textContent;
                values = [result.textContent];
                result.textContent = "";
                break;
            } else break;
        case "Delete":
            //clear the back of history
            if (history.textContent.at(-1) == " ") {
                history.textContent = history.textContent.slice(0,history.textContent.length - 3);
            } else history.textContent = history.textContent.slice(0,history.textContent.length - 1);
            //if we delete an operator, we get either a single number remaining or a complete operation (ending with a number)
            //either way, the last operator in the values array must be removed (except for -)
            if (values.length > 0 && !(values[values.length - 1].at(-1).charCodeAt() > 47 && values[values.length - 1].at(0).charCodeAt() < 58) && !(values[values.length - 1] == "-" && !(values.length > 1 && values[values.length - 2].charCodeAt(0) > 47 && values[values.length - 2].charCodeAt(0) < 58)) && !(values[values.length - 1].at(-1) == ".")) { //check whether last character is a number
                values.pop();
            //if we delete a number, delete either an array element containing a single digit or slice off an element's last digit
            } else if (values[values.length - 1].length == 1) values.pop();
            else values[values.length - 1] = values[values.length - 1].slice(0, values[values.length - 1].length - 1);
            if (checkOperator(values)) result.textContent =  calculate(values);
            break;
        case ".":
            if (values[values.length -1].includes(".")) break;
            if (values.length > 0 && values[values.length - 1].at(-1).charCodeAt() > 47 && values[values.length - 1].at(-1).charCodeAt() < 58) {
                values[values.length - 1] = values[values.length - 1] + button.textContent;
                history.textContent += ".";
            }
            else {
                values.push("0.");
                history.textContent += "0.";
            };
            if (checkOperator(values)) result.textContent = calculate(values);
            else result.textContent = "Error";
            break;
        default:
            history.textContent += button.textContent;
            if (values.length > 0 && ((values[values.length - 1].at(-1).charCodeAt() > 47 && values[values.length - 1].at(-1).charCodeAt() < 58) || (values[values.length - 1] == "-" && !(values.length > 1 && values[values.length - 2].charCodeAt(0) > 47 && values[values.length - 2].charCodeAt(0) < 58)) || (values.length == 1 && values[0] == "-") || (values[values.length - 1].at(-1) == "."))) values[values.length - 1] = values[values.length - 1] + button.textContent;
            else values.push(button.textContent);
            if (checkOperator(values)) result.textContent = calculate(values);
            else result.textContent = "Error";
            break;
    };
}));

//calculate a chain of operations
function calculate(values) {
    let valuesPlaceholder = [];
    for (i=0; i<values.length; i++) {
        valuesPlaceholder[i] = values[i];
    };
    while (valuesPlaceholder.length > 2) {
    valuesPlaceholder.splice(0, 3, operate(valuesPlaceholder[1], Number(valuesPlaceholder[0]), Number(valuesPlaceholder[2])));
    };
    return valuesPlaceholder[0];
};


//check for two consecutive operators / leading operator / leading dot
function checkOperator(values) {
    for (i=0; i< values.length - 1; i++) {
        if (!(values[i].charCodeAt(0) > 47 && values[i].charCodeAt(0) < 58) && !(values[i].includes("-")) && !(values[i + 1].charCodeAt(0) > 47 && values[i + 1].charCodeAt(0) < 58) && !(values[i + 1].includes("-"))) return false;
    };
    if (values.length > 0 && !(values[0].at(-1).charCodeAt() > 47 && values[0].at(-1).charCodeAt() < 58) && !(values[0] == "-") && !(values[0].includes("."))) return false;
    for (i=0; i< values.length - 1; i++) {
        if (values[i] == "÷" && values[i + 1] == "0") return false;
    };
    return true;
};