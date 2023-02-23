import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Scene: The scene is where all the 3D objects will be displayed.
const scene = new THREE.Scene();

// Camara:  The camera determines what part of the scene is visible.
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Render: The renderer is responsible for rendering the scene and displaying it on the screen.
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Light
const light = new THREE.AmbientLight( 0xffffff ); // soft white light

light.position.set(0,0,0);
light.intensity = 5;
scene.add( light ); 

var dirLight = new THREE.DirectionalLight( 0xffffff , 0.5);
dirLight.position.set( 75, 5, -60 );
scene.add( dirLight );
 
// Load a 3D object
const loader = new GLTFLoader();
const shark = await loader.loadAsync("media/hammerhead.glb");
  shark.scene.rotation.x = 3.8;
/*   shark.scene.rotation.x = 3.8; */
/*   shark.scene.rotation.y = 1;
  shark.scene.position.y = 40; */
  shark.scene.position.z = -65;
  shark.scene.scale.set(-10,-10,-10); 
  //animate shark
  const mixer = new THREE.AnimationMixer( shark.scene );
  const clips = shark.animations;

  scene.add(shark.scene);

//animate swim
const clip = THREE.AnimationClip.findByName( clips, 'Action' );
const action = mixer.clipAction( clip );
action.play();
 
//Load Water Object
const water = await loader.loadAsync("media/water_animation.glb");
/*  water.scene.rotation.y = 5; */
water.scene.rotation.x = 0.8;
water.scene.scale.set(4,8,5); 

 water.scene.position.z = -63;
  //animate WATER
  const mixer_water = new THREE.AnimationMixer( water.scene );
  const clips_water = water.animations;

  scene.add(water.scene); 


  let meshes = water.parser.associations.keys();
  console.log(water); 
  for (let i = 0; i <= 15; i++) {
    console.log(meshes.next().value); 
    const material = meshes.next().value;
    if (material) {
      material['transparent']  = true;
      material['opacity']  = 0.3;
      material['metalness']  = 0;
      material['color'] = (47,79,79);
    }
  }
  //animate WATER MOVEMENT 
const clip_water = THREE.AnimationClip.findByName( clips_water, 'Take 001' );
const action_water = mixer_water.clipAction( clip_water );
action_water.play();



//Render the scene: This will display the 3D object on the screen.
function animate() {
   // animate model
    mixer.update( 0.015 );
    mixer_water.update( 0.0005 );
  
  requestAnimationFrame(animate);
  renderer.setClearColor( 0xffffff, 0);
  renderer.render(scene, camera);
 
}
animate();