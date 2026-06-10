import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Stars, Float, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

const MiniQuasar = ({ position, textureUrl }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Load actual Quasar/Galaxy Texture
  const texture = useTexture(textureUrl);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = hovered ? 2.8 : 1.2;
    meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    
    // High-speed rotation on hover
    meshRef.current.rotation.y += hovered ? 0.08 : 0.01;
    ringRef.current.rotation.z -= hovered ? 0.15 : 0.03;
    ringRef.current.position.y = Math.sin(t * 2) * 0.1;
  });

  return (
    <group position={position}>
      <Float speed={3} rotationIntensity={1} floatIntensity={2}>
        {/* Actual Image Core */}
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.4, 64, 64]} />
          <meshStandardMaterial 
            map={texture} 
            emissiveMap={texture}
            emissive={new THREE.Color(hovered ? "#ffffff" : "#444444")}
            emissiveIntensity={hovered ? 5 : 1} 
          />
        </mesh>

        {/* Accretion Disk (The Ring) */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color={hovered ? "#60a5fa" : "#ffffff"} 
            emissive={hovered ? "#60a5fa" : "#2563eb"}
            emissiveIntensity={10}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>
    </group>
  );
};

export const SpaceScene = () => {
  // Starfield logic
  return (
    <>
      <color attach="background" args={["#000105"]} />
      
      {/* Background Star Texture */}
      <Stars radius={100} depth={50} count={10000} factor={6} saturation={1} fade speed={2} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} />

      {/* 6 Mini-Quasars using Actual NASA/Hubble styled textures */}
      <MiniQuasar position={[-5, 3, -3]} textureUrl="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=400&q=80" />
      <MiniQuasar position={[6, -2, -2]} textureUrl="https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80" />
      <MiniQuasar position={[-2, -4, 1]} textureUrl="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&q=80" />
      <MiniQuasar position={[4, 4, -4]} textureUrl="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=400&q=80" />
      <MiniQuasar position={[-7, -1, -5]} textureUrl="https://images.unsplash.com/photo-1506318137071-a8e063b4b519?auto=format&fit=crop&w=400&q=80" />
      <MiniQuasar position={[2, 0, 0]} textureUrl="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?auto=format&fit=crop&w=400&q=80" />
    </>
  );
};
