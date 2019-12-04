const fs = require('fs');
const input = fs.readFileSync('inputs/day1.txt').toString();

const getFuelCost = x => {
	let base = Math.floor(+x / 3) - 2;
	if (base <= 0) return 0;
	let addin = getFuelCost(base);
	return base + addin;
}

console.log(input.split('\n').filter(x=>!isNaN(+x)).map(x => getFuelCost(+x)).reduce((a,b) => a+b));