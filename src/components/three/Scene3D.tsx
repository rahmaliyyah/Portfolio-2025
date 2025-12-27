import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import { ParticleField } from './ParticleField';
import { FloatingLaptop } from './FloatingLaptop';
import { SkillConstellation } from './SkillConstellation';

interface Scene3DProps {
  currentSection: number;
  mousePosition: { x: number; y: number };
}

export const Scene3D = ({ currentSection, mousePosition }: Scene3DProps) => {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ec4899" />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={0.5}
          />
          
          <ParticleField count={1500} spread={25} size={0.015} />
          
          {currentSection === 0 && (
            <group position={[2, 0, 0]}>
              <FloatingLaptop mousePosition={mousePosition} />
            </group>
          )}
          
          <SkillConstellation visible={currentSection === 1} />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};
