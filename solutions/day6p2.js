const fs = require('fs');
const input = fs.readFileSync('inputs/day6.txt').toString();

const relations = input.split('\n').map(x => x.split(')'));

class Node {
    constructor() {
        this.parent = undefined;
    }
}

const makePath = node => (function makePathIter (node, path) {
    if (node.parent === undefined) {
        return path;
    }
    return makePathIter(node.parent, [...path, node]);
})(node.parent, []);

const COM = new Node();
const nodes = {
    COM: COM,
    ...Object.fromEntries(relations.map(x => [x[1], new Node()]))
};

for (const rel of relations) {
    nodes[rel[1]].parent = nodes[rel[0]];
}

const myPath = makePath(nodes["YOU"]);
const sanPath = makePath(nodes["SAN"]);
for (const node of myPath) {
    if (sanPath.includes(node)) {
        const myDistToCommon = myPath.indexOf(node);
        const sanDistToCommon = sanPath.indexOf(node);
        console.log(myDistToCommon + sanDistToCommon);
        break;
    }
}