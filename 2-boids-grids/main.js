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
        // create a boids controller with the given boundary [2000, 600, 2000]
        // subdivide the world in to 10*10*10 cubes by passing subDivisionCount as 10
        // this will reduce the time spent for finding nearby entities
        this.boidsController = new BoidsController(2000, 600, 2000, 10);

        // create renderer and pass boidsController to render entities
        this.simpleRenderer = new SimpleRenderer({boidsController: this.boidsController});
        this.simpleRenderer.init();

        // create control helper for example controls
        this.controlHelper = new ControlHelper(this.boidsController, this.simpleRenderer);
        this.controlHelper.init();

        // add initial entities for an interesting view
        this.controlHelper.addBoids(this.flockEntityCount);
        this.controlHelper.addObstacles(this.obstacleEntityCount);
        
        // request the first animation frame
        window.requestAnimationFrame(this.render.bind(this));
    }

    render() {
        window.requestAnimationFrame(this.render.bind(this));
    
        // call statBegin() to measure time that is spend in BoidsController
        this.controlHelper.statBegin();
        
        // calculate boids entities
        this.boidsController.iterate();

        // update screen by rendering
        this.simpleRenderer.render();
        
        // call statEnd() to finalize measuring time
        this.controlHelper.statEnd();
    }

}

// create the application when the document is ready
document.addEventListener('DOMContentLoaded', (new Application()).init());
