import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';

const RotatingCube = () => {
  const mesh = useRef();
  
  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
    mesh.current.rotation.z += 0.005;
  });

  return (
    <Box ref={mesh} args={[2, 2, 2]}>
      <meshStandardMaterial attach="material" color="#6366f1" wireframe />
    </Box>
  );
};

const Logo3D = () => {
  return (
    <div className="w-full h-64">
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingCube />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default Logo3D;