const fs = require('fs');
const input = fs.readFileSync('inputs/day1.txt').toString();

console.log(input.split('\n').map(x => Math.floor(x / 3) - 2).reduce((a,b) => a+b, 0));