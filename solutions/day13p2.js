const fs = require('fs');
const input = fs.readFileSync('inputs/day13.txt').toString();

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

class Map {
    constructor() {
        this.data = [];
        this.segmentDisplay = 0;
    }

    setTile(x, y, type) {
        const colLen = this.data.length == 0 ? 0 : this.data[0].length;
        if (this.data.length < x + 1) {
            this.data.push(...new Array(x + 1 - this.data.length).fill(0).map(_ => new Array(colLen).fill(0)));
        }
        if (this.data[0].length < y + 1) {
            this.data.forEach(x => x.push(...new Array(y + 1 - colLen).fill(0)));
        }
        this.data[x][y] = type;
    }
    render() {
        const renderTable = {
            [tileTable.EMPTY]: " ",
            [tileTable.BLOCK]: "⬜",
            [tileTable.WALL]: "⬛",
            [tileTable.PADDLE]: "🎞️",
            [tileTable.BALL]: "⚪"
        };
        let output = "";
        for (let x = 0; x < this.data[0].length; x++) {
            for (let y = 0; y < this.data.length; y++) {
                output += renderTable[this.data[y][x]] + " ";
            }
            output += '\n';
        }
        process.stdout.write(output);
    }
}

const renderMap = (map, data) => {
    for (let i = 0; i < data.length; i += 3) {
        if (data[i] == -1 && data[i+1] == 0) {
            map.segmentDisplay = data[i+2];
        }
        else {
            map.setTile(data[i], data[i+1], data[i+2]);
        }
    }
}

const tileTable = {
    EMPTY: 0,
    WALL: 1,
    BLOCK: 2,
    PADDLE: 3,
    BALL: 4
}

const cpu = new IntCodeComputer(10000);
const map = new Map();

try {
    const inputData = input.split(',').map(Number);
    inputData[0] = 2;
    cpu.execute(inputData, []);
    renderMap(map, cpu.output);
    const paddleY = map.data[map.data.findIndex(x => x.includes(tileTable.PADDLE))].indexOf(tileTable.PADDLE);
    while (true) {
        cpu.output = [];
        const paddleX = map.data.findIndex(x => x[paddleY] == tileTable.PADDLE);
        const ballX = map.data.findIndex(x => x.includes(tileTable.BALL));
        if (paddleX < ballX) cpu.inputs.push(1);
        else if (paddleX > ballX) cpu.inputs.push(-1);
        else cpu.inputs.push(0);
        cpu.continue();
        renderMap(map, cpu.output);
        console.clear();
        map.render();
    }
}
catch(e) {
    if (e == cpu.throwTable.HALT) {
        renderMap(map, cpu.output);
        console.clear();
        map.render();
    }
    else {
        throw e;
    }
}

console.log(map.segmentDisplay);