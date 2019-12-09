const fs = require('fs');

const args = process.argv.slice(2);
const input = fs.readFileSync(args[1]).toString();

const modeTable = {
    REF: 0,
    IMM: 1,
    REL: 2
}

const modeDisasTable = {
    0: '@${v}',
    1: '${v}',
    2: '@(s${+v >= 0 ? "+" : ""}${v})'
}

const opTable = {
    1: 'add',
    2: 'mul',
    3: 'read',
    4: 'out',
    5: 'jmpt',
    6: 'jmpf',
    7: 'less',
    8: 'eq',
    9: 'shft',
    99: 'halt'
}
const opTableReverse = Object.fromEntries(Object.entries(opTable).map(x => x.reverse()));

const argTable = {
    1: 3,
    2: 3,
    3: 1,
    4: 1,
    5: 2,
    6: 2,
    7: 3,
    8: 3,
    9: 1,
    99: 0
}

const disasOpcode = opcode => {
    const op = +opcode.slice(opcode.length - 2, opcode.length);
    const modes = new Array(argTable[op] || 0).fill(0);
    for (let i = 0; i < modes.length && opcode.length - 3 - i >= 0; i++) {
        modes[i] = +opcode[opcode.length - 3 - i];
    }

    return [op, modes];
}

const disas = as => {
    const codes = as.split(',');
    const output = [];
    for (let i = 0; i < codes.length; i++) {
        const opData = disasOpcode(codes[i]);
        const opOutput = [];
        for (let j = 0; j < opData[1].length; j++) {
            const v = codes[++i];
            opOutput.push(eval('`' + modeDisasTable[opData[1][j]] + '`'));
        }
        let opName = opTable[opData[0]];
        if (opName === undefined) {
            opName = `[${String(opData[0])}]`;
        }
        if (opOutput.length === 3) {
            output.push([opName.toUpperCase(), ...opOutput.slice(opOutput.length - 1), ...opOutput.slice(0, opOutput.length - 1)]);
        }
        else {
            output.push([opName.toUpperCase(), ...opOutput]);
        }
    }
    return output;
}

const disasToString = disas => {
    const padding = [];
    for (let i = 0; i < 4; i++) {
        padding.push(disas.map(x => x[i] === undefined ? 0 : x[i].length).sort((a, b) => b-a)[0] + 3);
    }
    return disas.map(x => x.reduce((current, next, i) => current + next.padEnd(padding[i]), "")).join('\n');
}


const parseAssemblyArg = arg => {
    if (arg.startsWith('@')) {
        const relMatch = /@\(s((?:\+|-)\d*)\)/.exec(arg);
        if (relMatch) {
            return [String(+relMatch[1]), modeTable.REL];
        }
        return [arg.slice(1), modeTable.REF];
    }
    return [arg, modeTable.IMM];
}

const assembleInstruction = line => {
    const cols = [...line.matchAll(/\S+/g)].map(x => x[0]).filter(x => x.length > 0);
    if (cols.length === 0) {
        return [];
    }
    const plainData = /\[(\d*)\]/.exec(cols[0]);
    if (plainData) {
        return [plainData[1]];
    }

    let args = cols.slice(1).map(parseAssemblyArg);
    if (args.length === 3) {
        args = [...args.slice(1), ...args.slice(0,1)];
    }

    const baseOpcode = opTableReverse[cols[0].toLowerCase()].toString().padStart(2, '0');
    if (args.length > 0) {
        const fullOpcode = String(+(args.map(x => x[1].toString()).reduce((current, next) => next + current) + baseOpcode));
        return [fullOpcode, args.map(x => x[0])];
    }
    return [baseOpcode]
}

const assemble = asm => {
    const lines = asm.split('\n').filter(x => /\S/.test(x));
    const codes = lines.map(assembleInstruction).reduce((current, next) => current.concat(next));
    return codes.join(',');
}

switch (args[0]) {
    case 'disas':
        process.stdout.write(disasToString(disas(input)));
        break
    case 'as':
        process.stdout.write(assemble(input));
        break;
}