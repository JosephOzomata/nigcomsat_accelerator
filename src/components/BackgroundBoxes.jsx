// src/components/BackgroundBoxes.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundBoxes = ({
  count = 40,
  color = 0x0a0a0a,
  opacity = 0.08,
  cameraZ = 22,
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
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = cameraZ;

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

    /* ---------- Shared geometry & material ---------- */
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
    });
    boxGeometry.dispose(); // not needed after extracting edges

    /* ---------- Create cubes ---------- */
    const boxes = [];
    const spread = { x: 70, y: 45, z: 40 };

    for (let i = 0; i < count; i++) {
      const line = new THREE.LineSegments(edgesGeometry, lineMaterial);

      const baseX = (Math.random() - 0.5) * spread.x;
      const baseY = (Math.random() - 0.5) * spread.y;
      const baseZ = (Math.random() - 0.5) * spread.z - 5;

      line.position.set(baseX, baseY, baseZ);
      line.scale.setScalar(0.4 + Math.random() * 1.6);

      line.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      scene.add(line);

      boxes.push({
        mesh: line,
        basePos: new THREE.Vector3(baseX, baseY, baseZ),
        floatAmp: 0.4 + Math.random() * 1.2,
        floatSpeed: 0.15 + Math.random() * 0.35,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        phase: Math.random() * Math.PI * 2,
      });
    }

    /* ---------- Animation loop ---------- */
    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();

      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        const m = b.mesh;

        // Sine-based floating motion — smooth, no jitter
        m.position.x =
          b.basePos.x + Math.sin(t * b.floatSpeed + b.phase) * b.floatAmp;
        m.position.y =
          b.basePos.y +
          Math.cos(t * b.floatSpeed * 0.8 + b.phase) * b.floatAmp;

        // Slow continuous rotation
        m.rotation.x += b.rotSpeed.x * delta;
        m.rotation.y += b.rotSpeed.y * delta;
        m.rotation.z += b.rotSpeed.z * delta;
      }

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

      boxes.forEach((b) => scene.remove(b.mesh));
      edgesGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [count, color, opacity, cameraZ]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default BackgroundBoxes; 