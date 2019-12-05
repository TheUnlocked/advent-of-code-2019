const fs = require('fs');
const input = fs.readFileSync('inputs/day5.txt').toString();

const baseData = input.split(',').map(x => +x);

let data, ip, inputs, inPtr, output;

const addr = ref => data[ref];
const imm = v => v;

const add = (p1, p2, p3, a, b, ref) => data[ref] = p1(a) + p2(b);
const mul = (p1, p2, p3, a, b, ref) => data[ref] = p1(a) * p2(b);
const read = (p1, ref) => data[ref] = inputs[inPtr++];
const out = (p1, v) => output.push(p1(v));
const halt = () => { throw 0; }

const modeTable = {
    0: addr,
    1: imm
}

const argTable = {
    [add]: 3,
    [mul]: 3,
    [read]: 1,
    [out]: 1,
    [halt]: 0
}

const opTable = {
    1: add,
    2: mul,
    3: read,
    4: out,
    99: halt
}

const performInstruction = () => {
    const opCode = `${data[ip]}`;
    const op = opTable[+opCode.slice(opCode.length - 2, opCode.length)];
    const paramTypes = new Array(argTable[op]).fill(0);
    for (let i = 0; i < paramTypes.length && opCode.length - 3 - i >= 0; i++) {
        paramTypes[i] = +opCode[opCode.length - 3 - i];
    }
    const args = new Array(argTable[op]).fill(0);
    for (let i = 0; i < args.length; i++) {
        args[i] = data[i + ip + 1];
    }
    op(...paramTypes.map(x => modeTable[x]), ...args);
    ip += args.length + 1;
};

const execute = () => {
    data = [...baseData];
    ip = 0;
    inputs = [1];
    inPtr = 0;
    output = [];

    try {
        while (ip < data.length) {
            performInstruction();
        }
    }
    catch(e) {
        if (e == 0) {
            console.log(output.toString());
        }
        else {
            throw e;
        }
    }
}

execute();