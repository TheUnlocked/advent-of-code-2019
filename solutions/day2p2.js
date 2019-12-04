const fs = require('fs');
const input = fs.readFileSync('inputs/day2.txt').toString();

const baseData = input.split(',').map(x=>+x);

let data, ip;
const execute = (a, b) => {
    data = [...baseData];
    data[1] = a;
    data[2] = b;
    ip = 0;
    while (data[ip] != 99 && ip + 3 < data.length) {
        if (data[ip] == 1) {
            data[data[ip+3]] = data[data[ip+1]] + data[data[ip+2]];
        }
        else {
            data[data[ip+3]] = data[data[ip+1]] * data[data[ip+2]];
        }
        ip += 4;
    }
}

for (let i = 0; i < 100; i++) for (let j = 0; j < 100; j++) {
    execute(i,j);
    if (data[0] == 19690720) {
        console.log(100 * i + j);
        break;
    }
}