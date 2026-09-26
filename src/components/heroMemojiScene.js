import * as THREE from 'three';

const WIDTH = 3;
const HEIGHT = 3.76;
// The lid starts at pixel 752 in the approved 1120 x 1404 portrait. Keeping
// both meshes on the same projection prevents the laptop from being cut off.
const FACE_BOTTOM_UV = 1 - 752 / 1404;
const LAPTOP_TOP_UV = 1 - 750 / 1404;

function makePortraitGeometry() {
  const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT, 48, 64);
  const positions = geometry.attributes.position;

  // A shallow sculpt under the original portrait: the face and hair have
  // different curvature, but the front projection keeps the familiar likeness.
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const face = Math.exp(-((x / 1.03) ** 2 + ((y - 0.55) / 0.94) ** 2) * 1.6);
    const hair = Math.exp(-((x / 1.24) ** 2 + ((y - 1.27) / 0.58) ** 2) * 2);
    positions.setZ(i, face * 0.26 + hair * 0.12);
  }
  geometry.computeVertexNormals();
  return geometry;
}

function makeLaptopBodyGeometry() {
  const width = 1.8;
  const height = 1.08;
  const radius = 0.055;
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2 + radius, -height / 2);
  shape.lineTo(width / 2 - radius, -height / 2);
  shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
  shape.lineTo(width / 2, height / 2 - radius);
  shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
  shape.lineTo(-width / 2 + radius, height / 2);
  shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
  shape.lineTo(-width / 2, -height / 2 + radius);
  shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelSize: 0.018,
    bevelThickness: 0.018,
    bevelSegments: 2,
    curveSegments: 6,
  });
}

function portraitMaterial(texture, blinkUniform) {
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    emissive: 0xffffff,
    emissiveMap: texture,
    emissiveIntensity: 0.38,
    side: THREE.DoubleSide,
    roughness: 0.92,
    metalness: 0,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.blinkAmount = blinkUniform;
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      '#include <common>\nuniform float blinkAmount;',
    );
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      if (vMapUv.y < ${FACE_BOTTOM_UV.toFixed(6)}) discard;
      // Close only the two eyes, using skin pixels just above each eye. The
      // rest of the face remains the exact approved texture throughout.
      vec2 leftEye = (vMapUv - vec2(0.429, 0.589)) / vec2(0.055, 0.026);
      vec2 rightEye = (vMapUv - vec2(0.626, 0.579)) / vec2(0.056, 0.025);
      float leftMask = 1.0 - smoothstep(0.86, 1.06, length(leftEye));
      float rightMask = 1.0 - smoothstep(0.86, 1.06, length(rightEye));
      float eyeMask = max(leftMask, rightMask) * blinkAmount;
      vec3 lid = texture2D(map, vMapUv + vec2(0.0, 0.045)).rgb;
      float lash = exp(-pow((leftEye.y + 0.08 * leftEye.x * leftEye.x) * 12.0, 2.0)) * leftMask
        + exp(-pow((rightEye.y + 0.08 * rightEye.x * rightEye.x) * 12.0, 2.0)) * rightMask;
      lid = mix(lid, vec3(0.14, 0.09, 0.09), clamp(lash * 0.84, 0.0, 1.0));
      diffuseColor.rgb = mix(diffuseColor.rgb, lid, eyeMask);`,
    );
  };
  return material;
}

function laptopMaterial(texture) {
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
    roughness: 0.62,
    metalness: 0.08,
  });
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <map_fragment>',
      `#include <map_fragment>
      if (vMapUv.y > ${LAPTOP_TOP_UV.toFixed(6)}) discard;`,
    );
  };
  return material;
}

export async function createHeroMemojiScene(container, portraitUrl) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  let portrait;
  try {
    portrait = await loader.loadAsync(portraitUrl);
  } catch (error) {
    renderer.dispose();
    renderer.domElement.remove();
    throw error;
  }
  for (const texture of [portrait]) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.6, 1.6, 2.02, -2.02, 0.1, 30);
  camera.position.set(0, 0, 9);
  camera.lookAt(0, 0, 0);

  const ambient = new THREE.HemisphereLight(0xf1edff, 0x25223b, 0.65);
  const key = new THREE.DirectionalLight(0xffd1a6, 0.48);
  key.position.set(-2, 3, 4);
  // The laptop screen is hidden behind its lid; this light is placed just
  // above that edge and illuminates the curved face mesh from below.
  const screenLight = new THREE.PointLight(0x87baff, 2.8, 3.6, 1.5);
  screenLight.position.set(0, -0.26, 1.25);
  scene.add(ambient, key, screenLight);

  const blinkUniform = { value: 0 };
  const faceGeometry = makePortraitGeometry();
  const faceMaterial = portraitMaterial(portrait, blinkUniform);
  const face = new THREE.Mesh(faceGeometry, faceMaterial);
  face.position.y = -0.55;

  const head = new THREE.Group();
  head.position.y = 0.55;
  const headVolume = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x493029, roughness: 0.92 }),
  );
  headVolume.scale.set(0.77, 0.72, 0.26);
  headVolume.position.set(0, 0.06, -0.38);
  head.add(headVolume, face);
  scene.add(head);

  const laptop = new THREE.Group();
  const laptopBody = new THREE.Mesh(
    makeLaptopBodyGeometry(),
    new THREE.MeshStandardMaterial({ color: 0x5a5e68, metalness: 0.48, roughness: 0.43 }),
  );
  laptopBody.position.set(0, -0.674, 0.19);
  const laptopFront = new THREE.Mesh(new THREE.PlaneGeometry(WIDTH, HEIGHT), laptopMaterial(portrait));
  laptopFront.position.z = 0.35;
  laptopFront.renderOrder = 2;
  laptop.add(laptopBody, laptopFront);
  scene.add(laptop);

  let frame = 0;
  let hovering = false;
  let touchUntil = 0;
  let enteredAt = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let disposed = false;
  let visible = true;
  let lastDraw = 0;

  const blinkPulse = (elapsed) => (
    elapsed > 0 && elapsed < 190 ? Math.sin(Math.PI * elapsed / 190) ** 2 : 0
  );

  const render = (now = performance.now()) => {
    frame = 0;
    if (disposed || !visible) return;
    frame = window.requestAnimationFrame(render);
    if (now - lastDraw < 30) return;
    lastDraw = now;
    const reacting = hovering || now < touchUntil;
    currentX += (pointerX - currentX) * 0.1;
    currentY += (pointerY - currentY) * 0.1;
    head.rotation.y = -currentX * 0.075;
    head.rotation.x = -currentY * 0.035;
    head.rotation.z = Math.sin(now * 0.0012) * 0.004;
    head.position.x = currentX * 0.018;
    head.position.y = 0.55 - currentY * 0.012 + Math.sin(now * 0.00135) * 0.008;
    // The laptop stays entirely still, like the reference video.
    blinkUniform.value = Math.max(
      blinkPulse((now % 5300) - 4200),
      reacting ? blinkPulse(now - enteredAt - 200) : 0,
    );
    screenLight.position.x = currentX * 0.09;
    screenLight.intensity = 2.8 + Math.sin(now * 0.0017) * 0.24 + (reacting ? 0.3 : 0);
    renderer.render(scene, camera);
  };
  const requestRender = () => { if (!frame && !disposed) frame = window.requestAnimationFrame(render); };
  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height;
    // Match CSS object-fit: contain exactly, including narrow Bento cards.
    const viewHeight = Math.max(HEIGHT, WIDTH / aspect);
    camera.left = -viewHeight * aspect / 2;
    camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    requestRender();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestRender();
    else window.cancelAnimationFrame(frame);
  });
  visibility.observe(container);
  resize();
  if (frame) window.cancelAnimationFrame(frame);
  render();

  return {
    enter() { hovering = true; enteredAt = performance.now(); requestRender(); },
    move(x, y) { pointerX = x; pointerY = y; requestRender(); },
    leave() { hovering = false; pointerX = 0; pointerY = 0; requestRender(); },
    tap() { enteredAt = performance.now(); touchUntil = enteredAt + 1900; pointerY = -0.25; requestRender(); },
    dispose() {
      disposed = true;
      observer.disconnect();
      visibility.disconnect();
      window.cancelAnimationFrame(frame);
      faceGeometry.dispose();
      faceMaterial.dispose();
      headVolume.geometry.dispose();
      headVolume.material.dispose();
      laptopBody.geometry.dispose();
      laptopBody.material.dispose();
      laptopFront.geometry.dispose();
      laptopFront.material.dispose();
      portrait.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
