const fs = require('fs');
const input = fs.readFileSync('inputs/day12.txt').toString();

const parseVector = str => eval(`({${str.slice(1, str.length - 1)}})`.replace(/=/g, ':'));
const makeVec = (x, y, z) => ({x, y, z});

const positions = input.split('\n');

class Moon {
    constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.z += this.velocity.z;
    }

    applyGravityFromMoons(otherMoons) {
        for (const moon of otherMoons) {
            this.applyGravity(moon);
        }
    }

    applyGravity(other) {
        if (other.position.x > this.position.x) this.velocity.x++;
        else if (other.position.x < this.position.x) this.velocity.x--;
        if (other.position.y > this.position.y) this.velocity.y++;
        else if (other.position.y < this.position.y) this.velocity.y--;
        if (other.position.z > this.position.z) this.velocity.z++;
        else if (other.position.z < this.position.z) this.velocity.z--;
    }

    addVelocity(other) {
        this.velocity.x += other.x;
        this.velocity.y += other.y;
        this.velocity.z += other.z;
    }

    get potential() {
        return Math.abs(this.position.x) + Math.abs(this.position.y) + Math.abs(this.position.z);
    }

    get kinetic() {
        return Math.abs(this.velocity.x) + Math.abs(this.velocity.y) + Math.abs(this.velocity.z);
    }

    get energy() { 
        return this.potential * this.kinetic;
    }
}

const gcd = (a, b) => {
    while (true) {     
        if (a == b) {
            return a;
        }
        else if (a > b) {
            a = a - b;
        }
        else {
            b = b - a;
        }
    }
}
const lcm = (a, b) => a * b / gcd(a, b);
const lcm3 = (a, b, c) => lcm(lcm(a, b), c);

// This is horribly slow on my data.
// O(n) array indexes definitely don't help. xP
// Ideally a hash-based structure would be used.
const findWrapOnAxis = axis => {
    const moons = positions.map(x => new Moon(parseVector(x), makeVec(0,0,0)));
    const prev = [];
    while (true) {
        prev.push(moons.map(x => "" + x.position[axis] + x.velocity[axis]).reduce((current, next) => current + next));
        moons.forEach(x => x.applyGravityFromMoons(moons));
        moons.forEach(x => x.move());
        if (prev.includes(moons.map(x => "" + x.position[axis] + x.velocity[axis]).reduce((current, next) => current + next))) {
            break;
        }
        if (prev.length % 30000 == 0) {
            console.log("Still crunching numbers...");
        }
    }
    console.log("Got a value!");
    return prev.length;
}

console.log(lcm3(findWrapOnAxis('x'), findWrapOnAxis('y'), findWrapOnAxis('z')));