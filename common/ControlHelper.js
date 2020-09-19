import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js'
import Entity from './Entity.js'

let stats = undefined;

export default class ControlHelper {
    constructor(boidsController, renderer, workerPlanner) {
        this.boidsController = boidsController;
        this.renderer = renderer;
        this.workerPlanner = workerPlanner;
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
        gui.add(this.renderer.gridVisual, 'visible').name('Show Grid');
        gui.add(this.renderer, 'lockOn').name('Lock Camera');
        this.boidsButton = gui.add(this, 'addBoids');
        this.obstacleButton = gui.add(this, 'addObstacles');
        
        this.updateButtonLabels();
    }

    statBegin() {
        this.stats.begin();
    }

    statEnd() {
        this.stats.end();
    }

    addBoids(count=50) {
        const boundary = this.boidsController.getBoundary();
        for(let i=0; i<count; i++) {
            const x = Math.floor(Math.random() * boundary[0]);
            const y = Math.floor(Math.random() * boundary[1]);
            const z = Math.floor(Math.random() * boundary[2]);
            const vx = (Math.random() * 4) - 2;
            const vy = (Math.random() * 4) - 2;
            const vz = (Math.random() * 4) - 2;
            
            const entity = new Entity(Entity.FLOCK_ENTITY, x, y, z, vx, vy, vz);
            this.boidsController.addFlockEntity(entity);
        }

        if(this.workerPlanner) {
            this.workerPlanner.sendInitialData();
        }

        this.updateButtonLabels();
    }

    addObstacles(obstacleCount = 5) {
        const boundary = this.boidsController.getBoundary();
        for(let i=0; i<obstacleCount; i++) {
            const x = Math.floor(Math.random() * boundary[0]);
            const y = Math.floor(Math.random() * boundary[1]);
            const z = Math.floor(Math.random() * boundary[2]);
            
            const entity = new Entity(Entity.OBSTACLE_ENTITY, x, y, z);
            this.boidsController.addObstacleEntity(entity);
        }

        if(this.workerPlanner) {
            this.workerPlanner.sendInitialData();
        }

        this.updateButtonLabels();
    }

    updateButtonLabels() {
        this.boidsButton.name('Add Boids (' + this.boidsController.getFlockEntities().length + ')');
        this.obstacleButton.name('Add Obs (' + this.boidsController.getObstacleEntities().length + ')');
    }
}