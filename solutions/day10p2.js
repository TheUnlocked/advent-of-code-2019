const fs = require('fs');
const input = fs.readFileSync('inputs/day10.txt').toString();

let map = input.split('\n').map(x => x.split(""));
map = map[0].map((_, col) => map.map(r => r[col]));

const allAsteroidPositions = map.reduce((current, next, x) => current.concat(next.map((v, y) => v == '#' ? [x, y] : undefined).filter(x => x)), [])

// https://stackoverflow.com/a/4652513
const reduceFrac = (numerator, denominator) =>{
    const getGcd = (a, b) => {
        return b ? getGcd(b, a % b) : a;
    };
    const gcd = Math.abs(getGcd(numerator, denominator));
    return [numerator / gcd, denominator / gcd];
}

const pos = [20, 21];

let vaporized = 0;

const tryVaporize = direction => {
    let vaporPos = [pos[0] + direction[0], pos[1] + direction[1]];
    while (map[vaporPos[0]] && map[vaporPos[0]][vaporPos[1]]) {
        if (map[vaporPos[0]][vaporPos[1]] === '#') {
            map[vaporPos[0]][vaporPos[1]] = '.';
            return vaporPos;
        }
        vaporPos = [vaporPos[0] + direction[0], vaporPos[1] + direction[1]];
    }
    return undefined;
}

const rotate = x => x;

const allPositions = [];
for (let x = 0; x < map.length; x++) for (let y = 0; y < map[x].length; y++) allPositions.push([x - pos[0], y - pos[1]]);
const sortedPositions = allPositions.filter(x => !(x[0] == 0 && x[1] == 0)).sort((a, b) => rotate(Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0])));
let dirs = sortedPositions.map(x => reduceFrac(...x)).reduce((current, next) => current.find(x => x[0] == next[0] && x[1] == next[1]) ? current : [...current, next], []);
const indexOfZeroOne = dirs.findIndex(x => x[0] == 0 && x[1] == -1);
dirs = [...dirs.slice(indexOfZeroOne), ...dirs.slice(0, indexOfZeroOne)];
console.log(dirs.map(x => (Math.atan2(x[1], x[0]) / Math.PI).toPrecision(3)).join(', '));

let lastVaporized;
while (vaporized < 200) {
    for (const dir of dirs) {
        const result = tryVaporize(dir);
        if (result) {
            vaporized++;
            console.log(`Vaporized ${result}`);
        }
        if (vaporized == 200) {
            lastVaporized = result;
            break;
        }
    }
}
console.log(lastVaporized[0] * 100 + lastVaporized[1]);