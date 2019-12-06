const fs = require('fs');
const input = fs.readFileSync('inputs/day6.txt').toString();

const relations = input.split('\n').map(x => x.split(')'));

class Node {
    constructor() {
        this.parent = undefined;
    }
}

const countDepth = node => (function countDepthIter (node, tally) {
    if (node.parent === undefined) {
        return tally;
    }
    return countDepthIter(node.parent, tally + 1);
})(node, 0);

const COM = new Node();
const nodes = {
    COM: COM,
    ...Object.fromEntries(relations.map(x => [x[1], new Node()]))
};

for (const rel of relations) {
    nodes[rel[1]].parent = nodes[rel[0]];
}

let total = 0;
for (const node of Object.values(nodes)) { 
    total += countDepth(node);
}

console.log(total);