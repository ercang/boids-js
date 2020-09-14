import BoidsController from './BoidsController.js'
import Entity from './Entity.js'
import SimpleRenderer from './SimpleRenderer.js'

document.addEventListener('DOMContentLoaded', () => {
    const boidsController = new BoidsController();

    const boundary = boidsController.getBoundary();

    // add 50 flock entities
    for(let i=0; i<60; i++)
    {
        const rx = Math.floor(Math.random() * boundary[0]);
        const ry = Math.floor(Math.random() * boundary[1]);
        const rz = Math.floor(Math.random() * boundary[2]);
        const vx = (Math.random() * 4) - 2;
        const vy = (Math.random() * 4) - 2;
        const vz = (Math.random() * 4) - 2;
        
        const entity = new Entity(rx, ry, rz, vx, vy, vz);
        boidsController.addFlockEntity(entity);
    }

    // add 10 obstacles
    for(let i=0; i<10; i++)
    {
        const rx = Math.floor(Math.random() * boundary[0]);
        const ry = Math.floor(Math.random() * boundary[1]);
        const rz = Math.floor(Math.random() * boundary[2]);
        
        const entity = new Entity(rx, ry, rz);
        boidsController.addObstacleEntity(entity);
    }

    const simpleRenderer = new SimpleRenderer(boidsController);
    simpleRenderer.init();
});
