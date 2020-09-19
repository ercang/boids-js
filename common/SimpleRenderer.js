export default class SimpleRenderer {
    constructor({boidsController}) {
        this.boidsController = boidsController;
        this.isDragging = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.degX = 45;
        this.degY = 60;
        const b = this.boidsController.getBoundary();
        this.cameraMax = Math.max(b[0], b[1], b[2]);
        this.cameraRadius = this.cameraMax*2/3;
        this.lockOn = false;
    }

    init() {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100000 );
        this.camera.position.z = 0;
     
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xffffff );
     
        this.entityGeometry = new THREE.BoxGeometry( 5, 5, 15 );
        this.obstacleGeometry = new THREE.SphereGeometry( 50, 15, 15 );
        this.entityMaterial = new THREE.MeshNormalMaterial();
        this.obstacleMaterial = new THREE.MeshNormalMaterial();

        this.createGridVisual(this.boidsController.subDivisionCount);

        // create boundary
        const b = this.boidsController.getBoundary();
        const geometry = new THREE.BoxGeometry(b[0], b[1], b[2]);
        const wireframe = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color = new THREE.Color( 0x000000 );
        line.material.transparent = false;
        line.position.x = b[0]/2;
        line.position.y = b[1]/2;
        line.position.z = b[2]/2;
        this.scene.add(line);
     
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));

        this.updateCamera();
        this.render();
    }

    createGridVisual(subdivisionCount) {
        this.gridVisual = new THREE.Group();
        const b = this.boidsController.getBoundary();
        const maxLen = Math.max(b[0], b[1], b[2]);
        const len = maxLen/subdivisionCount;
        for(let x=0; x<subdivisionCount; x++) {
            for(let y=0; y<subdivisionCount; y++) {
                for(let z=0; z<subdivisionCount; z++) {
                    if((x+0.5)*len > b[0] || (y+0.5)*len > b[1] || (z+0.5)*len > b[2]) {
                        continue;
                    }

                    // create boundary wireframe
                    const geometry = new THREE.BoxGeometry(len, len, len);
                    const wireframe = new THREE.EdgesGeometry(geometry);
                    const line = new THREE.LineSegments(wireframe);
                    //line.material.depthTest = false;
                    line.material.color = new THREE.Color( 0x999999 );
                    line.material.transparent = false;
                    line.position.x = len/2 + x*len;
                    line.position.y = len/2 + y*len;
                    line.position.z = len/2 + z*len;
                    //this.scene.add(line);
                    this.gridVisual.add(line);
                }
            }
        }

        this.scene.add(this.gridVisual);
        this.gridVisual.visible = false;
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
        if(this.degX > 360) this.degX = 0;
        if(this.degX < 0) this.degX = 360;

        this.degY += dy/3;
        this.degY = Math.max(0.1, this.degY);
        this.degY = Math.min(179.9, this.degY);
        
        this.updateCamera();
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    onMouseWheel(e) {
        e.preventDefault();
        this.cameraRadius += e.deltaY * -1;
        this.cameraRadius = Math.max(1, this.cameraRadius);
        this.cameraRadius = Math.min(this.cameraMax, this.cameraRadius);
        this.updateCamera();
    }

    updateCamera() {
        let mx=0, my=0, mz=0;
        const entities = this.boidsController.getFlockEntities();
        if(this.lockOn && entities.length > 0) {
            const mesh = entities[0].mesh;
            mx = mesh.position.x;
            my = mesh.position.y;
            mz = mesh.position.z;
        } else {
            const b = this.boidsController.getBoundary();
            mx = b[0]/2;
            my = b[1]/2;
            mz = b[2]/2;
        }

        const degXPI = this.degX*Math.PI/180;
        const degYPI = this.degY*Math.PI/180;
        this.camera.position.x = mx + Math.sin(degXPI)*Math.sin(degYPI)*this.cameraRadius;
        this.camera.position.z = mz + Math.cos(degXPI)*Math.sin(degYPI)*this.cameraRadius;
        this.camera.position.y = my + Math.cos(degYPI)*this.cameraRadius;

        this.camera.lookAt(mx, my, mz);
    }

    render() {
        const entities = this.boidsController.getFlockEntities();
        entities.forEach(entity => {
            const x = entity.x;
            const y = entity.y;
            const z = entity.z;
            const vx = entity.vx;
            const vy = entity.vy;
            const vz = entity.vz;
            let mesh = entity.mesh;
            if(!mesh) {
                mesh = new THREE.Mesh(this.entityGeometry, this.entityMaterial);
                mesh.localVelocity = {x: 0, y: 0, z: 0};
                this.scene.add(mesh);
                entity.mesh = mesh;
            }

            // apply asymptotic smoothing
            mesh.position.x = 0.9*mesh.position.x + 0.1*x;
            mesh.position.y = 0.9*mesh.position.y + 0.1*y;
            mesh.position.z = 0.9*mesh.position.z + 0.1*z;
            mesh.localVelocity.x = 0.9*mesh.localVelocity.x + 0.1*vx;
            mesh.localVelocity.y = 0.9*mesh.localVelocity.y + 0.1*vy;
            mesh.localVelocity.z = 0.9*mesh.localVelocity.z + 0.1*vz;

            mesh.lookAt(mesh.position.x + mesh.localVelocity.x,
                        mesh.position.y + mesh.localVelocity.y,
                        mesh.position.z + mesh.localVelocity.z);
        });

        const obstacles = this.boidsController.getObstacleEntities();
        obstacles.forEach(entity => {
            const x = entity.x;
            const y = entity.y;
            const z = entity.z;
            let mesh = entity.mesh;
            if(!mesh) {
                mesh = new THREE.Mesh(this.obstacleGeometry, this.obstacleMaterial);
                this.scene.add(mesh);
                entity.mesh = mesh;
            }
            
            mesh.position.x = x;
            mesh.position.y = y;
            mesh.position.z = z;
        });

        if(this.lockOn && entities.length > 0) {
            this.updateCamera();
        }

        this.renderer.render(this.scene, this.camera);
    }
}