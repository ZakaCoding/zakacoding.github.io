import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TessellateModifier } from 'three/addons/modifiers/TessellateModifier.js';
import portraitUrl from '../assets/image/zaka-memoji-screenlit.webp';

// Coordinates trace the original portrait. Keeping the image as the front
// surface preserves Zaka's expression, stickers, and carefully lit materials.
const imageWidth = 1120;
const imageHeight = 1404;
const worldX = (x) => (x - 560) / 190;
const worldY = (y) => (705 - y) / 190;

function shapedSurface(points, texture, depth = 0, curvature = 0) {
  const shape = new THREE.Shape();
  shape.moveTo(worldX(points[0][0]), worldY(points[0][1]));
  points.slice(1).forEach(([x, y]) => shape.lineTo(worldX(x), worldY(y)));
  shape.closePath();
  const outline = new THREE.ShapeGeometry(shape, 4);
  const geometry = curvature
    ? new TessellateModifier(0.15, 6).modify(outline)
    : outline;
  if (geometry !== outline) outline.dispose();
  const positions = geometry.getAttribute('position');
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    uv.setXY(i, (x * 190 + 560) / imageWidth, 1 - (705 - y * 190) / imageHeight);
    positions.setZ(i, depth + curvature * Math.max(0, 1 - x * x / 1.95));
  }
  geometry.computeVertexNormals();
  return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    map: texture, transparent: true, side: THREE.DoubleSide, toneMapped: false,
    depthWrite: true,
  }));
}

const headOutline = [
  [556, 260], [605, 261], [627, 276], [658, 274], [713, 283], [765, 307],
  [810, 351], [842, 411], [858, 483], [850, 544], [837, 576], [846, 584],
  [849, 613], [837, 651], [818, 678], [800, 670], [788, 704], [758, 735],
  [731, 752], [430, 752], [409, 726], [391, 690], [382, 656], [363, 676],
  [349, 669], [337, 636], [345, 590], [360, 551], [352, 510], [358, 457],
  [377, 394], [418, 338], [477, 291], [525, 268],
];

const laptopOutline = [
  [254, 753], [868, 753], [888, 760], [896, 777], [884, 1125],
  [876, 1149], [857, 1155], [261, 1155], [244, 1142], [227, 779], [232, 762],
];

function buildCharacter(texture) {
  const character = new THREE.Group();
  const head = new THREE.Group();
  head.position.set(0, 0, -0.16);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(1, 40, 28),
    new THREE.MeshStandardMaterial({ color: '#201511', roughness: 0.86 }),
  );
  hair.scale.set(1.34, 1.33, 0.48);
  hair.position.set(0.03, worldY(501), -0.32);
  head.add(hair);

  const face = new THREE.Mesh(
    new THREE.SphereGeometry(1, 40, 28),
    new THREE.MeshStandardMaterial({ color: '#9d7167', roughness: 0.9 }),
  );
  face.scale.set(1.08, 1.03, 0.43);
  face.position.set(0, worldY(601), -0.23);
  head.add(face);
  head.add(shapedSurface(headOutline, texture, 0.2, 0.23));
  character.add(head);

  const laptop = new THREE.Group();
  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(3.52, 2.1, 0.12),
    new THREE.MeshStandardMaterial({ color: '#343943', metalness: 0.68, roughness: 0.48 }),
  );
  lid.position.set(-0.015, worldY(954), 0.4);
  laptop.add(lid);
  laptop.add(shapedSurface(laptopOutline, texture, 0.48));
  character.add(laptop);

  const screenLight = new THREE.PointLight('#a8caff', 2.2, 3.8, 2);
  screenLight.position.set(0, -0.4, 0.62);
  character.add(screenLight);
  const rimLight = new THREE.DirectionalLight('#f6a063', 1.6);
  rimLight.position.set(2, 3, -2);
  character.add(rimLight);

  return { character, head, laptop };
}

export default function HeroMemojiScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-3, 3, 3.1, -3.1, 0.1, 30);
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight('#cad7ff', 1.05));

    let model;
    let visible = false;
    let frame = 0;
    let disposed = false;
    let lastTime = 0;
    const target = { x: 0, y: 0, active: false };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      // Short, wide cards need more breathing room below the laptop caption.
      const viewHeight = Math.max(7, 3.95 / aspect);
      camera.left = -viewHeight * aspect / 2;
      camera.right = viewHeight * aspect / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (reducedMotion.matches) renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const onMove = (event) => {
      const bounds = container.getBoundingClientRect();
      target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      target.active = true;
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.active = false; };
    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerleave', onLeave);

    const tick = (time) => {
      frame = 0;
      if (!model || !visible || document.hidden || reducedMotion.matches) return;
      const dt = Math.min(0.05, (time - (lastTime || time)) / 1000);
      lastTime = time;
      const ease = 1 - Math.exp(-dt * 5.4);
      model.head.rotation.y += (target.x * 0.19 - model.head.rotation.y) * ease;
      model.head.rotation.x += (-target.y * 0.095 - model.head.rotation.x) * ease;
      model.head.rotation.z += (-target.x * 0.025 - model.head.rotation.z) * ease;
      model.head.position.y += ((Math.sin(time * 0.0015) * 0.025) - model.head.position.y) * ease;
      model.laptop.rotation.y += (target.x * 0.045 - model.laptop.rotation.y) * ease;
      model.character.rotation.y += (target.x * 0.025 - model.character.rotation.y) * ease;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame || !model || !visible) return;
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0.05 });
    visibility.observe(container);
    const onVisibility = () => { if (!document.hidden) start(); };
    document.addEventListener('visibilitychange', onVisibility);
    const onMotion = () => {
      if (reducedMotion.matches) {
        cancelAnimationFrame(frame); frame = 0;
        if (model) renderer.render(scene, camera);
      } else start();
    };
    reducedMotion.addEventListener('change', onMotion);

    const texture = new THREE.TextureLoader().load(portraitUrl, () => {
      if (disposed) return;
      model = buildCharacter(texture);
      scene.add(model.character);
      renderer.render(scene, camera);
      container.classList.add('is-ready');
      container.previousElementSibling?.classList.add('is-hidden');
      start();
    });
    texture.colorSpace = THREE.SRGBColorSpace;

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      reducedMotion.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerleave', onLeave);
      if (model) {
        model.character.traverse((object) => {
          object.geometry?.dispose();
          if (object.material) object.material.dispose();
        });
      }
      texture.dispose();
      container.previousElementSibling?.classList.remove('is-hidden');
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="hero-memoji-scene" ref={containerRef} aria-hidden="true" />;
}
