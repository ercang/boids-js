import BoidsController from '../common/BoidsController.js'
import SimpleRenderer from '../common/SimpleRenderer.js'
import ControlHelper from '../common/ControlHelper.js'


class Application {
    constructor() {
        this.flockEntityCount = 400;
        this.obstacleEntityCount = 50;
        this.simpleRenderer = undefined;
        this.boidsController = undefined;
        this.controlHelper = undefined;
    }

    init() {
        this.boidsController = new BoidsController(2000, 600, 2000);

        // init renderer
        this.simpleRenderer = new SimpleRenderer({boidsController: this.boidsController});
        this.simpleRenderer.init();

        this.controlHelper = new ControlHelper(this.boidsController, this.simpleRenderer);
        this.controlHelper.init();

        // add initial entities
        this.controlHelper.addBoids(this.flockEntityCount);
        this.controlHelper.addObstacles(this.obstacleEntityCount);
        
        // request frame
        window.requestAnimationFrame(this.render.bind(this));
    }

    render() {
        window.requestAnimationFrame(this.render.bind(this));
    
        this.controlHelper.statBegin();
        
        this.boidsController.iterate();
        this.simpleRenderer.render();
        
        this.controlHelper.statEnd();
    }

}

document.addEventListener('DOMContentLoaded', (new Application()).init());
