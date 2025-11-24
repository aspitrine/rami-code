import { useEffect, useState } from "react";
import type { Position } from "../lib/pathfinding-utils";

interface PlayerProps {
	position: Position;
	tileSize: number;
	isPlaying: boolean;
}

export function Player({ position, tileSize, isPlaying }: PlayerProps) {
	const [displayPosition, setDisplayPosition] = useState(position);

	useEffect(() => {
		// Smooth transition to new position
		setDisplayPosition(position);
	}, [position]);

	return (
		<div
			className="absolute pointer-events-none z-20"
			style={{
				left: `${displayPosition.x * (tileSize + 2) + tileSize / 2}px`,
				top: `${displayPosition.y * (tileSize + 2) + tileSize / 2}px`,
				transform: "translate(-50%, -50%)",
				transition: isPlaying
					? "left 0.4s cubic-bezier(0.4, 0, 0.2, 1), top 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
					: "none",
			}}
		>
			<div
				className={`flex items-center justify-center rounded-full ${
					isPlaying ? "animate-bounce" : ""
				}`}
				style={{
					width: `${tileSize * 0.8}px`,
					height: `${tileSize * 0.8}px`,
					fontSize: `${tileSize * 0.6}px`,
				}}
			>
				🎯
			</div>
		</div>
	);
}
