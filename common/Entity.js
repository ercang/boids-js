let idCounter = 0;

export default class Entity {
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
        this.mesh = undefined;

        this.FLOCK_ENTITY = 1;
        this.OBSTACLE_ENTITY = 1;
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

        nx = Math.max(0, nx);
        nx = Math.min(bx, nx);
        ny = Math.max(0, ny);
        ny = Math.min(by, ny);
        nz = Math.max(0, nz);
        nz = Math.min(bz, nz);
        
        this.grid.moveEntity(this, nx, ny, nz);
    }

    getDistance(otherEntity) {
        const dx = this.x - otherEntity.x;
        const dy = this.y - otherEntity.y;
        const dz = this.z - otherEntity.z;
        return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));
    }

    serialize() {
        const {id, type, x, y, z, vx, vy, vz} = this;
        return {
            id, type, x, y, z, vx, vy, vz
        }
    }

    updateData(data) {
        if(this.id == data.id) {
            this.vx = data.vx;
            this.vy = data.vy;
            this.vz = data.vz;
            this.grid.moveEntity(this, data.x, data.y, data.z);
        }
    }

    static deserialize(data) {
        const e = new Entity(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz);
        e.id = data.id;
        return e;
    }
}