// yield - дорога в обе стороны, не только генерация данных,
// но и получение их из следующего next

// Generator Function
function* gen() {

  console.log("Result: ", yield "Сколько будет 2 + 2?"); // result 4
  // ...
  // 
}

var generator = gen(); // Generator

console.log("<--", generator.next());
console.log("<--", generator.next(4));
// { value: "Сколько будет 2 + 2?", done: false }

/*
setTimeout(function() {
  generator.next("4");
}, 5000);

*/