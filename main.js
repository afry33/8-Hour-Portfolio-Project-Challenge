import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const canvas = document.getElementById("experience-canvas");
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Modal content
const modalContent = {
    "Project_1": {
        title: "8時間プロジェクトチャレンジ",
        description: "ご覧いただいているポートフォリオは、8時間チャレンジプロジェクトの一環として制作しました。 Blender、Three.js、JavaScript、HTML、CSS を使用して構築しています。",
    },
    "Project_2": {
        title: "ArtStation",
        description: "View my creative portfolio",
        buttons: [
            {
                text: "Visit ArtStation",
                url: "https://ayaha_asahata.artstation.com/",
                external: true
            }
        ]
    },
    "Project_3": {
        title: "GitHub",
        description: "Explore my coding projects",
        buttons: [
            {
                text: "Visit GitHub",
                url: "https://github.com/afry33",
                external: true
            }
        ]
    },
    "UFO": {
        title: "UFO Resume Delivery",
        description: "Available through private link",
        buttons: [
            {
                text: "JPN Resume",
                url: "https://docs.google.com/document/d/1B9EdUB-jGiqjv9Te2Fmah6Q83jZsUC-K/preview",
                external: true,
            }
        ]
    }
};

// Modal elements
const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal-overlay");
const modalTitle = document.querySelector(".modal-title");
const modalDescription = document.querySelector(".modal-project-description");
const modalButtons = document.querySelector(".modal-buttons");
const modalExitButton = document.querySelector(".modal-exit-button");

function showModal(id) {
    const content = modalContent[id];
    if (content) {
        modalTitle.textContent = content.title;
        modalDescription.textContent = content.description;
        
        // Clear previous buttons
        modalButtons.innerHTML = '';
        
        // Add new buttons
        if (content.buttons) {
            content.buttons.forEach(button => {
                const btn = document.createElement('a');
                btn.className = 'modal-button';
                btn.textContent = button.text;
                btn.href = button.url;
                if (button.external) {
                    btn.target = '_blank';
                    btn.rel = 'noopener noreferrer';
                }
                modalButtons.appendChild(btn);
            });
        }
        
        modal.classList.remove("hidden");
        modalOverlay.classList.remove("hidden");
    }
}

function hideModal() {
    modal.classList.add("hidden");
    modalOverlay.classList.add("hidden");
}

modalExitButton.addEventListener("click", hideModal);
modalOverlay.addEventListener("click", hideModal);

// Three.js scene
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(-35, 4, 36);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const loader = new GLTFLoader();
const intersectObjects = [];
const intersectObjectsNames = ["Project_1", "Project_2", "Project_3", "UFO"];

loader.load("./Portfolio.glb", (glb) => {
    glb.scene.traverse((child) => {
        if (intersectObjectsNames.includes(child.name)) {
            intersectObjects.push(child);
        }
    });
    scene.add(glb.scene);
}, undefined, console.error);

// Lights
const sun = new THREE.DirectionalLight(0xffffff, 1.5);
sun.position.set(10, 20, 10);
scene.add(sun);

const ambient = new THREE.AmbientLight(0x404040, 3);
scene.add(ambient);

// Interaction
let intersectObject = "";

function onClick() {
    if (intersectObject) showModal(intersectObject);
}

function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("click", onClick);
window.addEventListener("pointermove", onPointerMove);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(intersectObjects);
    
    if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
        intersectObject = intersects[0].object.parent.name;
    } else {
        document.body.style.cursor = "default";
        intersectObject = "";
    }
    
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});