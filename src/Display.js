import React, { Component } from "react";
import axios from "axios";
import THREE from "./Three";
var c = 0;

class Display extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xyz: []
    };
    this.scene = null;
    this.camera = null;
    this.geometry = null;
  }

  async componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    // ADD SCENE
    this.scene = new THREE.Scene();

    // ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0,-15,5);
    this.camera.translateZ(10);

    // ADDING CONTROLS
    this.controls = new THREE.TrackballControls( this.camera );
    this.controls.rotateSpeed = 5.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3; 
    /* this.controls = new THREE.OrbitControls(this.camera);
    this.controls.update(); */
  
    // ADD PLANE GEOMETRY
    this.geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
    this.geometry.dynamic = true;
    const material = new THREE.MeshLambertMaterial({
      color: 0xff00ff,
      side: THREE.DoubleSide
    });
    this.plane = new THREE.Mesh(this.geometry, material);
    this.plane.position.x = 0;
    this.plane.position.y = 0;
    this.plane.position.z = 0;
    this.scene.add(this.plane);

    // ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setClearColor("white");
    this.mount.appendChild(this.renderer.domElement);

    // ADDING LIGHTS
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set( 4,4,6);
    this.scene.add(light);

    /* ADDING LIGHTS
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set( 0,0,100).normalize();
    this.scene.add(light);
    var helper = new THREE.DirectionalLightHelper( light, 5, 0xff00ff );
    this.scene.add( helper ); */
  
    /* ADDING LIGHTS
    const light = new THREE.SpotLight(0xffffff, 4.0, 6000);
    this.scene.add(light);
    this.scene.add(light.target)
    light.position.set(-200, 200, 200);	
    light.target = this.plane;*/

    /* ADDING GRIDS
    this.grid = new THREE.GridHelper(20, 1);
    this.grid.position.set(0,-5,0);
    this.scene.add(this.grid); */

    await this.fetchRecord();
    this.start();
  }

  fetchRecord = async () => {
    const xyz = await axios.post("http://localhost:3001/display");
    const len = xyz.data.length;

    console.log("Total Records: " + len);

    let i;
    for (i = 0; i < len; i++) {
      const x = Number(xyz.data[i].x);
      //console.log(x)
      const y = Number(xyz.data[i].y);
      //console.log(y)
      const z = Number(xyz.data[i].z);
      //console.log(z)
      this.geometry.vertices[i].z = z;
      c++;
    }
    console.log("Number of planes on screen: " + c);
    this.setState({ xyz: xyz.data });
  };

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    //requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    //this.renderer.render(this.scene, this.camera);

    /*return (
      <div align="left">
        {this.state.xyz.map((e, i) => (
          <div key={i}>
            x1={e.x} -- {e.y} -- {e.z}
          </div>
        ))}
      </div>
    );*/

    return (
      <div
        style={{ width: "800px", height: "700px" }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default Display;
