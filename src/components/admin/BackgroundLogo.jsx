// src/components/admin/BackgroundLogo.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundLogo = ({
  imageSrc,
  size = 5,           // plane height in world units
  opacity = 0.08,     // very faded
  speed = 0.15,       // radians per second — 0.15 ≈ 24s per full rotation
  tilt = -0.15,       // slight X-axis tilt for a 3D feel
  position = { x: 0, y: 0, z: -2 },
  blending = 'normal', // 'normal' | 'multiply'
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Respect reduced-motion preferences
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    /* ---------- Scene + camera ---------- */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    /* ---------- Renderer ---------- */
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    /* ---------- Texture + mesh ---------- */
    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageSrc, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      // Preserve aspect ratio so the logo isn't distorted
      if (tex.image?.width && tex.image?.height) {
        const aspect = tex.image.width / tex.image.height;
        mesh.scale.set(aspect, 1, 1);
      }
    });
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const geometry = new THREE.PlaneGeometry(size, size);

    const materialOptions = {
      map: texture,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false,
    };

    if (blending === 'multiply') {
      // Multiply blending makes white parts invisible on any background
      materialOptions.blending = THREE.MultiplyBlending;
    }

    const material = new THREE.MeshBasicMaterial(materialOptions);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.x = tilt;
    scene.add(mesh);

    /* ---------- Animation loop ---------- */
    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      // Slow spin on Y axis, plus a subtle wobble on Z for extra depth
      mesh.rotation.y += speed * delta;
      mesh.rotation.z = Math.sin(clock.getElapsedTime() * 0.15) * 0.06;
      renderer.render(scene, camera);
    };
    animate();

    /* ---------- Resize ---------- */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    /* ---------- Cleanup ---------- */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc, size, opacity, speed, tilt, position.x, position.y, position.z, blending]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default BackgroundLogo;