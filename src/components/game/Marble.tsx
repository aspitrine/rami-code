import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface MarbleProps {
	pathPoints: [number, number, number][];
	onFinish?: () => void;
}

export function Marble({ pathPoints, onFinish }: MarbleProps) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [progress, setProgress] = useState(0);
	const [velocity, setVelocity] = useState(0);
	const [trace, setTrace] = useState<THREE.Vector3[]>([]);

	// Create curve from points
	const curve = useMemo(() => {
		if (!pathPoints || pathPoints.length < 2) return null;
		const vectors = pathPoints.map((p) => new THREE.Vector3(...p));
		return new THREE.CatmullRomCurve3(vectors, false, "catmullrom", 0.5);
	}, [pathPoints]);

	useFrame((_, delta) => {
		if (meshRef.current && curve) {
			const currentPoint = curve.getPointAt(progress);
			const y = currentPoint.y;

			// Detect if we're in a bounce phase (moving upward after hitting a node)
			// Slow down significantly during bounces, accelerate slowly otherwise
			let targetSpeed = 0.3; // Base speed

			// If Y position is high (bouncing), slow down dramatically
			if (y > -0.5) {
				// Very slow during bounces - this makes the bounces visible and realistic
				targetSpeed = 0.15;
			} else if (y < -2) {
				targetSpeed = 0.5; // Faster when falling from height
			}

			// Smooth velocity transition with stronger damping for smoother transitions
			const damping = 0.85; // Lower damping = smoother transitions
			const newVelocity = velocity * damping + targetSpeed * (1 - damping);
			const newProgress = Math.min(progress + newVelocity * delta, 1);

			setVelocity(newVelocity);

			if (newProgress < 1) {
				setProgress(newProgress);
				const point = curve.getPointAt(newProgress);
				meshRef.current.position.copy(point);

				// Add point to trace with Z offset for visibility
				// Optimization: only add if distance is significant to avoid too many points
				if (
					trace.length === 0 ||
					point.distanceTo(trace[trace.length - 1]) > 0.1
				) {
					const tracePoint = point.clone();
					tracePoint.z += 0.2; // Elevate trace above track
					setTrace((prev) => [...prev, tracePoint]);
				}
			} else if (progress < 1) {
				// Ensure we hit the exact end
				setProgress(1);
				const point = curve.getPointAt(1);
				meshRef.current.position.copy(point);

				const tracePoint = point.clone();
				tracePoint.z += 0.2;
				setTrace((prev) => [...prev, tracePoint]);

				if (onFinish) onFinish();
			}
		}
	});

	if (!pathPoints || pathPoints.length === 0) return null;

	return (
		<group>
			<mesh ref={meshRef} position={pathPoints[0]}>
				<sphereGeometry args={[0.5, 32, 32]} />
				<meshStandardMaterial color="#FF0000" />
			</mesh>
			{trace.length > 1 && (
				<Line
					points={trace}
					color="#FFD700"
					lineWidth={10}
					opacity={0.8}
					transparent
				/>
			)}
		</group>
	);
}
