export default class BoidsWorkerPlanner {
    constructor(boidsController, updateCallback, workerCount = 4) {
        this.boidsController = boidsController;
        this.updateCallback = updateCallback;
        this.workerCount = workerCount;
        this.workers = [];
        this.workerCompletedCount = 0;
        for(let i=0; i<this.workerCount; i++) {
            this.workers.push(new Worker("../common/BoidsWorker.js", {type: "module"}));
        }

        this.workers.forEach((worker, index) => {
            worker.onmessage = this.onWorkerMessageReceived.bind(this, index);
        });
    }

    init() {
        this.sendInitialData();
    }

    sendInitialData() {
        // copy boids controller state to web worker
        const data = this.boidsController.serialize();
        this.workers.forEach(worker => {
            worker.postMessage({action: "initialData", data});
        });
    }

    requestIterate() {
        if(this.workerCompletedCount != 0) {
            console.log("Previous request must be completed first!")
            return;
        }

        const config = {
            aligmentWeight: this.boidsController.aligmentWeight,
            cohesionWeight: this.boidsController.cohesionWeight,
            separationWeight: this.boidsController.separationWeight,
            maxEntitySpeed: this.boidsController.maxEntitySpeed,
        };

        const len = this.boidsController.getFlockEntities().length;
        const increaseAmount = Math.round(len/this.workerCount);
        this.workers.forEach((worker, index) => {
            const start = index*increaseAmount;
            const end = (index == this.workerCount-1) ? len : (index+1)*increaseAmount - 1;
            worker.postMessage({action: "iterate", start, end, config});
        });
    }

    onWorkerMessageReceived(index, e) {
        if(e.data.action == 'iterateCompleted') {
            this.boidsController.applyBoidsData(e.data.data);
            this.workers.forEach((worker, wIndex) => {
                if(index != wIndex) {
                    // send this update to other workers
                    worker.postMessage({action: "updateBoidsData", data: e.data.data});
                }
            });

            this.workerCompletedCount++;
            if(this.workerCompletedCount == this.workerCount) {
                this.workerCompletedCount = 0;
                this.updateCallback();
            }
        }
    }
}