let idCounter = 0;

/**
 * @module Entity 
 * Entity class defines an entitiy model which has a position and a velocity.
 * Also it has some utiliy methods.
 */
export default class Entity {
    /**
     * Constructor for the Entity class
     * @param {Number} type entitiy type that defines it as flock or obstacle entitiy 
     * @param {Number} x x position
     * @param {Number} y y position
     * @param {Number} z z position
     * @param {Number} vx x velocity
     * @param {Number} vy y velocity
     * @param {Number} vz z velocity
     */
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

    /**
     * Sets the grid instance
     * @param {Grid} grid 
     */
    setGrid(grid) {
        this.grid = grid;
    }

    /**
     * @returns {Number} type of the entity
     */
    getType() {
        return this.type;
    }

    /**
     * @returns {Number} the current scalar velocity of the entity.
     */
    getVelocity() {
        return Math.sqrt((this.vx*this.vx)+(this.vy*this.vy)+(this.vz*this.vz));
    }

    /**
     * Checks the velocity of the entitiy and limits it to the given parameter
     * @param {Number} maxVelocity 
     */
    checkVelocity(maxVelocity = 1) {
        const velocity = this.getVelocity();
        if(velocity > maxVelocity) {
            this.vx = maxVelocity*this.vx/velocity;
            this.vy = maxVelocity*this.vy/velocity;
            this.vz = maxVelocity*this.vz/velocity;
        }
    }

    /**
     * This method adds the given velocity to the current velocity.
     * @param {Number} vx x velocity
     * @param {Number} vy y velocity
     * @param {Number} vz z velocity
     */
    addVelocity(vx, vy, vz) {
        this.vx += vx;
        this.vy += vy;
        this.vz += vz;
    }

    /**
     * This method moves the entity.
     * @param {Number} maxVelocity 
     * @param {Number} bx 
     * @param {Number} by 
     * @param {Number} bz 
     */
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

    /**
     * Calculate the distance between the entity and the given entity
     * @param {Entity} otherEntity 
     * @returns {Number} the distance between two entities
     */
    getDistance(otherEntity) {
        const dx = this.x - otherEntity.x;
        const dy = this.y - otherEntity.y;
        const dz = this.z - otherEntity.z;
        return Math.sqrt((dx*dx)+(dy*dy)+(dz*dz));
    }

    /**
     * Serialized the entitiy
     * @returns {Object} serialized data
     */
    serialize() {
        const {id, type, x, y, z, vx, vy, vz} = this;
        return {
            id, type, x, y, z, vx, vy, vz
        }
    }

    /**
     * Updates the internal data of the entity if the IDs match
     * @param {Object} data 
     */
    updateData(data) {
        if(this.id == data.id) {
            this.vx = data.vx;
            this.vy = data.vy;
            this.vz = data.vz;
            this.grid.moveEntity(this, data.x, data.y, data.z);
        }
    }

    /**
     * This static method deserializes the given data and returns new Entity instance.
     * @param {Object} data 
     * @returns {Entitiy} deserialized Entitiy instance
     */
    static deserialize(data) {
        const e = new Entity(data.type, data.x, data.y, data.z, data.vx, data.vy, data.vz);
        e.id = data.id;
        return e;
    }
}