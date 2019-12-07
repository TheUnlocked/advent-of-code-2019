const fs = require('fs');
const input = fs.readFileSync('inputs/day7.txt').toString();

const baseData = input.split(',').map(x => +x);

class IntCodeComputer {
    data;
    ip;
    inputs;
    inPtr;
    output;

    throwTable = {
        HALT: 0,
        NO_IP_INC: 1,
        PAUSE: 2
    };

    addr = ref => this.data[ref];
    imm = v => v;

    add = (p1, p2, _, a, b, ref) => this.data[ref] = p1(a) + p2(b);
    mul = (p1, p2, _, a, b, ref) => this.data[ref] = p1(a) * p2(b);
    read = (_, ref) => {
        if (this.inputs.length > this.inPtr) {
            this.data[ref] = this.inputs[this.inPtr++];
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
    lt = (p1, p2, _, a, b, ref) => this.data[ref] = p1(a) < p2(b) ? 1 : 0;
    eq = (p1, p2, _, a, b, ref) => this.data[ref] = p1(a) == p2(b) ? 1 : 0;

    modeTable = {
        0: this.addr,
        1: this.imm
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

    execute = phase => {
        this.data = [...baseData];
        this.ip = 0;
        this.inputs = [phase];
        this.inPtr = 0;
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

const results = [];
for (const permutation of getPermutations([5,6,7,8,9])) {
    let amplifiers, result;
    try {
        amplifiers = [new IntCodeComputer(), new IntCodeComputer(), new IntCodeComputer(), new IntCodeComputer(), new IntCodeComputer()];
        for (let i = 0; i < amplifiers.length; i++) {
            amplifiers[i].execute(permutation[i]);
        }
        result = 0;

        while (true) {
            for (const amplifier of amplifiers) {
                amplifier.inputs.push(result);
                try {
                    amplifier.continue();
                }
                catch (e) {
                    if (e == amplifier.throwTable.HALT) {
                        if (amplifier === amplifiers[4]) {
                            throw e;
                        }
                    }
                    else {
                        throw e;
                    }
                }
                result = amplifier.output[amplifier.output.length - 1];
            }
        }
    }
    catch (e) {
        if (e == amplifiers[0].throwTable.HALT) {
            results.push(amplifiers[4].output[amplifiers[4].output.length - 1]);
        }
        else {
            throw e;
        }
    }
}
console.log(results.sort((a, b) => b-a)[0]);