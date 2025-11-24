import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

interface PathPreviewProps {
	pathPoints: [number, number, number][];
}

export function PathPreview({ pathPoints }: PathPreviewProps) {
	// Convert path points to Vector3 for the Line component
	const points = useMemo(() => {
		return pathPoints.map((p) => {
			const vec = new THREE.Vector3(...p);
			vec.z += 0.3; // Offset on Z axis for better visibility
			return vec;
		});
	}, [pathPoints]);

	if (points.length < 2) return null;

	return (
		<Line
			points={points}
			color="#00FFFF" // Cyan color for preview
			lineWidth={8}
			opacity={0.6}
			transparent
			dashed
			dashScale={2}
			dashSize={0.5}
			gapSize={0.3}
		/>
	);
}
