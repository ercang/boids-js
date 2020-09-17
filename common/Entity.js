let idCounter = 0;

export default class Entity {
    static FLOCK_ENTITY = 1;
    static OBSTACLE_ENTITY = 2;

    constructor(type, x=0, y=0, z=0, vx=0, vy=0, vz=0) {
        this.id = ++idCounter;
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
        this.grid = undefined;
    }

    setGrid(grid) {
        this.grid = grid;
    }

    getType() {
        return this.type;
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

        let nx = this.x + this.vx;
        let ny = this.y + this.vy;
        let nz = this.z + this.vz;

        if(nx < 0) {
            nx = 0;
            this.vx = -this.vx;
        } else if(nx > bx) {
            nx = bx;
            this.vx = -this.vx;
        }

        if(ny < 0) {
            ny = 0;
            this.vy = -this.vy;
        } else if(ny > by) {
            ny = by;
            this.vy = -this.vy;
        }

        if(nz < 0) {
            nz = 0;
            this.vz = -this.vz;
        } else if(nz > bz) {
            nz = bz;
            this.vz = -this.vz;
        }

        // TODO: update grid
        this.grid.moveEntity(this, nx, ny, nz);
    }

    getDistance(otherEntity) {
        const dx = this.x - otherEntity.x;
        const dy = this.y - otherEntity.y;
        const dz = this.z - otherEntity.z;
        return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));
    }
}