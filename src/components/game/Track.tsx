import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

interface TrackProps {
	start: [number, number, number];
	end: [number, number, number];
}

export function Track({ start, end }: TrackProps) {
	const ref = useRef<THREE.Mesh>(null);

	useLayoutEffect(() => {
		if (ref.current) {
			const startVec = new THREE.Vector3(...start);
			const endVec = new THREE.Vector3(...end);
			const direction = new THREE.Vector3().subVectors(endVec, startVec);
			const length = direction.length();

			// Position is midpoint
			const midPoint = new THREE.Vector3()
				.addVectors(startVec, endVec)
				.multiplyScalar(0.5);
			ref.current.position.copy(midPoint);

			// Orientation
			ref.current.lookAt(endVec);
			ref.current.rotateX(Math.PI / 2); // Cylinder is Y-up by default, rotate to align with direction

			// Scale length
			ref.current.scale.set(1, length, 1);
		}
	}, [start, end]);

	return (
		<mesh ref={ref}>
			<cylinderGeometry args={[0.1, 0.1, 1, 8]} />
			<meshStandardMaterial color="#555" />
		</mesh>
	);
}
