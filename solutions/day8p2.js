const fs = require('fs');
const input = fs.readFileSync('inputs/day8.txt').toString();

const width = 25;
const height = 6;

const parse = (width, height, data) => {
    const layers = [];

    for (let i = 0; i < data.length; i += width * height) {
        const layer = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(data[i + x + y * width]);
            }
            layer.push(row);
        }
        layers.push(layer);
    }

    return layers;
}

const getBitmapImage = (width, height, layers) => {
    const image = new Array(height).fill(0).map(_ => new Array(width).fill(2));
    for (let i = layers.length - 1; i >= 0; i--) {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                switch (layers[i][y][x]) {
                    case '0':
                        image[y][x] = 0;
                        break;
                    case '1':
                        image[y][x] = 1;
                }
            }
        }
    }
    return image;
}

const image = getBitmapImage(width, height, parse(width, height, input));

console.log(image.map(x => x.join(' ')).join("\n"))