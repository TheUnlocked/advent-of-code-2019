const fs = require('fs');
const input = fs.readFileSync('inputs/day4.txt').toString();

const lower = input.split('-')[0];
const higher = input.split('-')[1];

let validCount = 0;
let check = lower;

while (check <= higher) {
    const checkStr = `${check}`;

    let adj = false;
    let minDig = -1;
    let asc = true;
    let repLen = 0;

    for (const dig of checkStr) {
        if (minDig > +dig) {
            asc = false;
            break;
        }
        else if (minDig == +dig) {
            repLen++;
        }
        else {
            if (repLen == 2) {
                adj = true;
            }
            repLen = 1;
        }
        minDig = +dig;
    }

    if (repLen == 2) {
        adj = true;
    }

    if (adj && asc) {
        validCount++;
    }
    check++;
}

console.log(validCount);