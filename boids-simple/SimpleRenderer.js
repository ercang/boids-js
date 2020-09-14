export default class SimpleRenderer {
    constructor(boidsController) {
        this.boidsController = boidsController;

        this.isDragging = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.degX = 0;
        this.degY = 0;
    }

    init() {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10000 );
        this.camera.position.z = 0;
     
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
     
        this.geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
        this.geometry2 = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
        this.material = new THREE.MeshNormalMaterial();
        this.material2 = new THREE.MeshPhongMaterial({
            color: 0xFF0000,    // red (can also use a CSS color string here)
            flatShading: true,
          });
     
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.drawAnimationFrame();

        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    }

    onMouseMove(e) {
        if(!this.isDragging) {
            return;
        }
    
        const dx = e.offsetX - this.mouseX;
        const dy = e.offsetY - this.mouseY;

        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    
        this.degX += dx;
        this.degY += dy;
    
        this.camera.position.x = Math.sin(this.degX/20)*2;
        this.camera.position.z = Math.cos(this.degX/20)*2;
    
        this.camera.position.y = Math.cos(this.degY/20)*2;
        this.camera.lookAt( 0, 0, 0 );
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    drawAnimationFrame() {
        window.requestAnimationFrame(this.drawAnimationFrame.bind(this));

        const entities = this.boidsController.getFlockEntities();
        entities.forEach(entity => {
            const x = entity.x/250 -1;
            const y = entity.y/250 -1;
            const z = entity.z/250 -1;
            const vx = (entity.vx/250 -1)*Math.PI*100;
            const vy = (entity.vy/250 -1)*Math.PI*100;
            const vz = (entity.vz/250 -1)*Math.PI*100;
            if(entity.mesh == undefined) {
                const m = new THREE.Mesh(this.geometry, this.material);
                this.scene.add( m );
                entity.mesh = m;
            }

            entity.mesh.position.x = x;
            entity.mesh.position.y = y;
            entity.mesh.position.z = -z;

            // find direction
            entity.mesh.rotation.x = vx;
            entity.mesh.rotation.y = vy;
            entity.mesh.rotation.z = vz;
        });

        const obstacles = this.boidsController.getObstacleEntities();
        obstacles.forEach(entity => {
            const x = entity.x/250 -1;
            const y = entity.y/250 -1;
            const z = entity.z/250 -1;
            if(entity.mesh == undefined) {
                const m = new THREE.Mesh(this.geometry2, this.material2);
                this.scene.add( m );
                entity.mesh = m;
            }

            entity.mesh.position.x = x;
            entity.mesh.position.y = y;
            entity.mesh.position.z = -z;
        })
        
        // iterate
        this.boidsController.iterate();

        this.renderer.render(this.scene, this.camera);
    }
}