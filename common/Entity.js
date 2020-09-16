let idCounter = 0;

export default class Entity {
    constructor(x=0, y=0, z=0, vx=0, vy=0, vz=0) {
        this.id = ++idCounter;
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
    }

    getVelocity() {
        return Math.sqrt((this.vx*this.vx)+(this.vy*this.vy)+(this.vz*this.vz));
    }

    checkVelocity(maxVelocity = 1) {
        const velocity = this.getVelocity();
        if(velocity > maxVelocity) {
            this.vx = maxVelocity*this.vx/velocity;
            this.vy = maxVelocity*this.vy/velocity;
            this.vz = maxVelocity*this.vz/velocity;
        }
    }

    addVelocity(vx, vy, vz) {
        this.vx += vx;
        this.vy += vy;
        this.vz += vz;
    }

    move(maxVelocity, bx, by, bz) {
        this.checkVelocity(maxVelocity);

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if(this.x < 0) {
            this.x = 0;
            this.vx = -this.vx;
        } else if(this.x > bx) {
            this.x = bx;
            this.vx = -this.vx;
        }

        if(this.y < 0) {
            this.y = 0;
            this.vy = -this.vy;
        } else if(this.y > by) {
            this.y = by;
            this.vy = -this.vy;
        }

        if(this.z < 0) {
            this.z = 0;
            this.vz = -this.vz;
        } else if(this.z > bz) {
            this.z = bz;
            this.vz = -this.vz;
        }
    }

    getDistance(otherEntity) {
        const dx = this.x - otherEntity.x;
        const dy = this.y - otherEntity.y;
        const dz = this.z - otherEntity.z;
        return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));
    }
}