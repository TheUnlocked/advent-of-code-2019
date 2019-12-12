const fs = require('fs');
const input = fs.readFileSync('inputs/day12.txt').toString();

const parseVector = str => eval(`({${str.slice(1, str.length - 1)}})`.replace(/=/g, ':'));
const makeVec = (x, y, z) => ({x, y, z});

const positions = input.split('\n').map(parseVector);

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

const moons = positions.map(x => new Moon(x, makeVec(0,0,0)));

for (let i = 0; i < 1000; i++) {
    moons.forEach(x => x.applyGravityFromMoons(moons));
    moons.forEach(x => x.move());
}

console.log(moons.reduce((current, next) => current + next.energy, 0));