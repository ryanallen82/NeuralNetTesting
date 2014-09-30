var forwardMultiplyGate = function(x,y){
    return x * y
};

//P.S. the derivative with respect to X is Y and visa versa

var x = -2, y =3;
var out = forwardMultiplyGate(x,y);

console.log(out); // -6

var x_gradient = y;
var y_gradient = x;

var step_size = 0.01;
x += step_size * x_gradient;
y += step_size * y_gradient;

var out_new = forwardMultiplyGate(x,y);

console.log(out_new);


