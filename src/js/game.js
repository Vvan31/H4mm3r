/* import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; */


 let renderer = null, scene = null, camera = null

function main() {
    console.log("Hello");
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    addCube();
    animate();
}

function createScene(canvas){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    
    renderer = new THREE.WebGLRenderer({canvas: webglcanvas, antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function addCube(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
}

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function loadModel(){
    const loader = new GLTFLoader();

    loader.load( 'path/to/model.glb', function ( gltf ) {

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    } );
}

window.onload = () => {
    main();
    animate()
}; 

animate()