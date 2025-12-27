import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

type SkillItem = { name: string; color: string; position: [number, number, number] };

const skills: SkillItem[] = [
  { name: 'React', color: '#61dafb', position: [0, 0, 0] },
  { name: 'TypeScript', color: '#3178c6', position: [2, 1, -1] },
  { name: 'JavaScript', color: '#f7df1e', position: [-2, 0.5, 1] },
  { name: 'Python', color: '#3776ab', position: [1, -1, 1.5] },
  { name: 'Node.js', color: '#339933', position: [-1.5, 1.5, -0.5] },
  { name: 'Three.js', color: '#ffffff', position: [2.5, -0.5, 0.5] },
  { name: 'Tailwind', color: '#06b6d4', position: [-2.5, -1, -1] },
  { name: 'MongoDB', color: '#47a248', position: [0.5, 2, 1] },
  { name: 'PostgreSQL', color: '#4169e1', position: [-1, -2, 0] },
  { name: 'Git', color: '#f05032', position: [1.5, 0.5, -2] },
  { name: 'Docker', color: '#2496ed', position: [-0.5, -0.5, 2] },
  { name: 'Figma', color: '#f24e1e', position: [0, 1, -1.5] },
];

interface SkillConstellationProps {
  visible: boolean;
}

export const SkillConstellation = ({ visible }: SkillConstellationProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.03;
    groupRef.current.rotation.x = Math.sin(time * 0.02) * 0.1;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <ExplosiveSkillNode 
          key={skill.name} 
          skill={skill} 
          index={index}
        />
      ))}
      
      <EnergyConnectionLines skillsList={skills} />
      
      {/* Global ambient particles */}
      <Sparkles
        count={200}
        scale={10}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#8b5cf6"
      />
    </group>
  );
};

interface ExplosiveSkillNodeProps {
  skill: SkillItem;
  index: number;
}

const ExplosiveSkillNode = ({ skill, index }: ExplosiveSkillNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const [exploding, setExploding] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  // Create fragment positions for explosion
  const fragmentPositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      const theta = (i / 12) * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      positions.push(new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ));
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Core pulsing animation
    if (coreRef.current) {
      const pulseScale = 1 + Math.sin(time * 3 + index) * 0.15;
      coreRef.current.scale.setScalar(hovered ? pulseScale * 1.3 : pulseScale);
      coreRef.current.rotation.x = time * 0.5 + index;
      coreRef.current.rotation.y = time * 0.7 + index;
    }
    
    // Outer ring rotation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = time * 0.3;
      outerRingRef.current.rotation.y = time * 0.5;
      outerRingRef.current.rotation.z = time * 0.2;
      const ringScale = hovered ? 1.4 : 1;
      outerRingRef.current.scale.lerp(new THREE.Vector3(ringScale, ringScale, ringScale), 0.1);
    }
    
    // Inner ring counter-rotation
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -time * 0.4;
      innerRingRef.current.rotation.z = time * 0.6;
    }
    
    // Glow pulsing
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = hovered ? 0.6 + Math.sin(time * 5) * 0.2 : 0.2 + Math.sin(time * 2 + index) * 0.1;
      const glowScale = hovered ? 2 + Math.sin(time * 4) * 0.3 : 1.5 + Math.sin(time * 2) * 0.2;
      glowRef.current.scale.setScalar(glowScale);
    }
    
    // Pulse wave effect on hover
    if (pulseRef.current) {
      if (hovered) {
        const pulseWave = (time * 2) % 1;
        pulseRef.current.scale.setScalar(1 + pulseWave * 2);
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - pulseWave);
      } else {
        (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }
    
    // Fragment explosion animation
    if (fragmentsRef.current && exploding) {
      fragmentsRef.current.children.forEach((fragment, i) => {
        const direction = fragmentPositions[i];
        const explosionProgress = Math.min(1, (time % 2) * 2);
        fragment.position.set(
          direction.x * explosionProgress * 1.5,
          direction.y * explosionProgress * 1.5,
          direction.z * explosionProgress * 1.5
        );
        fragment.rotation.x = time * 2;
        fragment.rotation.y = time * 3;
        fragment.scale.setScalar(1 - explosionProgress * 0.5);
      });
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    setExploding(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    setTimeout(() => setExploding(false), 500);
    document.body.style.cursor = 'auto';
  }, []);

  const geometries = useMemo(() => [
    <octahedronGeometry key="oct" args={[0.2, 2]} />,
    <icosahedronGeometry key="ico" args={[0.2, 1]} />,
    <dodecahedronGeometry key="dod" args={[0.2, 0]} />,
  ], []);

  return (
    <Float
      speed={1.5 + index * 0.1}
      rotationIntensity={0.3}
      floatIntensity={0.4}
      floatingRange={[-0.15, 0.15]}
    >
      <group 
        ref={groupRef} 
        position={skill.position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {/* Multi-layer glow effect */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial 
            color={skill.color}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
        
        {/* Pulse wave */}
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.3, 0.4, 32]} />
          <meshBasicMaterial 
            color={skill.color}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        
        {/* Outer orbital ring */}
        <mesh ref={outerRingRef}>
          <torusGeometry args={[0.45, 0.02, 16, 64]} />
          <meshStandardMaterial 
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 1.5 : 0.5}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Inner orbital ring */}
        <mesh ref={innerRingRef}>
          <torusGeometry args={[0.32, 0.015, 16, 48]} />
          <meshStandardMaterial 
            color="#ffffff"
            emissive={skill.color}
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Core geometry */}
        <mesh ref={coreRef}>
          {geometries[index % 3]}
          <meshStandardMaterial 
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 2 : 0.6}
            metalness={0.9}
            roughness={0.1}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Explosion fragments */}
        <group ref={fragmentsRef}>
          {fragmentPositions.map((_, i) => (
            <mesh key={i} visible={exploding}>
              <tetrahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial 
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={2}
                metalness={1}
                roughness={0}
              />
            </mesh>
          ))}
        </group>
        
        {/* Local sparkles on hover */}
        {hovered && (
          <Sparkles
            count={30}
            scale={1}
            size={3}
            speed={2}
            opacity={0.8}
            color={skill.color}
          />
        )}
        
        {/* Orbiting mini particles */}
        {[0, 1, 2].map((i) => (
          <OrbitingParticle 
            key={i} 
            color={skill.color} 
            radius={0.55 + i * 0.1} 
            speed={1 + i * 0.5}
            offset={i * (Math.PI * 2 / 3)}
          />
        ))}
        
        {/* Tooltip on hover */}
        {hovered && (
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {skill.name}
          </Text>
        )}
        
        {/* Dynamic point light */}
        <pointLight 
          color={skill.color} 
          intensity={hovered ? 4 : 1}
          distance={3}
          decay={2}
        />
      </group>
    </Float>
  );
};

// Orbiting particle component
const OrbitingParticle = ({ color, radius, speed, offset }: { 
  color: string; 
  radius: number; 
  speed: number;
  offset: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.cos(time) * radius;
    meshRef.current.position.y = Math.sin(time * 0.7) * radius * 0.3;
    meshRef.current.position.z = Math.sin(time) * radius;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// Enhanced connection lines with energy flow
const EnergyConnectionLines = ({ skillsList }: { skillsList: SkillItem[] }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, particlePositions } = useMemo(() => {
    const linePoints: number[] = [];
    const particlePoints: number[] = [];
    
    for (let i = 0; i < skillsList.length; i++) {
      for (let j = i + 1; j < skillsList.length; j++) {
        const dist = Math.sqrt(
          Math.pow(skillsList[i].position[0] - skillsList[j].position[0], 2) +
          Math.pow(skillsList[i].position[1] - skillsList[j].position[1], 2) +
          Math.pow(skillsList[i].position[2] - skillsList[j].position[2], 2)
        );
        
        if (dist < 3.5) {
          linePoints.push(...skillsList[i].position, ...skillsList[j].position);
          
          // Add particles along the line
          for (let k = 0; k < 5; k++) {
            const t = k / 4;
            particlePoints.push(
              skillsList[i].position[0] + (skillsList[j].position[0] - skillsList[i].position[0]) * t,
              skillsList[i].position[1] + (skillsList[j].position[1] - skillsList[i].position[1]) * t,
              skillsList[i].position[2] + (skillsList[j].position[2] - skillsList[i].position[2]) * t
            );
          }
        }
      }
    }
    
    return { 
      positions: new Float32Array(linePoints),
      particlePositions: new Float32Array(particlePoints)
    };
  }, [skillsList]);
  
  useFrame((state) => {
    if (!lineRef.current || !particlesRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Animate line opacity
    const lineMaterial = lineRef.current.material as THREE.LineBasicMaterial;
    lineMaterial.opacity = 0.15 + Math.sin(time) * 0.1;
    
    // Animate particle positions along lines
    const particleGeom = particlesRef.current.geometry;
    const posAttr = particleGeom.getAttribute('position');
    
    for (let i = 0; i < posAttr.count; i++) {
      const offset = Math.sin(time * 2 + i * 0.5) * 0.05;
      posAttr.setY(i, posAttr.getY(i) + offset * 0.01);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color="#8b5cf6"
          transparent
          opacity={0.25}
          linewidth={1}
        />
      </lineSegments>
      
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#ec4899"
          size={0.03}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
};
