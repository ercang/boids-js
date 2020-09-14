export default class Entity {
    constructor(x=0, y=0, z=0, vx=0, vy=0, vz=0) {
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

    normalizeVelocity(maxVelocity = 1) {
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
        this.normalizeVelocity(maxVelocity);

        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        this.x = this.x < 0 ? bx : this.x;
        this.x = this.x > bx ? 0 : this.x;
        this.y = this.y < 0 ? by : this.y;
        this.y = this.y > by ? 0 : this.y;
        this.z = this.z < 0 ? bz : this.z;
        this.z = this.z > bz ? 0 : this.z;
    }

    getDistance(otherEntity) {
        const dx = this.x - otherEntity.x;
        const dy = this.y - otherEntity.y;
        const dz = this.z - otherEntity.z;
        return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));
    }
}