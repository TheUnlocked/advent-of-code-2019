const fs = require('fs');
const input = fs.readFileSync('inputs/day8.txt').toString();

const width = 25;
const height = 6;

const decode = (width, height, data) => {
    const layers = [];

    for (let i = 0; i < data.length; i += width * height) {
        const layer = [];
        for (let y = 0; y < width; y++) {
            const row = [];
            for (let x = 0; x < height; x++) {
                row.push(data[i + x + y * width]);
            }
            layer.push(row);
        }
        layers.push(layer);
    }

    return layers;
}

const getNumInLayer = (layer, char) => layer.reduce((current, next) => current + next.filter(x => x == char).length, 0);

const layer = decode(25, 6, input).sort((a, b) => getNumInLayer(a, '0') - getNumInLayer(b, '0'))[0];

console.log(getNumInLayer(layer, '1') * getNumInLayer(layer, '2'));