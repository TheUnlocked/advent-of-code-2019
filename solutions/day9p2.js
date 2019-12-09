const fs = require('fs');
const input = fs.readFileSync('inputs/day9.txt').toString();

const baseData = input.split(',').map(x => +x);

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

    execute = inputs => {
        this.data = new Array(this.data.length).fill(0).map((_, i) => i < baseData.length ? baseData[i] : 0);
        this.ip = 0;
        this.inputs = inputs;
        this.inPtr = 0;
        this.relativeBase = 0;
        this.output = [];

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

const cpu = new IntCodeComputer(10000);
try {
    cpu.execute([2]);
}
catch (e) {
    console.log(cpu.output);    
}