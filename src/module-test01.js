import Person, { a,f } from './Person.mjs';

const p2 = new Person('Flora', 26);

console.log(p2.toString());
console.log({ a });
console.log(f(7));


// 要去packge.json 增改"type": "module"