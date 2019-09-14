const CX = 0;
const CY = 0;
const CZ = -800;
const BRAZIL = MATRIX_BRAZIL;

var scene, renderer, camera, controls;
var sec, min, timer, scalePlane;
matrixMesh = [30];
arrFonts = [188];

var startTimer = function() { 
	setTimeout(function() {

		$("#timer").text("05:00");
		min = 4;
		sec = 59;

		clearInterval(timer);
		timer = setInterval(function(){
			if (sec < 10) sec = "0" + sec;
			if (min < 10) 
				$("#timer").text("0" + min + ":" + sec);
			else
				$("#timer").text("0" + min + ":" + sec);

			if (sec == 0 && min == 0) {
				clearInterval(timer);

				loadPictures();
			}

			sec--;

			if (sec == -1) {
				min--;
				sec = 59;
			}
			
		}, 1000);

	},5000);
}

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
                    color: 0x0000ff,
                    side: THREE.DoubleSide
                });
                var size = 55 * pos - 5;

                var plane = new THREE.BoxGeometry(size, size, 50);
                plane.translate(size / 2, -size / 2, 0);	// mudar pivô para superior esquerdo. o padrão é o centro

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

    startTimer();
}

function renderRandomPhoto() {
/*
    window.setInterval(function() {
    	var pos, x, y;

    	do {
    		x = Math.floor(Math.random() * 30);
    		y = Math.floor(Math.random() * 30);
    		pos = (BRAZIL[x][y]);

    	} while (pos == 0);

    	$.get("/api/fotos?qtde=1", function(photo){
        	var urlPhoto = photo.thumbnail;
    	    var texture = new THREE.TextureLoader().load(urlPhoto);

	        //texture.minFilter = THREE.LinearFilter;
    	    material = new THREE.MeshLambertMaterial({
    	        map : texture,
    	        side: THREE.DoubleSide
    	    });

    		var size = 55 * pos - 5; 

    		var mesh = matrixMesh[x][y];

    	    mesh.material = material;
    	    mesh.material.needsUpdate = true;
    	    matrixMesh[x][y] = mesh;
    	});

    }, 5000);
*/
}

function init() {
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
    renderer.setClearColor(0xffffff);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.shadowMapEnabled = true;
    //renderer.shadowMapSoft = true;

    window.addEventListener('resize', onWindowResize, false);
    scene = new THREE.Scene();

    scene.background = new THREE.Color().setHSL(0.61, 1, 0.9);
    scene.fog = new THREE.Fog(scene.background, 0.5, 18000);

	scalePlane = false;
	loadPictures();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
    camera.position.x = -301;
    camera.position.z = 1157; // INITIAL: (0, 200, 1000)

    // LIGHTS
    var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.65, 0, 0.6);
    hemiLight.groundColor.setHSL(0.095, 0, 0.5);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 20);
    scene.add( hemiLightHelper );

    dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.5, 1, 0.8);
    dirLight.position.set(0, 0.5, 1);
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
    var groundGeo = new THREE.PlaneBufferGeometry(40000, 40000);
    var groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });

    groundMat.color.setHSL(0, 0, 0.05);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1200;
    scene.add(ground);

    ground.receiveShadow = true;

    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    controls.minDistance = 80;
    controls.maxDistance = 4000;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI * 0.1; // 0 = MINIMO
    controls.maxPolarAngle = Math.PI * 0.9; // Math.PI = MAXIMO
    
    controls.target = new THREE.Vector3(CX, CY, CZ);

}
