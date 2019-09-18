import * as THREE from "three";

import SceneBase from "../SceneBase";
  
export default class CubeTest extends SceneBase {

  addCustomSceneObjects() {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  startAnimationLoop() {
    super.startAnimationLoop();

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }

  componentDidMount() {
    super.componentDidMount();
    this.addCustomSceneObjects();

    super.startAnimationLoop();
  }

}
