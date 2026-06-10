import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const MiniQuasar = ({ position }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Smoothly scale up on hover
    const s = hovered ? 2.5 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    
    // Spin core and ring
    meshRef.current.rotation.y += hovered ? 0.05 : 0.01;
    ringRef.current.rotation.z -= hovered ? 0.1 : 0.02;
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t) * 0.1;
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Glowing Core */}
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial 
            color={hovered ? "#60a5fa" : "#2563eb"} 
            emissive={hovered ? "#60a5fa" : "#1e40af"} 
            emissiveIntensity={hovered ? 10 : 2} 
          />
        </mesh>

        {/* Rotating Accretion Disk (Ring) */}
        <mesh ref={ringRef}>
          <torusGeometry args={[0.5, 0.01, 16, 100]} />
          <meshStandardMaterial 
            color={hovered ? "#93c5fd" : "#3b82f6"} 
            emissive={hovered ? "#ffffff" : "#60a5fa"}
            emissiveIntensity={5}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
};

export const SpaceScene = () => {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Scattering 6 Quasars across the viewport */}
      <MiniQuasar position={[-4, 2, -2]} />
      <MiniQuasar position={[3, -1, -1]} />
      <MiniQuasar position={[-2, -3, 1]} />
      <MiniQuasar position={[5, 3, -3]} />
      <MiniQuasar position={[-5, -1, -4]} />
      <MiniQuasar position={[1, 2, 0]} />
    </>
  );
};
