var Unit = function(value, grad){
    //Value computed in the forward pass
    this.value = value;
    //The derivative of circuit output w.r.t this unit, computed in backward pass
    this.grad = grad;
};

var multiplyGate = function(){};
multiplyGate.prototype = {
    forward: function(u0,u1){
    // store pointers to input Units u0 and u1 and output unit utop
        this.u0 = u0;
        this.u1 = u1;
        this.utop = new Unit(u0.value * u1.value, 0.0);
        return this.utop;
    },
    backward: function(){
    // Take the gradient in output unit and chain it with the local gradients
    // then write those gradients to those units
    this.u0.grad += this.u1.value * this.utop.grad;
    this.u1.grad += this.u0.value * this.utop.grad;
    }
};

var addGate = function(){};
addGate.prototype = {
    forward: function (u0, u1) {
        this.u0 = u0;
        this.u1 = u1;
        this.utop = new Unit(u0.value + u1.value, 0.0);
        return this.utop;
    },
    backward: function () {
        // add gate. derivative wrt both inputs is 1
        this.u0.grad += 1 * this.utop.grad;
        this.u1.grad += 1 * this.utop.grad;
    }
};

var sigmoidGate = function(){
    // helper function
    this.sig = function(x){return 1 / (1 + Math.exp(-x));};
};
sigmoidGate.prototype = {
    forward: function(u0){
        this.u0 = u0;
        this.utop = new Unit(this.sig(this.u0.value),0.0);
        return this.utop;
    },
    backward: function(){
        var s = this.sig(this.u0.value);
        this.u0.grad += (s * (1-s))*this.utop.grad;
    }
};

// create input units
var a = new Unit(1.0,0.0);
var b = new Unit(2.0, 0.0);
var c = new Unit(-3.0, 0.0);
var x = new Unit(-1.0, 0.0);
var y = new Unit(3.0, 0.0);

//create the gates
var mulg0 = new multiplyGate();
var mulg1 = new multiplyGate();
var addg0 = new addGate();
var addg1 = new addGate();
var sg0 = new sigmoidGate();

//do the forward pass

var forwardNeuron = function(){
    ax = mulg0.forward(a,x); //a*x = -1
    by = mulg1.forward(b,y); //b*y = 6
    axpby = addg0.forward(ax, by); // a*x + b*y = 5
    axpbypc = addg1.forward(axpby, c); //a*x + b*y + c = 2
    s = sg0.forward(axpbypc); // sig(a*x + b*y + c) = 0.8808
};
forwardNeuron();

console.log('Circuit output: ' + s.value);

// to compute gradient you need to iterate in reverse order and call the backward function
s.grad = 1.0; //tugs at the last gate with a force of +1, to increase the output value
sg0.backward(); // writes the gradient into axpbypc
addg1.backward(); // writes the gradient to axpby and c
addg0.backward(); // writes the gradient into ax and by
mulg1.backward(); //writes gradients into b and y
mulg0.backward(); //writes gradients into a and x

// make inputs respond to computer gradients and check that function increased
var step_size = 0.01;
a.value += step_size * a.grad;
b.value += step_size * b.grad;
c.value += step_size * c.grad;
x.value += step_size * x.grad;
y.value += step_size * y.grad;

forwardNeuron();
console.log('Circuit output after one backprop: ' + s.value);
