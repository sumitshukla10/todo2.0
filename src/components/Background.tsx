import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react'; // Import useEffect correctly
import * as THREE from 'three';

// Floating Cubes Component
function FloatingCubes() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 15,
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            0,
          ]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
            emissive={new THREE.Color().setHSL(Math.random(), 0.7, 0.6)}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// Background Component with enhanced UI & Responsiveness
export default function Background() {
  const [isMobile, setIsMobile] = useState(false);

  // Listen for window resize events
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Add event listener for resize
  useEffect(() => {
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // The empty array ensures this effect runs once when the component mounts

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* Canvas for 3D background */}
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 8 : 12], // Adjust camera distance based on screen size
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <FloatingCubes />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      {/* Overlay Content - Optional */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center tracking-wider">
          Welcome to Our Interactive World
        </h1>
      </div>
    </div>
  );
}
