# Boids JS


[01 - Boids Example](/1-boids-simple/)  
This example show how to run boids simulation in browser thread. It uses ThreeJS for rendering.

[02 - Boids with Grid Support](/2-boids-grids/)  
This example shows how to use grid support for fast lookups. Originally boids algorithm checks near-by entities for calculation and this can be optimized by placing entities in buckets (or grids)

[03 - Boids with WebWorker Support](/3-boids-webworkers/)  
This example shows how to use WebWorkers for boids calculations. Currently it uses 4 webworkers, FPS meter shows the boids calculation. Actual browser thread is not doing much, so it is exapected to stay at 60FPS.

