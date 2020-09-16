import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js'
import Entity from './Entity.js'

let stats = undefined;

export default class ControlHelper {
    constructor(boidsController) {
        this.boidsController = boidsController;
    }

    init() {
        // init stats
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);

        const gui = new dat.GUI();
        gui.add(this.boidsController, 'aligmentWeight',0,5).name('Alignment');
        gui.add(this.boidsController, 'cohesionWeight',0,5).name('Cohesion');
        gui.add(this.boidsController, 'separationWeight',0,5).name('Separation');
        gui.add(this.boidsController, 'maxEntitySpeed',1,10).name('Max Speed');
        gui.add(this, 'addBoids').name('Add 20 Boids');
        gui.add(this, 'addObstacles').name('Add 5 Obstacles');
    }

    statBegin() {
        this.stats.begin();
    }

    statEnd() {
        this.stats.end();
    }

    addBoids(count=20) {
        const boundary = this.boidsController.getBoundary();
        for(let i=0; i<count; i++) {
            const x = Math.floor(Math.random() * boundary[0]);
            const y = Math.floor(Math.random() * boundary[1]);
            const z = Math.floor(Math.random() * boundary[2]);
            const vx = (Math.random() * 4) - 2;
            const vy = (Math.random() * 4) - 2;
            const vz = (Math.random() * 4) - 2;
            
            const entity = new Entity(x, y, z, vx, vy, vz);
            this.boidsController.addFlockEntity(entity);
        }
    }

    addObstacles(obstacleCount = 5) {
        const boundary = this.boidsController.getBoundary();
        for(let i=0; i<obstacleCount; i++) {
            const x = Math.floor(Math.random() * boundary[0]);
            const y = Math.floor(Math.random() * boundary[1]);
            const z = Math.floor(Math.random() * boundary[2]);
            
            const entity = new Entity(x, y, z);
            this.boidsController.addObstacleEntity(entity);
        }
    }
}