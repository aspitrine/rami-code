import { Html } from "@react-three/drei";

interface BinProps {
	position: [number, number, number];
	value: number;
	isTarget?: boolean;
	hideLabel?: boolean;
}

export function Bin({ position, value, isTarget, hideLabel }: BinProps) {
	return (
		<group position={position}>
			{/* Bin Container */}
			<mesh position={[0, -0.5, 0]}>
				<boxGeometry args={[1.8, 1, 1]} />
				<meshStandardMaterial
					color={isTarget ? "#22c55e" : "#3b82f6"}
					transparent
					opacity={0.8}
				/>
			</mesh>

			{/* Label */}
			{!hideLabel && (
				<Html
					position={[0, 0, 0.6]}
					center
					transform
					sprite
					style={{
						color: "white",
						fontSize: "16px",
						fontWeight: "bold",
						userSelect: "none",
						pointerEvents: "none",
					}}
				>
					{value.toString()}
				</Html>
			)}
		</group>
	);
}
