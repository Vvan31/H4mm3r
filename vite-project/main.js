import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'

let scene, camera, renderer; 
scene = new THREE.Scene();
const loader = new GLTFLoader();
let shark_mixer = await loadModel(loader, "media/hammerhead.glb", 3.8, 0, 0, 0, 0, -65,-10,-10,-10, 'Action', 1);
let ray_mixer = await loadModel(loader, "media/manta.glb", 3.8, 0, 0, 30, 0, -65,-1,-1,-1, 'swim', 2);
let water_mixer = await loadModel(loader, "media/water_animation.glb", 0.8, 0, 0, 0, 0, -63,4,8,5 , 'Take 001', 3);

function main(){
  createScene();
  addLights();
  animate();
}
function createScene(){
  // Scene: The scene is where all the 3D objects will be displayed.
  /* scene = new THREE.Scene(); */

  // Camera:  The camera determines what part of the scene is visible.
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Render: The renderer is responsible for rendering the scene and displaying it on the screen.
  const canvas = document.querySelector('.webgl');
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Controlls. 
/*   const controls = new OrbitControls( camera, renderer.domElement );
  controls.update(); */

  document.body.appendChild(renderer.domElement);
}

function addLights(){
  const light = new THREE.AmbientLight( 0xffffff ); // soft white light
  light.position.set(0,0,0);
  light.intensity = 5;
  scene.add( light ); 
  
  const dirLight = new THREE.DirectionalLight( 0xffffff , 0.5);
  dirLight.position.set( 75, 5, -60 );
  scene.add( dirLight );
}

 async function loadModel(loader, path, rot_x, rot_y, rot_z, pos_x, pos_y, pos_z, sc1,sc2, sc3, name, id){
  let model = await loader.loadAsync(path);
  model.scene.rotation.x = rot_x;
  model.scene.rotation.y = rot_y;
  model.scene.rotation.z = rot_z;
  model.scene.position.x = pos_x;
  model.scene.position.y = pos_y;
  model.scene.position.z = pos_z;
  model.scene.scale.set(sc1, sc2, sc3); 
  // animation mixers
  const mixer = animateModel(model, name);
  scene.add(model.scene);
  if (id == 3) {
    changeWaterMesh(model);
  } else if(id == 2){
    createControlls(model);
  }
  return mixer; 
}

function animateModel(model, actionName){
  const mixer = new THREE.AnimationMixer( model.scene );
  const clips = model.animations;
  const clip = THREE.AnimationClip.findByName( clips, actionName);
  const action = mixer.clipAction( clip );
  action.play(); 
  return mixer;
}
function changeWaterMesh(water){
  let meshes = water.parser.associations.keys();
  for (let i = 0; i <= 15; i++) {
    const material = meshes.next().value;
    if (material) {
      material['transparent']  = true;
      material['opacity']  = 0.3;
      material['metalness']  = 0;
      material['color'] = (47,79,79);
    }
  }
}

function createControlls(model){
  //Controlls. 
  let lastKey = 0;
  document.onkeydown = function (e) {
    // w - 87, s - 83, a - 65, d - 68. 
    let key = e.keyCode;
    if ( key !== lastKey) {
      
      console.log("Not same keys");
      if (e.keyCode == 87) {
        model.scene.rotation.z = 180;
        model.scene.rotation.x = Math.PI*(1/2);
        model.scene.rotation.y = 0;
      } else if(e.keyCode == 83) {
        model.scene.rotation.z = 0;
        model.scene.rotation.x = Math.PI*(3/2);
        model.scene.rotation.y = 0;

      }else if(e.keyCode == 65) {
        model.scene.rotation.z = 260;
       model.scene.rotation.x = Math.PI*(1/1);
        /*  model.scene.rotation.y = Math.PI; */
      }else if(e.keyCode == 68) {
       model.scene.rotation.x = Math.PI*(1/8);
       model.scene.rotation.z = 90; 
   /*      model.scene.rotation.x = Math.PI; */
      /*   model.scene.rotation.y = 10; */
      } 
    }
    if (key == 87) {
      model.scene.position.y += 1;
      lastKey = key;
    } else if(key == 83) {
      model.scene.position.y -= 1;
      lastKey = key;
    }else if(key == 65) {
      model.scene.position.x -= 1;
      lastKey = key;
    }else if(key == 68) {
      model.scene.position.x += 1;
      lastKey = key;
    }
  }
}
//Render the scene: This will display the 3D object on the screen.
function animate() {
   // animate model
   shark_mixer.update( 0.015 );
   ray_mixer.update( 0.015 );
   water_mixer.update( 0.0005 ); 
  
  requestAnimationFrame(animate);
  renderer.setClearColor( 0xffffff, 0);
  renderer.render(scene, camera);
}




main();
/* animate(); */