# Boids JS

BoidsJS is an implementation of the boids algorithm. This can be used for simulation flock behavior such as birds or fish in 3D space.

There are three examples provided for similar scenes but three examples differ in performance. 
- The first example run in the browser thread and it should slow down when there are many number of entities. 
- The second example also runs in the browser thread but it uses the grid implementation for fast lookups. This example should handle more entities in the browser thread.
- In the third example, calculation is done in 4 parallel WebWorker threads. The rendering is still done in the browser thread. Even though the simulation slows down, the UI should be updated in 60fps.

## Examples

[01 - Boids Example](https://ercang.github.io/boids-js/1-boids-simple/)  
This example show how to run boids simulation in browser thread. It uses ThreeJS for rendering.

[02 - Boids with Grid Support](https://ercang.github.io/boids-js/2-boids-grids/)  
This example shows how to use grid support for fast lookups. Originally boids algorithm checks near-by entities for calculation and this can be optimized by placing entities in buckets (or grids)

[03 - Boids with WebWorker Support](https://ercang.github.io/boids-js/3-boids-webworkers/) [Chrome Only]  
This example shows how to use WebWorkers for boids calculations. Currently it uses 4 webworkers, FPS meter shows the boids calculation. Actual browser thread is not doing much, so it is exapected to stay at 60FPS.

**A Note About WebWorkers and Chrome:** Webworker example only works with chrome, because Safari and Firefox does not support import statements in WebWorkers. This is usually not a problem, because using a script packer (eg. Webpack) should overcome this problem. In order to keep the examples simple, a script packet was not used.

# Class Overview
 **BoidsController** class defines a container for boids entities. All entities (flock or obstalces) are added to BoidsController. BoidsController calculates and updates entity positions and velocities.
 
 **BoidsWorker** is the wrapper for BoidsController to make it work inside a WebWorker context. The responsibility of this class is to create a new BoidsController instance with the received data and run the requested iterations in this isolated context.

**BoidsWorkerPlanner** is a class to help creating multiple workers and distributing the work to these separate workers. It also deals with synchronization of the data among workers and the application 

**Entity** class defines an entitiy model which has a position and a velocity. Also it has some utiliy methods.

**Grid** class creates cubic grid for spatial partitioning. This helps lookups to be performed faster for nearby entities. More information can be found here: http://gameprogrammingpatterns.com/spatial-partition.html