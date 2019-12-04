const fs = require('fs');
const input = fs.readFileSync('inputs/day3.txt').toString();

const wireTexts = input.split('\n');

const parseSegment = txt => ({
    'R': { x: +txt.slice(1), y: 0 },
    'L': { x: -txt.slice(1), y: 0 },
    'U': { x: 0, y: +txt.slice(1) },
    'D': { x: 0, y: -txt.slice(1) },
}[txt[0]]);

const wire1 = wireTexts[0].split(',').map(parseSegment);
const wire2 = wireTexts[1].split(',').map(parseSegment);

const getIntervalIntersection = (int1, int2) => {
    if (int1[0] > int2[1] || int2[0] > int1[1]) {
        return null;
    }
    return [Math.max(int1[0], int2[0]), Math.min(int1[1], int2[1])];
}

const getDistOfIntersection = (path1, path2) => {
    const xInt = getIntervalIntersection([path1[0].x, path1[1].x].sort((a,b)=>a-b), [path2[0].x, path2[1].x].sort((a,b)=>a-b));
    const yInt = getIntervalIntersection([path1[0].y, path1[1].y].sort((a,b)=>a-b), [path2[0].y, path2[1].y].sort((a,b)=>a-b));
    if (xInt != null && yInt != null) {
        const xPt = path1[0].x == path1[1].x ? path1[0].x : path2[0].x;
        const yPt = path1[0].y == path1[1].y ? path1[0].y : path2[0].y;
        return Math.abs(xPt) + Math.abs(yPt);
    }
    return null;
};

const addPos = (pos1, pos2) => ({ x: pos1.x + pos2.x, y: pos1.y + pos2.y });

const getClosestIntersection = (wire1, wire2) => {
    const allDists = [];

    let wire1Pos = {x: 0, y: 0};
    for (const seg1 of wire1) {
        const wire1Path = [wire1Pos, addPos(wire1Pos, seg1)];
        let wire2Pos = {x: 0, y: 0};
        for (const seg2 of wire2) {
            const wire2Path = [wire2Pos, addPos(wire2Pos, seg2)];
            allDists.push(getDistOfIntersection(wire1Path, wire2Path));
            wire2Pos = wire2Path[1];
        }
        wire1Pos = wire1Path[1];
    }

    return allDists.filter(x=>x != null && x != 0).sort((a,b) => a-b)[0];
}

console.log(getClosestIntersection(wire1, wire2));