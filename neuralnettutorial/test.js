var forwardMultiplyGate = function(x,y){
    return x * y
};

var x = -2, y = 3;
var out = forwardMultiplyGate(x,y);

//console.log(out);

var h = 0.0001; /*Tweak amount*/

//Compute derivative with respect to x
var xph = x + h;
var out2 = forwardMultiplyGate(xph,y);
var x_derivative;
x_derivative = (out2 - out) / h;

//console.log(out2, x_derivative);

//Compute derivative with respect to y
var yph = y + h;
var out3 = forwardMultiplyGate(x,yph);
var y_derivative = (out3-out)/h;

//console.log(out3, y_derivative);

//Adding in gradients
var step_size = 0.01;
var out = forwardMultiplyGate(x,y);

console.log(out);

x = x+step_size * x_derivative;
y = y + step_size * y_derivative;

var out_new = forwardMultiplyGate(x,y);

console.log(out_new);