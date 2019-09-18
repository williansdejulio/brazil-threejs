import * as THREE from "three";

import SceneBase from "../SceneBase";
import * as BrazilConstants from "./constants/BrazilConstants";
  
export default class BrazilMap extends SceneBase {

  // FIXME: fix scope
  matrixMesh = [30];
  CX = 0;
  CY = 0;
  CZ = -800;

  drawBrazil() {
    for (var x = 0; x < 30; x++) {
      this.matrixMesh[x] = [];

      for (var y = 0; y < 30; y++) {
        const pos = (BrazilConstants.MATRIX_BRAZIL[x][y]);
        if (pos !== 0) {
          const material = new THREE.MeshLambertMaterial({
              color: 0x16B83E,
              side: THREE.DoubleSide
          });
          const size = 55 * pos - 5;

          const plane = new THREE.BoxGeometry(size, size, 50);
          plane.translate(size / 2, -size / 2, 0);

          const mesh = new THREE.Mesh(plane, material);
          mesh.applyMatrix(new THREE.Matrix4().makeTranslation(-size / 2, -size / 2, 0));
          const offSetX = x - 15;
          const offSetY = y - 15;

          mesh.castShadow = true;

          mesh.position.set(this.CY + (offSetY * 55), this.CX - (offSetX * 55), this.CZ);
          this.scene.add(mesh);
          this.matrixMesh[x][y] = mesh;
        }
      }
    }
  }

  addCustomSceneObjects() {
    
    this.renderer.setClearColor(0xffffff);

    this.renderer.shadowMapEnabled = true;

    this.scene.background = new THREE.Color().setHSL(0.61, 0.6, 0.7);
    this.scene.fog = new THREE.Fog(this.scene.background, 0.1, 18000);

    this.drawBrazil();

    this.camera.position.x = -301;
    this.camera.position.z = 1157;

    // LIGHTS
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.65, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 0, 0.5);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 20);
    this.scene.add( hemiLightHelper );

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.5, 1, 0.8);
    dirLight.position.set(0.3, 0.5, 1);
    dirLight.position.multiplyScalar(300);
    this.scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 5000;
    dirLight.shadow.mapSize.height = 5000;

    const d = 2000;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = -d;
    dirLight.shadow.camera.bottom = d;

    dirLight.shadow.camera.far = 8000;
    dirLight.shadow.bias = -0.0001;

    const dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10)
    this.scene.add( dirLightHeper );

    // GROUND
    const groundGeo = new THREE.PlaneBufferGeometry(40000, 40000);
    const groundMat = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0x050505 });

    groundMat.color.setHSL(0, 0, 0.05);

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1200;
    this.scene.add(ground);

    ground.receiveShadow = true;

    this.controls.minDistance = 80;
    this.controls.maxDistance = 4000;
    this.controls.enableDamping = true;
    this.controls.minPolarAngle = Math.PI * 0.1; // 0 = MINIMO
    this.controls.maxPolarAngle = Math.PI * 0.9; // Math.PI = MAXIMO

    this.controls.keyPanSpeed = 1;
    this.controls.rotateSpeed = 0.1;

    this.controls.target = new THREE.Vector3(this.CX, this.CY, this.CZ);
  };

  startAnimationLoop() {
    super.startAnimationLoop();

    // Add animation HERE!
  }

  componentDidMount() {
    super.componentDidMount();

    this.addCustomSceneObjects();
    this.startAnimationLoop();
  }

}
