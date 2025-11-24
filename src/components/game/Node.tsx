import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface NodeProps {
	position: [number, number, number];
	isOn: boolean;
	onToggle: () => void;
	label?: string;
}

export function Node({ position, isOn, onToggle, label }: NodeProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [hovered, setHover] = useState(false);

	useFrame((_, delta) => {
		if (meshRef.current) {
			// Smooth rotation for visual feedback
			const targetRotation = isOn ? -Math.PI / 4 : Math.PI / 4;
			meshRef.current.rotation.z = THREE.MathUtils.lerp(
				meshRef.current.rotation.z,
				targetRotation,
				delta * 10,
			);
		}
	});

	return (
		<group position={position}>
			{/* The Switch/Lever */}
			{/** biome-ignore lint/a11y/noStaticElementInteractions: 3d element can't be accessible */}
			<mesh
				ref={meshRef}
				onClick={(e) => {
					e.stopPropagation();
					onToggle();
				}}
				onPointerOver={() => setHover(true)}
				onPointerOut={() => setHover(false)}
			>
				<boxGeometry args={[1.5, 0.5, 0.2]} />
				<meshStandardMaterial
					color={
						isOn
							? hovered
								? "#4ade80"
								: "#22c55e" // Green when active
							: hovered
								? "#fbbf24"
								: "#f59e0b" // Orange when inactive
					}
				/>
			</mesh>

			{/* Pivot point visual */}
			{/* <mesh position={[0, 0, 0]}>
				<cylinderGeometry args={[0.2, 0.2, 0.3]} />
				<meshStandardMaterial color="#333" />
			</mesh> */}

			{/* Label */}
			{label && (
				<Html
					position={[0, 0.5, 0]}
					center
					transform
					sprite
					style={{
						color: "white",
						fontSize: "12px",
						userSelect: "none",
						pointerEvents: "none",
					}}
				>
					{label}
				</Html>
			)}
		</group>
	);
}
