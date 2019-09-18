
import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
  
export default class SceneBase extends React.Component {
  
  constructor() {
    super();

    this.startAnimationLoop = this.startAnimationLoop.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
  }

  sceneSetup() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      45, // field of view
      width / height, // ratio
      0.1, // min near plane
      100000 // max far plane
    );

    this.camera.position.z = 5; // default distance from object that is normally located at z = 0
    this.controls = new OrbitControls(this.camera, this.el);
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement);
  }

  componentDidMount() {
    this.sceneSetup();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    
    this.controls.dispose();
  }

  startAnimationLoop() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize() {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };

  render() {
    return <div ref={ref => (this.el = ref)} />;
  }
}
