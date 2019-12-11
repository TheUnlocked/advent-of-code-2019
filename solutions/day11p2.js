const fs = require('fs');
const input = fs.readFileSync('inputs/day11.txt').toString();

class IntCodeComputer {
    data;
    ip;
    inputs;
    inPtr;
    output;
    relativeBase;

    constructor(size) {
        this.data = new Array(size).fill(0);
    }

    throwTable = {
        HALT: 0,
        NO_IP_INC: 1,
        PAUSE: 2
    };

    addr = ref => this.data[ref];
    relAddr = ref => this.data[ref + this.relativeBase];
    imm = v => v;

    refAdjust = (ref, mode) => ref + (mode === this.relAddr ? this.relativeBase : 0);

    add = (p1, p2, p3, a, b, ref) => this.data[this.refAdjust(ref, p3)] = p1(a) + p2(b);
    mul = (p1, p2, p3, a, b, ref) => this.data[this.refAdjust(ref, p3)] = p1(a) * p2(b);
    read = (p1, ref) => {
        if (this.inputs.length > this.inPtr) {
            this.data[this.refAdjust(ref, p1)] = this.inputs[this.inPtr++];
        }
        else {
            throw this.throwTable.PAUSE;
        }
    };
    out = (p1, v) => this.output.push(p1(v));
    halt = () => { throw this.throwTable.HALT; }

    jmpt = (p1, p2, a, b) => {
        if (p1(a) != 0) {
            this.ip = p2(b);
            throw this.throwTable.NO_IP_INC;
        }
    }
    jmpf = (p1, p2, a, b) => {
        if (p1(a) == 0) {
            this.ip = p2(b);
            throw this.throwTable.NO_IP_INC;
        }
    }
    lt = (p1, p2, p3, a, b, ref) => this.data[this.refAdjust(ref, p3)] = p1(a) < p2(b) ? 1 : 0;
    eq = (p1, p2, p3, a, b, ref) => this.data[this.refAdjust(ref, p3)] = p1(a) == p2(b) ? 1 : 0;

    shftRel = (p1, a) => this.relativeBase += p1(a);

    modeTable = {
        0: this.addr,
        1: this.imm,
        2: this.relAddr
    }

    argTable = {
        [this.add]: 3,
        [this.mul]: 3,
        [this.read]: 1,
        [this.out]: 1,
        [this.jmpt]: 2,
        [this.jmpf]: 2,
        [this.lt]: 3,
        [this.eq]: 3,
        [this.shftRel]: 1,
        [this.halt]: 0
    }

    opTable = {
        1: this.add,
        2: this.mul,
        3: this.read,
        4: this.out,
        5: this.jmpt,
        6: this.jmpf,
        7: this.lt,
        8: this.eq,
        9: this.shftRel,
        99: this.halt
    }

    performInstruction = () => {
        const opCode = `${this.data[this.ip]}`;
        const op = this.opTable[+opCode.slice(opCode.length - 2, opCode.length)];
        const paramTypes = new Array(this.argTable[op]).fill(0);
        for (let i = 0; i < paramTypes.length && opCode.length - 3 - i >= 0; i++) {
            paramTypes[i] = +opCode[opCode.length - 3 - i];
        }
        const args = new Array(this.argTable[op]).fill(0);
        for (let i = 0; i < args.length; i++) {
            args[i] = this.data[i + this.ip + 1];
        }

        try {
            op(...paramTypes.map(x => this.modeTable[x]), ...args);
        }
        catch (e) {
            switch(e) {
                case this.throwTable.NO_IP_INC:
                    return;
                default:
                    throw e;
            }
        }
        this.ip += args.length + 1;
    };

    execute = (data, inputs) => {
        this.data = new Array(this.data.length).fill(0).map((_, i) => i < data.length ? data[i] : 0);
        this.ip = 0;
        this.inputs = inputs;
        this.inPtr = 0;
        this.relativeBase = 0;
        const output = []
        this.output = output;

        this.continue();
    }

    continue = () => {
        try {
            while (this.ip < this.data.length) {
                this.performInstruction();
            }
        }
        catch(e) {
            if (e == this.throwTable.HALT) {
                throw this.throwTable.HALT;
            }
            else if (e == this.throwTable.PAUSE) {

            }
            else {
                throw e;
            }
        }
    }
}

let map = new Array(88).fill(0).map(x => new Array(10).fill(1));
const getMapPos = pos => map[pos[0] + (map.length / 2)][pos[1] + (map[0].length / 2)];
const setMapPos = (pos, v) => map[pos[0] + (map.length / 2)][pos[1] + (map[0].length / 2)] = v;

const cpu = new IntCodeComputer(10000);
cpu.execute(input.split(',').map(x => +x), []);

const cwTable = {
    '01': [1, 0],
    '10': [0, -1],
    '0-1': [-1, 0],
    '-10': [0, 1]
}

const ccwTable = {
    '01': [-1, 0],
    '-10': [0, -1],
    '0-1': [1, 0],
    '10': [0, 1]
}

let botPos = [0, 0];
let botDirection = [0, 1];

try {
    while (true) {
        cpu.inputs.push(getMapPos(botPos));
        cpu.continue();
        setMapPos(botPos, +cpu.output[cpu.output.length - 2]);
        if (cpu.output[cpu.output.length - 1] == 0) {
            botDirection = ccwTable[botDirection.join("")];
        }
        else {
            botDirection = cwTable[botDirection.join("")];
        }
        botPos = [botPos[0] + botDirection[0], botPos[1] + botDirection[1]];
    }
}
catch (e) {
    if (e == cpu.throwTable.HALT) {
    }
    else {
        throw e;
    }
}

const printTable = {
    1: '⬛',
    0: ' '
}

map = map[0].map((col, i) => map.map(row => row[i]));
console.log(map.map(x => x.map(x => printTable[x]).slice(45, map[0].length - 4).join(' ')).reverse().slice(4).join('\n'));