import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const RotatingMesh = () => {
  const meshRef = useRef();
  const clock = new THREE.Clock();

  // Store original positions once
  const originalPositions = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(4, 5); // More abstract than sphere
    return Float32Array.from(geometry.attributes.position.array);
  }, []);

  // Animate the position and rotation
  useFrame(() => {
    const time = clock.getElapsedTime();
    const position = meshRef.current.geometry.attributes.position;
    const count = position.count;

    // Animation for squeezing and expanding effect
    for (let i = 0; i < count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];

      const d = Math.sqrt(ox * ox + oy * oy + oz * oz);

      // Multi-dimensional noise with increased intensity
      const noise = Math.sin(d * 4 - time * 2) * Math.cos(ox * 2 + time) + Math.sin(oy * 2 + time);
      const randomFactor = Math.sin(ox * 3 + time * 0.7) * Math.cos(oy * 2.5 + time * 0.3);

      // Increased displacement for stronger squeezing and expanding effect
      const displacement = 0.5 * noise + randomFactor * 0.8;

      // Apply organic, dynamic movement to each vertex
      position.setXYZ(
        i,
        ox + (ox / d) * displacement,
        oy + (oy / d) * displacement,
        oz + (oz / d) * displacement
      );
    }

    position.needsUpdate = true;

    // Animate rotation
    meshRef.current.rotation.y += 0.0015;
    meshRef.current.rotation.x += 0.001;

    // Animate material color dynamically based on time
    const hue = (time * 40) % 360; // Dynamic HSL color shift
    meshRef.current.material.color = new THREE.Color(`hsl(${hue}, 100%, 70%)`);
  });

  // Animate movement from right corner to center and back
  const moveSpeed = 2; // Speed of movement
  const oscillation = Math.sin(clock.getElapsedTime() * moveSpeed) * 3; // Oscillates between -3 and 3

  return (
    <mesh ref={meshRef} position={[6 + oscillation, 0, 0]}>
      <icosahedronGeometry args={[4, 5]} />
      <meshStandardMaterial wireframe />
    </mesh>
  );
};

const Logo3D = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center -z-10">
      <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.2} />

        <RotatingMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.5}
        />

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Logo3D;
