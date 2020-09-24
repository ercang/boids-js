# Boids JS

BoidsJS is an implementation of the boids algorithm. This can be used for simulation flock behavior such as birds or fish in 3D space.

There are three examples provided for similar scenes but three examples differ in performance. 
- The first example run in the browser thread and it should slow down when there are many number of entities. 
- The seconds example also runs in the browser thread but it uses the grid implementation for fast lookups. This example should handle more entities in the browser thread.
- In the third example calculation is done in 4 parallel WebWorker threads. Rendering is still done in the browser thread. Even though the simulation slows down, the renderer should work in 60fps.

## Examples

[01 - Boids Example](https://ercang.github.io/boids-js/1-boids-simple/)  
This example show how to run boids simulation in browser thread. It uses ThreeJS for rendering.

[02 - Boids with Grid Support](https://ercang.github.io/boids-js/2-boids-grids/)  
This example shows how to use grid support for fast lookups. Originally boids algorithm checks near-by entities for calculation and this can be optimized by placing entities in buckets (or grids)

[03 - Boids with WebWorker Support](https://ercang.github.io/boids-js/3-boids-webworkers/)  
This example shows how to use WebWorkers for boids calculations. Currently it uses 4 webworkers, FPS meter shows the boids calculation. Actual browser thread is not doing much, so it is exapected to stay at 60FPS.

