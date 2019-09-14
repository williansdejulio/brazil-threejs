const CX = 0;
const CY = 0;
const CZ = -800;
const BRAZIL = MATRIX_BRAZIL_UPPER_LEFT_AXIS;

var scene, renderer, camera, controls;
var sec, min, timer, scalePlane;
matrixMesh = [30];
arrFonts = [188];

function animate() {
    controls.update();
    renderer.render(scene, camera);

    if (scalePlane) {
    	//scaleAllPlanes();
    }

    requestAnimationFrame(animate);
}

function scaleAllPlanes() {
    for (let x = 0; x < 30; x++) {
		for (let y = 0; y < 30; y++) {
			if (matrixMesh[x] != undefined) {
				if (matrixMesh[x][y] != undefined) {
					var object = matrixMesh[x][y];

                	var pos = (BRAZIL[x][y]);
                    var size = 55 * pos - 5;
                    object.geometry.translate(-size / 2, -size / 2, 0);
					object.scale.set(object.scale.x * 0.9, object.scale.y * 0.9, object.scale.z * 0.9,);
				}
			}
		}
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadPictures() {

	pickPhoto = 0;

    var pickFont = 0;
	var monitor = new THREE.LoadingManager();

	monitor.onLoad = function () {
		// fazer algo quando todas imagens carregar
	}

    for (let i = 0; i < arrFonts.length; i++) {
        scene.remove(arrFonts[i]);
    }

    for (let x = 0; x < 30; x++) {
        for (let y = 0; y < 30; y++) {
            if (matrixMesh[x] != undefined) {
                if (matrixMesh[x][y] != undefined) {
                    scene.remove(matrixMesh[x][y]);
                }
            }
        }
    }

    for (var x = 0; x < 30; x++) {
        matrixMesh[x] = [];

        for (var y = 0; y < 30; y++) {
            var pos = (BRAZIL[x][y]);
            if (pos != 0) {
                var material = new THREE.MeshLambertMaterial({
                    color: 0x16B83E,
                    side: THREE.DoubleSide
                });
                var size = 55 * pos - 5;

                var plane = new THREE.BoxGeometry(size, size, 50);
                plane.translate(size / 2, -size / 2, 0);

                var mesh = new THREE.Mesh(plane, material);
                mesh.applyMatrix(new THREE.Matrix4().makeTranslation(-size / 2, -size / 2, 0));
                var offSetX = x - 15;
                var offSetY = y - 15;

                mesh.castShadow = true;

                mesh.position.set(CY + (offSetY * 55), CX - (offSetX * 55), CZ);
                scene.add(mesh);
                matrixMesh[x][y] = mesh;
            }
        }
    }
}

function init() {
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
    renderer.setClearColor(0xffffff);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;

    window.addEventListener('resize', onWindowResize, false);
    scene = new THREE.Scene();

    scene.background = new THREE.Color().setHSL(0.61, 0.6, 0.7);
    //scene.fog = new THREE.Fog(scene.background, 0.1, 18000);                           // VOLTAR FOG

	scalePlane = false;
	loadPictures();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.x = -301;
    camera.position.z = 1157;

    // LIGHTS
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.65, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 0, 0.5);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 20);
    scene.add( hemiLightHelper );

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.5, 1, 0.8);
    dirLight.position.set(0.3, 0.5, 1);
    dirLight.position.multiplyScalar(300);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 5000;
    dirLight.shadow.mapSize.height = 5000;

    var d = 2000;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = -d;
    dirLight.shadow.camera.bottom = d;

    dirLight.shadow.camera.far = 8000;
    dirLight.shadow.bias = -0.0001;

    dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10)
    scene.add( dirLightHeper );

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);                        // VOLTAR PARA: 40000, 40000
    var groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });

    groundMat.color.setHSL(0, 0, 0.05);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1200;
    scene.add(ground);

    ground.receiveShadow = true;

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    //controls.minDistance = 80;
    //controls.maxDistance = 4000;
    controls.enableDamping = true;
    //controls.minPolarAngle = Math.PI * 0.1; // 0 = MINIMO
    //controls.maxPolarAngle = Math.PI * 0.9; // Math.PI = MAXIMO
    
    controls.target = new THREE.Vector3(CX, CY, CZ);

}
