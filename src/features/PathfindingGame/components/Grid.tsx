import type { Position } from "../lib/pathfinding-utils";
import { positionsEqual } from "../lib/pathfinding-utils";
import { Player } from "./Player";

interface GridProps {
	width: number;
	height: number;
	startPosition: Position;
	endPosition: Position;
	currentPosition: Position;
	obstacles: Position[];
	pathHistory: Position[];
	isPlaying: boolean;
}

export function Grid({
	width,
	height,
	startPosition,
	endPosition,
	currentPosition,
	obstacles,
	pathHistory,
	isPlaying,
}: GridProps) {
	const getTileType = (x: number, y: number): string => {
		const pos = { x, y };

		// Don't show current position on tile - it's rendered as overlay
		if (positionsEqual(pos, endPosition)) {
			return "end";
		}
		if (positionsEqual(pos, startPosition)) {
			return "start";
		}
		if (obstacles.some((obs) => positionsEqual(obs, pos))) {
			return "obstacle";
		}
		if (pathHistory.some((p) => positionsEqual(p, pos))) {
			return "path";
		}
		return "empty";
	};

	const getTileClasses = (type: string): string => {
		const baseClasses =
			"relative flex items-center justify-center border border-slate-600 transition-all duration-300";

		switch (type) {
			case "end":
				return `${baseClasses} bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50`;
			case "start":
				return `${baseClasses} bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/50`;
			case "obstacle":
				return `${baseClasses} bg-slate-700 shadow-inner`;
			case "path":
				return `${baseClasses} bg-cyan-500/30 border-cyan-400/50`;
			default:
				return `${baseClasses} bg-slate-800 hover:bg-slate-750`;
		}
	};

	const getTileContent = (type: string): string => {
		switch (type) {
			case "end":
				return "🏁";
			case "start":
				return "🚀";
			case "obstacle":
				return "🧱";
			default:
				return "";
		}
	};

	// Calculate tile size based on grid dimensions
	const tileSize = Math.min(60, Math.floor(500 / Math.max(width, height)));

	return (
		<div className="flex items-center justify-center p-4">
			<div className="relative">
				<div
					className="inline-grid gap-0.5 bg-slate-900 p-2 rounded-lg shadow-2xl"
					style={{
						gridTemplateColumns: `repeat(${width}, ${tileSize}px)`,
						gridTemplateRows: `repeat(${height}, ${tileSize}px)`,
					}}
				>
					{Array.from({ length: height }, (_, y) =>
						Array.from({ length: width }, (_, x) => {
							const type = getTileType(x, y);
							return (
								<div
									key={`${x}-${y}`}
									className={getTileClasses(type)}
									style={{
										width: `${tileSize}px`,
										height: `${tileSize}px`,
									}}
								>
									<span className="text-lg">{getTileContent(type)}</span>
									{type === "empty" && (
										<span className="absolute bottom-0.5 right-1 text-[8px] text-slate-600">
											{x},{y}
										</span>
									)}
								</div>
							);
						}),
					)}
				</div>

				{/* Player overlay with smooth animations */}
				<Player
					position={currentPosition}
					tileSize={tileSize}
					isPlaying={isPlaying}
				/>
			</div>
		</div>
	);
}
