import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene, camera, renderer; 
scene = new THREE.Scene();
const loader = new GLTFLoader();
let shark_mixer = await loadModel(loader, "media/hammerhead.glb", 3.8, 0, 0, 0, 0, -65,-10,-10,-10, 'Action', false);
let ray_mixer = await loadModel(loader, "media/manta.glb", 3.8, 0, 0, 30, 0, -65,-1,-1,-1, 'swim', false);
let water_mixer = await loadModel(loader, "media/water_animation.glb", 0.8, 0, 0, 0, 0, -63,4,8,5 , 'Take 001', true);

function main(){
  createScene();
  addLights();
/*   changeWaterMesh(); */
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

 async function loadModel(loader, path, rot_x, rot_y, rot_z, pos_x, pos_y, pos_z, sc1,sc2, sc3, name, change){
  let model = await loader.loadAsync(path);
  model.scene.rotation.x = rot_x;
  model.scene.rotation.y = rot_y;
  model.scene.rotation.z = rot_z;
  model.scene.position.x = pos_x;
  model.scene.position.y = pos_y;
  model.scene.position.z = pos_z;
  model.scene.scale.set(sc1, sc2, sc3); 
  console.log(model);
  // animation mixers
  const mixer = animateModel(model, name);
  scene.add(model.scene);
  if (change) {
    changeWaterMesh(model);
  }
  return model, mixer; 
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
  console.log(water);
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