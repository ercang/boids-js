import BoidsController from './BoidsController.js'

class BoidsWorker {
  constructor() {
    this.boidsController = undefined;
  }

  initializeBoidsController(data) {
    this.boidsController = BoidsController.deserialize(data);
  }
  
  iterateBoidsController(start, end, config) {
    this.boidsController.aligmentWeight = config.aligmentWeight;
    this.boidsController.cohesionWeight = config.cohesionWeight;
    this.boidsController.separationWeight = config.separationWeight;
    this.boidsController.maxEntitySpeed = config.maxEntitySpeed;
  
    this.boidsController.iterate(start, end);
    const data = this.boidsController.serializeBoidsData(start, end);
    postMessage({action: 'iterateCompleted', data})
  }
  
  updateBoidsData(data) {
    this.boidsController.applyBoidsData(data);
  }

  onMessage(e) {
    if(e.data.action == 'initialData') {
      this.initializeBoidsController(e.data.data)
    } else if(e.data.action == 'iterate') {
      this.iterateBoidsController(e.data.start, e.data.end, e.data.config);
    } else if(e.data.action = 'updateBoidsData') {
      this.updateBoidsData(e.data.data)
    }
  }
}

// create instance
const worker = new BoidsWorker();
onmessage = worker.onMessage.bind(worker);
