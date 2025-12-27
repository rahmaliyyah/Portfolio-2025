import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
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
    groupRef.current.rotation.y = time * 0.05;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <SkillNode 
          key={skill.name} 
          skill={skill} 
          index={index}
        />
      ))}
      
      <ConnectionLines skillsList={skills} />
    </group>
  );
};

interface SkillNodeProps {
  skill: SkillItem;
  index: number;
}

const SkillNode = ({ skill, index }: SkillNodeProps) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const time = state.clock.getElapsedTime();
    
    meshRef.current.rotation.x = time * 0.5 + index;
    meshRef.current.rotation.y = time * 0.3 + index;
    
    const scale = hovered ? 1.5 : 1;
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1));
    
    glowRef.current.scale.setScalar(1.5 + Math.sin(time * 2 + index) * 0.2);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 
      hovered ? 0.5 : 0.2 + Math.sin(time * 2 + index) * 0.1;
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group position={skill.position}>
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color={skill.color}
            transparent
            opacity={0.2}
          />
        </mesh>
        
        <mesh 
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {index % 3 === 0 ? (
            <octahedronGeometry args={[0.25, 0]} />
          ) : index % 3 === 1 ? (
            <icosahedronGeometry args={[0.25, 0]} />
          ) : (
            <dodecahedronGeometry args={[0.25, 0]} />
          )}
          <meshStandardMaterial 
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 0.8 : 0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {hovered && (
          <Text
            position={[0, 0.6, 0]}
            fontSize={0.15}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
        )}
        
        <pointLight 
          color={skill.color} 
          intensity={hovered ? 2 : 0.5}
          distance={2}
        />
      </group>
    </Float>
  );
};

const ConnectionLines = ({ skillsList }: { skillsList: SkillItem[] }) => {
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const positions = useMemo(() => {
    const points: number[] = [];
    
    for (let i = 0; i < skillsList.length; i++) {
      for (let j = i + 1; j < skillsList.length; j++) {
        const dist = Math.sqrt(
          Math.pow(skillsList[i].position[0] - skillsList[j].position[0], 2) +
          Math.pow(skillsList[i].position[1] - skillsList[j].position[1], 2) +
          Math.pow(skillsList[i].position[2] - skillsList[j].position[2], 2)
        );
        
        if (dist < 3) {
          points.push(...skillsList[i].position, ...skillsList[j].position);
        }
      }
    }
    
    return new Float32Array(points);
  }, [skillsList]);
  
  useFrame((state) => {
    if (!lineRef.current) return;
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity = 0.2 + Math.sin(state.clock.getElapsedTime()) * 0.1;
  });

  return (
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
        opacity={0.3}
      />
    </lineSegments>
  );
};
