var operators = ["+", "-", "/", "*"];

var box = null;
var last_operation_history = null;
var operator = null;
var equal = null;
var dot = null;

var firstNum = true;

var numbers = [];
var operator_value;
var last_button;
var calc_operator;

var total;

var key_combination = [];

// Roast array for simple calculations
const roasts = [
    "2+2? Are you a baby or just bad at life?",
    "Wow, did you need me for that, genius?",
    "Kindergarten called, they want their math back.",
    "My cat could do that with its eyes closed.",
    "What’s next, counting your fingers?",
    "Even a broken clock is smarter than this.",
    "Did you just discover numbers, kid?",
    "I’m embarrassed for you right now.",
    "This is why calculators hate humans.",
    "Congrats, you’ve peaked at preschool level!"
];

// Function to check if a calculation is "simple"
function isSimpleCalculation(num1, num2, operator) {
    const n1 = Math.abs(parseFloat(num1));
    const n2 = Math.abs(parseFloat(num2));
    return n1 < 10 && n2 < 10 && operators.includes(operator) && !num1.includes(".") && !num2.includes(".");
}

function button_number(button) {
    operator = document.getElementsByClassName("operator");
    box = document.getElementById("box");
    last_operation_history = document.getElementById("last_operation_history");
    equal = document.getElementById("equal_sign").value;
    dot = document.getElementById("dot").value;
    
    last_button = button;

    // Clear roast on new input (except when pressing =)
    if (button !== equal) {
        document.getElementById("roast").innerText = "";
    }

    // if button is not an operator or = sign
    if (!operators.includes(button) && button != equal) {
        if (firstNum) {
            if (button == dot) {
                box.innerText = "0" + dot;
            } else {
                box.innerText = button;
            }
            firstNum = false;
        } else {
            if (box.innerText.length == 1 && box.innerText == 0) {
                if (button == dot) {
                    box.innerText += button;
                }
                return;
            }
            if (box.innerText.includes(dot) && button == dot) {
                return;
            }
            if (box.innerText.length == 20) {
                return;
            }
            if (button == dot && box.innerText == "-") {
                box.innerText = "-0" + dot;
            } else {
                box.innerText += button;
            }  
        }
    } else {
        if (operator_value != null && button == operator_value) {
            return;
        }

        if (button == "-" && box.innerText == 0) {
            box.innerText = button;
            firstNum = false;
            operator_value = button;
            showSelectedOperator();
            return;
        } else if (operators.includes(button) && box.innerText == "-") {
            return;
        } else if (button == "-" && operator_value == "-" && last_operation_history.innerText.includes("=")) {
            return;
        }

        if (operators.includes(button)) {
            if (typeof last_operator != "undefined" && last_operator != null) {
                calc_operator = last_operator;
            } else {
                calc_operator = button;
            }
            if (button == "*") {
                last_operator = "×";
            } else if (button == "/") {
                last_operator = "÷";
            } else {
                last_operator = button;
            }
            operator_value = button;
            firstNum = true;
            showSelectedOperator();
        }

        if (numbers.length == 0) {
            numbers.push(box.innerText);
            if (typeof last_operator != "undefined" && last_operator != null) {
                last_operation_history.innerText = box.innerText + " " + last_operator;
            }
        } else {   
            if (numbers.length == 1) {
                numbers[1] = box.innerText;
            }
            var temp_num = box.innerText;

            // Calculate total and roast if simple
            if (button == equal && calc_operator != null) {
                var total = calculate(numbers[0], numbers[1], calc_operator);
                box.innerText = total;

                // Roast logic here
                if (isSimpleCalculation(numbers[0], numbers[1], calc_operator)) {
                    const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
                    document.getElementById("roast").innerText = randomRoast;
                }

                if (!last_operation_history.innerText.includes("=")) {
                    last_operation_history.innerText += " " + numbers[1] + " =";
                }

                temp_num = numbers[0];
                numbers[0] = total;
                operator_value = null;
                showSelectedOperator();

                var history_arr = last_operation_history.innerText.split(" ");
                history_arr[0] = temp_num;
                last_operation_history.innerText = history_arr.join(" ");
            } else if (calc_operator != null) {
                last_operation_history.innerText = temp_num + " " + last_operator;
                calc_operator = button;
                numbers = [];
                numbers.push(box.innerText);
            }
        }
    }
}

// Highlight operator button when selected
function showSelectedOperator() {
    var elements = document.getElementsByClassName("operator");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#e68a00";
    }
    if (operator_value == "+") {
        document.getElementById("plusOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value == "-") {
        document.getElementById("subOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value == "*") {
        document.getElementById("multiOp").style.backgroundColor = "#ffd11a";
    } else if (operator_value == "/") {
        document.getElementById("divOp").style.backgroundColor = "#ffd11a";
    }
}

// Function to calculate the result
function calculate(num1, num2, operator) {
    if (operator === "+") {
        total = parseFloat(num1) + parseFloat(num2);
    } else if (operator === "-") {
        total = parseFloat(num1) - parseFloat(num2);
    } else if (operator === "*") {
        total = parseFloat(num1) * parseFloat(num2);
    } else if (operator === "/") {
        total = parseFloat(num1) / parseFloat(num2);
    } else {
        if (total == box.innerText) {
            return total;
        } else {
            return box.innerText;
        }
    }
    if (!Number.isInteger(total)) {
        total = total.toPrecision(12);
    }
    return parseFloat(total);
}

// Reset everything
function button_clear() {
    window.location.reload();
}

// Backspace functionality
function backspace_remove() {
    box = document.getElementById("box");
    var elements = document.getElementsByClassName("operator");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = "#e68a00";
    }
    var last_num = box.innerText;
    last_num = last_num.slice(0, -1);
    box.innerText = last_num;
    if (box.innerText.length == 0) {
        box.innerText = 0;
        firstNum = true;
    }
    document.getElementById("roast").innerText = ""; // Clear roast on backspace
}

// Rest of your functions (unchanged for brevity)
function plus_minus() { /* ... */ }
function square_root() { /* ... */ }
function division_one() { /* ... */ }
function power_of() { /* ... */ }
function calculate_percentage() { /* ... */ }
function clear_entry() { /* ... */ }

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

function keyPressed(e) { /* ... */ }
function keyReleased(e) { /* ... */ }