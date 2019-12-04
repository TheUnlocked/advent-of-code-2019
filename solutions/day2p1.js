const fs = require('fs');
const input = fs.readFileSync('inputs/day2.txt').toString();

let data = input.split(',').map(x=>+x);
data[1] = 12;
data[2] = 2;
let ip = 0;
while (data[ip] != 99 && ip + 3 < data.length) {
    if (data[ip] == 1) {
        data[data[ip+3]] = data[data[ip+1]] + data[data[ip+2]];
    }
    else {
        data[data[ip+3]] = data[data[ip+1]] * data[data[ip+2]];
    }
    ip += 4;
}

console.log(data[0]);