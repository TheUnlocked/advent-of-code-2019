const fs = require('fs');
const input = fs.readFileSync('inputs/day7.txt').toString();

const baseData = input.split(',').map(x => +x);

let data, ip, inputs, inPtr, output;

const throwTable = {
    HALT: 0,
    NO_IP_INC: 1
}

const addr = ref => data[ref];
const imm = v => v;

const add = (p1, p2, _, a, b, ref) => data[ref] = p1(a) + p2(b);
const mul = (p1, p2, _, a, b, ref) => data[ref] = p1(a) * p2(b);
const read = (_, ref) => data[ref] = inputs[inPtr++];
const out = (p1, v) => output.push(p1(v));
const halt = () => { throw throwTable.HALT; }

const jmpt = (p1, p2, a, b) => {
    if (p1(a) != 0) {
        ip = p2(b);
        throw throwTable.NO_IP_INC;
    }
}
const jmpf = (p1, p2, a, b) => {
    if (p1(a) == 0) {
        ip = p2(b);
        throw throwTable.NO_IP_INC;
    }
}
const lt = (p1, p2, _, a, b, ref) => data[ref] = p1(a) < p2(b) ? 1 : 0;
const eq = (p1, p2, _, a, b, ref) => data[ref] = p1(a) == p2(b) ? 1 : 0;

const modeTable = {
    0: addr,
    1: imm
}

const argTable = {
    [add]: 3,
    [mul]: 3,
    [read]: 1,
    [out]: 1,
    [jmpt]: 2,
    [jmpf]: 2,
    [lt]: 3,
    [eq]: 3,
    [halt]: 0
}

const opTable = {
    1: add,
    2: mul,
    3: read,
    4: out,
    5: jmpt,
    6: jmpf,
    7: lt,
    8: eq,
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

    try {
        op(...paramTypes.map(x => modeTable[x]), ...args);
    }
    catch (e) {
        switch(e) {
            case throwTable.NO_IP_INC:
                return;
            default:
                throw e;
        }
    }
    ip += args.length + 1;
};

const execute = config => {
    const amplify = (phase, input) => {
        data = [...baseData];
        ip = 0;
        inputs = [phase, input];
        inPtr = 0;
        output = [];

        try {
            while (ip < data.length) {
                performInstruction();
            }
        }
        catch(e) {
            if (e == throwTable.HALT) {
                // console.log(output.toString());
            }
            else {
                throw e;
            }
        }
    }
    let result = 0;
    for (const phase of config) {
        amplify(phase, result);
        result = output[0];
    }
    return result;
}

const getPermutations = arr => {
    if (arr.length == 1) {
        return [[arr[0]]];
    }
    const permutations = [];
    for (let i = 0; i < arr.length; i++) {
        permutations.push(...getPermutations([...arr.slice(0,i), ...arr.slice(i+1)]).map(x => [arr[i], ...x]));
    }
    return permutations;
}

const results = [];
for (const permutation of getPermutations([0,1,2,3,4])) {
    results.push(execute(permutation));
}
console.log(results.sort((a, b) => b-a)[0]);