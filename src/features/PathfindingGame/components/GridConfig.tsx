import { Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GridConfigProps {
	gridWidth: number;
	gridHeight: number;
	obstacleCount: number;
	onUpdateConfig: (
		width: number,
		height: number,
		obstacleCount: number,
	) => void;
	disabled?: boolean;
}

export function GridConfig({
	gridWidth,
	gridHeight,
	obstacleCount,
	onUpdateConfig,
	disabled = false,
}: GridConfigProps) {
	const [showConfig, setShowConfig] = useState(false);
	const [width, setWidth] = useState(gridWidth);
	const [height, setHeight] = useState(gridHeight);
	const [obstacles, setObstacles] = useState(obstacleCount);

	const handleApply = () => {
		onUpdateConfig(width, height, obstacles);
		setShowConfig(false);
	};

	const handleReset = () => {
		setWidth(gridWidth);
		setHeight(gridHeight);
		setObstacles(obstacleCount);
	};

	return (
		<div className="relative">
			<Button
				type="button"
				onClick={() => setShowConfig(!showConfig)}
				disabled={disabled}
				variant="outline"
				size="sm"
				className="gap-2"
			>
				<Settings size={16} />
				Configuration
			</Button>

			{showConfig && (
				<div className="absolute top-full right-0 mt-2 bg-slate-800 rounded-lg p-4 shadow-xl border border-slate-700 z-50 min-w-[280px]">
					<h4 className="text-sm font-semibold text-white mb-3">
						Configuration de la grille
					</h4>

					<div className="space-y-3">
						{/* Width */}
						<div>
							<label
								htmlFor="grid-width"
								className="block text-xs text-gray-300 mb-1"
							>
								Largeur: {width}
							</label>
							<input
								id="grid-width"
								type="range"
								min="4"
								max="15"
								value={width}
								onChange={(e) => setWidth(Number(e.target.value))}
								className="w-full"
							/>
						</div>

						{/* Height */}
						<div>
							<label
								htmlFor="grid-height"
								className="block text-xs text-gray-300 mb-1"
							>
								Hauteur: {height}
							</label>
							<input
								id="grid-height"
								type="range"
								min="4"
								max="15"
								value={height}
								onChange={(e) => setHeight(Number(e.target.value))}
								className="w-full"
							/>
						</div>

						{/* Obstacles */}
						<div>
							<label
								htmlFor="obstacle-count"
								className="block text-xs text-gray-300 mb-1"
							>
								Obstacles: {obstacles}
							</label>
							<input
								id="obstacle-count"
								type="range"
								min="0"
								max={Math.floor((width * height) / 3)}
								value={obstacles}
								onChange={(e) => setObstacles(Number(e.target.value))}
								className="w-full"
							/>
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						<Button
							type="button"
							onClick={handleApply}
							size="sm"
							className="flex-1"
						>
							Appliquer
						</Button>
						<Button
							type="button"
							onClick={handleReset}
							variant="outline"
							size="sm"
							className="flex-1"
						>
							Annuler
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
