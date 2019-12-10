const fs = require('fs');
const input = fs.readFileSync('inputs/day10.txt').toString();

let map = input.split('\n').map(x => x.split(""));
map = map[0].map((_, col) => map.map(r => r[col]));

const allAsteroidPositions = map.reduce((current, next, x) => current.concat(next.map((v, y) => v == '#' ? [x, y] : undefined).filter(x => x)), [])

// https://stackoverflow.com/a/4652513/4937286
const reduceFrac = (numerator, denominator) =>{
    const getGcd = (a, b) => {
        return b ? getGcd(b, a % b) : a;
    };
    const gcd = getGcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}

const results = [];
for (const pos of allAsteroidPositions) {
    let visible = [];
    for (const otherPos of allAsteroidPositions) {
        if (pos === otherPos) continue;

        let slopeFrac;
        if (otherPos[1] == pos[1]) {
            slopeFrac = [Math.sign(otherPos[0] - pos[0]), 0];
        }
        else if (otherPos[0] == pos[0]) {
            slopeFrac = [0, Math.sign(otherPos[1] - pos[1])];
        }
        else {
            slopeFrac = reduceFrac(otherPos[0] - pos[0], otherPos[1] - pos[1]);
            if (slopeFrac[0] * slopeFrac[1] > 0) {
                if (otherPos[0] - pos[0] < 0) {
                    slopeFrac = [-slopeFrac[0], -slopeFrac[1]];
                }
            }
            else {
                if (otherPos[0] - pos[0] >= 0 && slopeFrac[0] < 0) {
                    slopeFrac = [-slopeFrac[0], -slopeFrac[1]];
                }
                else if (otherPos[0] - pos[0] < 0 && slopeFrac[0] > 0) {
                    slopeFrac = [-slopeFrac[0], -slopeFrac[1]];
                }
            }
        } 
        let x = pos[0] + slopeFrac[0];
        let y = pos[1] + slopeFrac[1];
        while (true) {
            if (map[x] === undefined || map[x][y] === undefined) {
                break;
            }
            if (map[x][y] === '#') {
                if (x === otherPos[0] && y === otherPos[1]) {
                    visible.push(otherPos);
                }
                break;
            }
            x += slopeFrac[0];
            y += slopeFrac[1];
        }
    }
    results.push([visible.length, pos, visible])
}

console.log(results.sort((a,b)=>b[0]-a[0])[0][0]);