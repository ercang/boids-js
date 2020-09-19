import BoidsController from '../common/BoidsController.js'
import SimpleRenderer from '../common/SimpleRenderer.js'
import ControlHelper from '../common/ControlHelper.js'
import BoidsWorkerPlanner from './BoidsWorkerPlanner.js'


class Application {
    constructor() {
        this.flockEntityCount = 1000;
        this.obstacleEntityCount = 100;
        this.simpleRenderer = undefined;
        this.boidsController = undefined;
        this.controlHelper = undefined;

        this.workerPlanner = undefined;

        this.iterateRequested = false;
    }

    init() {
        this.boidsController = new BoidsController(2000, 600, 2000, 10);

        // init renderer
        this.simpleRenderer = new SimpleRenderer({boidsController: this.boidsController});
        this.simpleRenderer.init();

        // create worker planner
        this.workerPlanner = new BoidsWorkerPlanner(this.boidsController, this.onWorkerUpdate.bind(this));
        this.workerPlanner.init();

        this.controlHelper = new ControlHelper(this.boidsController, this.simpleRenderer, this.workerPlanner);
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

        if(!this.iterateRequested) {
            this.workerPlanner.requestIterate();
            this.iterateRequested = true;
        }

        this.simpleRenderer.render();
    }

    onWorkerUpdate() {
        this.controlHelper.statEnd();
        this.iterateRequested = false;
    }

}

document.addEventListener('DOMContentLoaded', (new Application()).init());
