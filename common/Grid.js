
/**
 * @module Grid 
 * Grid class creates cubic grid for spatial partitioning.
 * This helps lookups to be performed faster for nearby entities.
 * More information can be found here:
 * http://gameprogrammingpatterns.com/spatial-partition.html
 */
export default class Grid {
    /**
     * Constructor for the Grid class. Grids can be only be a cube. It takes cellSize as a parameter
     * @param {Number} worldSize total world size in units. eg. 1000 
     * @param {Number} cellSize cell size to divide the world into. eg. 20.
     */
    constructor(worldSize, cellSize) {
        this.worldSize = worldSize;
        this.cellSize = cellSize;
        this.cellRowCount = (this.worldSize / this.cellSize)|0;
        
        this.cellCount = this.cellRowCount*this.cellRowCount*this.cellRowCount;
        this.entityList = [];
        for(let i=0; i<this.cellCount; i++) {
            this.entityList[i] = [];
        }
    }

    /**
     * @returns {Number} world size
     */
    getWorldSize() {
        return this.worldSize;
    };

    /**
     * @returns {Number} grid count in a row
     */
    getGridRowCount() {
        return this.cellRowCount;
    };

    /**
     * Calculate the grid index for the given x,y,z position
     * @param {*} x x position of the entity
     * @param {*} y y position of the entity
     * @param {*} z z position of the entity
     * @returns {Number} index of the cell for the given point
     */
    getGridIndex(x, y, z) {
        let cellX = (x / this.cellSize)|0;
        let cellY = (y / this.cellSize)|0;
        let cellZ = (z / this.cellSize)|0;

        if(cellX < 0) {
            cellX = 0;
        } else if(cellX > this.cellRowCount-1) {
            cellX = this.cellRowCount-1;
        }

        if(cellY < 0) {
            cellY = 0;
        } else if(cellY > this.cellRowCount-1) {
            cellY = this.cellRowCount-1;
        }

        if(cellZ < 0) {
            cellZ = 0;
        } else if(cellZ > this.cellRowCount-1) {
            cellZ = this.cellRowCount-1;
        }

        let index = cellX + cellY*this.cellRowCount + cellZ*this.cellRowCount*this.cellRowCount;
        return index|0;
    };

    /**
     * Adds the entity to the correspoding grid
     * @param {Object} entity 
     */
    addEntity(entity) {
        const index = this.getGridIndex(entity.x, entity.y, entity.z)|0;
        entity.setGrid(this);
        this.entityList[index].push(entity);
    };

    /**
     * Removes the entity from the correspoding grid
     * @param {Object} entity 
     */
    removeEntity(entity) {
        const index = this.getGridIndex(entity.x, entity.y, entity.z)|0;
        const gridEntities = this.entityList[index];
        const entityIndex = gridEntities.indexOf(entity);
        if(entityIndex == -1)
        {
            // serious error!
            throw("removeEntity() can not find the entity to be removed!");
            return;
        }
        else
        {
            gridEntities.splice(entityIndex, 1);
            entity.setGrid(undefined);
        }
    };

    /**
     * Moves the entity. Checks the new grid index, if the given position
     * requires entitiy move from cell to cell, it handles that transition.
     * @param {Object} entity entitiy object
     * @param {Number} newX new x position
     * @param {Number} newY new y position
     * @param {Number} newZ new z position
     */
    moveEntity(entity, newX, newY, newZ) {
        const oldIndex = this.getGridIndex(entity.x, entity.y, entity.z)|0;
        const newIndex = this.getGridIndex(newX, newY, newZ)|0;

        if(oldIndex == newIndex) {
            entity.x = newX;
            entity.y = newY;
            entity.z = newZ;
            // no need to update
            return;
        }

        // remove from the old grid list
        const gridEntities = this.entityList[oldIndex];
        const entityIndex = gridEntities.indexOf(entity);
        if(entityIndex == -1)
        {
            // serious error!
            throw("moveEntity() can not find the entity to be removed!");
            return;
        }
        else
        {
            gridEntities.splice(entityIndex, 1);
        }

        // add to the new grid list
        entity.x = newX;
        entity.y = newY;
        entity.z = newZ;
        this.entityList[newIndex].push(entity);
    };

    /**
     * Finds the corresponding grid for the given x,y,z position and
     * returns the entities in that grid.
     * @param {Number} x x position to find a cell
     * @param {Number} y y position to find a cell
     * @param {Number} z z position to find a cell
     * @returns {Array} entity list for that grid
     */
    getEntitiesInGrid(x, y, z) {
        const index = this.getGridIndex(x, y, z)|0;
        return this.entityList[index];
    };

    /**
     * Returns the entities in the grid with the given index
     * @param {Number} index 
     * @returns {Array} entity list for that grid
     */
    getEntitiesInGridIndex(index) {
        if(index < 0 || index >= this.cellCount)
        {
            throw("getEntitiesInGridIndex() out of bounds!");
        }

        return this.entityList[index|0];
    };

    /**
     * This method finds the entities in the cube that is defined with an origin position and a size.
     * The callback is executed for every entity that is found in the cube.
     * @param {Number} originX x position for the cube
     * @param {Number} originY y position for the cube
     * @param {Number} originZ z position for the cube
     * @param {Number} size size of the cube
     * @param {Function} callback callback is executed for every entity that is found in the cube
     */
    getEntitiesInCube(originX, originY, originZ, size, callback) {
        const start = this.getGridIndex(originX - size, originY - size, originZ - size); // top left
        const topEnd = this.getGridIndex(originX + size, originY - size, originZ - size); // top right
        const bottomStart = this.getGridIndex(originX - size, originY + size, originZ - size); // bottom left
        const backStart = this.getGridIndex(originX + size, originY + size, originZ + size); // back left

        const index = start;
        const width = topEnd - start + 1;
        const height = (((bottomStart - start)/this.cellRowCount) + 1)|0;
        const depth = (((backStart - start)/(this.cellRowCount*this.cellRowCount)) + 1)|0;
        for(let d=0; d<depth; d++) {
            for(let h=0; h<height; h++) {
                for(let w=0; w<width; w++) {
                    const currentIndex = index + (d*this.cellRowCount*this.cellRowCount) + (h*this.cellRowCount) + w;
                    if(currentIndex >= this.cellCount) {
                        continue;
                    }

                    const currentItems = this.entityList[currentIndex];
                    const curLen = currentItems.length;
                    for(let i=0; i<curLen; i++) {
                        const item = currentItems[i]
                        if(item !== undefined &&
                        item.x >= originX - size && item.x <= originX + size &&
                        item.y >= originY - size && item.y <= originY + size && 
                        item.z >= originZ - size && item.z <= originZ + size)
                        {
                            callback(item);
                        }
                    }
                }
            }
        }
    };
}
