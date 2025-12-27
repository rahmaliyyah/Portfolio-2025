import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface TrackingEyesProps {
  mousePosition: { x: number; y: number };
}

export const TrackingEyes = ({ mousePosition }: TrackingEyesProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const leftPupilRef = useRef<THREE.Group>(null);
  const rightPupilRef = useRef<THREE.Group>(null);
  const blinkRef = useRef(0);
  const nextBlinkRef = useRef(Math.random() * 3 + 2);

  // Smooth target positions
  const targetRef = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Smooth mouse tracking
    targetRef.current.x += (mousePosition.x * 0.15 - targetRef.current.x) * 0.05;
    targetRef.current.y += (mousePosition.y * 0.1 - targetRef.current.y) * 0.05;

    // Blinking logic
    if (time > nextBlinkRef.current) {
      blinkRef.current = 1;
      nextBlinkRef.current = time + Math.random() * 4 + 2;
    }
    
    // Blink animation
    if (blinkRef.current > 0) {
      blinkRef.current = Math.max(0, blinkRef.current - 0.15);
    }

    const blinkScale = 1 - Math.sin(blinkRef.current * Math.PI) * 0.9;

    // Left eye pupil tracking
    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.clamp(targetRef.current.x, -0.08, 0.08);
      leftPupilRef.current.position.y = THREE.MathUtils.clamp(targetRef.current.y, -0.05, 0.05);
      leftPupilRef.current.scale.y = blinkScale;
    }

    // Right eye pupil tracking
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = THREE.MathUtils.clamp(targetRef.current.x, -0.08, 0.08);
      rightPupilRef.current.position.y = THREE.MathUtils.clamp(targetRef.current.y, -0.05, 0.05);
      rightPupilRef.current.scale.y = blinkScale;
    }

    // Subtle eye rotation following gaze
    if (leftEyeRef.current && rightEyeRef.current) {
      const rotX = targetRef.current.y * 0.1;
      const rotY = targetRef.current.x * 0.15;
      
      leftEyeRef.current.rotation.x = THREE.MathUtils.lerp(leftEyeRef.current.rotation.x, rotX, 0.05);
      leftEyeRef.current.rotation.y = THREE.MathUtils.lerp(leftEyeRef.current.rotation.y, rotY, 0.05);
      
      rightEyeRef.current.rotation.x = THREE.MathUtils.lerp(rightEyeRef.current.rotation.x, rotX, 0.05);
      rightEyeRef.current.rotation.y = THREE.MathUtils.lerp(rightEyeRef.current.rotation.y, rotY, 0.05);
    }

    // Subtle breathing/idle animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.02;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
    }
  });

  return (
    <Float
      speed={1}
      rotationIntensity={0.1}
      floatIntensity={0.2}
    >
      <group ref={groupRef} position={[0, 0, 0]} scale={1.8}>
        {/* Hijab-inspired fabric frame */}
        <HijabFrame />
        
        {/* Left Eye */}
        <group ref={leftEyeRef} position={[-0.25, 0, 0]}>
          <Eye pupilRef={leftPupilRef} side="left" />
        </group>
        
        {/* Right Eye */}
        <group ref={rightEyeRef} position={[0.25, 0, 0]}>
          <Eye pupilRef={rightPupilRef} side="right" />
        </group>
        
        {/* Ambient glow */}
        <pointLight color="#8b5cf6" intensity={0.5} distance={3} position={[0, 0, 0.5]} />
      </group>
    </Float>
  );
};

const Eye = ({ pupilRef, side }: { pupilRef: React.RefObject<THREE.Group>; side: 'left' | 'right' }) => {
  return (
    <group>
      {/* Eye socket shadow */}
      <mesh position={[0, 0, -0.02]}>
        <sphereGeometry args={[0.22, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Sclera (white of eye) */}
      <mesh>
        <sphereGeometry args={[0.18, 64, 64]} />
        <meshStandardMaterial 
          color="#fafafa"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      
      {/* Iris */}
      <group ref={pupilRef} position={[0, 0, 0.12]}>
        {/* Outer iris */}
        <mesh>
          <circleGeometry args={[0.09, 64]} />
          <meshStandardMaterial 
            color="#4a3728"
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        
        {/* Inner iris with gradient effect */}
        <mesh position={[0, 0, 0.001]}>
          <circleGeometry args={[0.07, 64]} />
          <meshStandardMaterial 
            color="#3d2914"
            roughness={0.3}
          />
        </mesh>
        
        {/* Pupil */}
        <mesh position={[0, 0, 0.002]}>
          <circleGeometry args={[0.04, 64]} />
          <meshBasicMaterial color="#0a0a0a" />
        </mesh>
        
        {/* Eye reflection/highlight */}
        <mesh position={[0.02, 0.02, 0.003]}>
          <circleGeometry args={[0.015, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        
        {/* Secondary highlight */}
        <mesh position={[-0.015, -0.015, 0.003]}>
          <circleGeometry args={[0.008, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
      
      {/* Eyelid top */}
      <mesh position={[0, 0.1, 0.1]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[0.4, 0.15]} />
        <meshStandardMaterial 
          color="#2d1f3d"
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Eyelashes hint */}
      <EyelashAccent />
    </group>
  );
};

const EyelashAccent = () => {
  const positions = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 7) * Math.PI * 0.6 - Math.PI * 0.3;
      points.push([
        Math.sin(angle) * 0.17,
        Math.cos(angle) * 0.05 + 0.14,
        0.08
      ]);
    }
    return points;
  }, []);

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, 0, (i - 3.5) * 0.1]}>
          <boxGeometry args={[0.005, 0.03, 0.005]} />
          <meshBasicMaterial color="#1a0a2e" />
        </mesh>
      ))}
    </group>
  );
};

const HijabFrame = () => {
  return (
    <group>
      {/* Main fabric curve - top */}
      <mesh position={[0, 0.35, -0.1]} rotation={[0.2, 0, 0]}>
        <torusGeometry args={[0.5, 0.08, 16, 32, Math.PI]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Side draping - left */}
      <mesh position={[-0.55, -0.1, -0.05]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.12, 0.6, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.8}
        />
      </mesh>
      
      {/* Side draping - right */}
      <mesh position={[0.55, -0.1, -0.05]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.12, 0.6, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.8}
        />
      </mesh>
      
      {/* Neon accent glow edges */}
      <NeonAccentEdge />
      
      {/* Subtle pattern overlay */}
      <IslamicPatternHint />
    </group>
  );
};

const NeonAccentEdge = () => {
  const edgeRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!edgeRef.current) return;
    const time = state.clock.getElapsedTime();
    const material = edgeRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
  });

  return (
    <mesh ref={edgeRef} position={[0, 0.35, -0.05]} rotation={[0.2, 0, 0]}>
      <torusGeometry args={[0.52, 0.01, 8, 32, Math.PI]} />
      <meshBasicMaterial 
        color="#8b5cf6"
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

const IslamicPatternHint = () => {
  const patternRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!patternRef.current) return;
    const time = state.clock.getElapsedTime();
    patternRef.current.rotation.z = time * 0.05;
    patternRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(time + i * 0.5) * 0.05;
    });
  });

  // Simple geometric pattern inspired by Islamic art
  const starPoints = useMemo(() => {
    const points: [number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      points.push([Math.cos(angle) * 0.08, Math.sin(angle) * 0.08]);
    }
    return points;
  }, []);

  return (
    <group ref={patternRef} position={[0, 0.3, 0]}>
      {starPoints.map((pos, i) => (
        <mesh key={i} position={[pos[0], pos[1], 0]}>
          <circleGeometry args={[0.01, 8]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
};
