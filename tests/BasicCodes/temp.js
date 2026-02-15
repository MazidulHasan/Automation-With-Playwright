// Addition
function add(a, b) {
    return a + b;
}

// Multiplication
function multiply(a, b) {
    return a * b;
}

// Division
function divide(a, b) {
    if (b === 0) {
        return "Error";
    }
    return a / b;
}

console.log("Add:", add(10, 20));
console.log("Multiply:", multiply(5, 6));
console.log("Divide:", divide(20, 3));