import { useStore } from "@tanstack/react-store";
import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	pathfindingActions,
	pathfindingStore,
} from "../lib/pathfinding-game-store";
import { Grid } from "./Grid";
import { GridConfig } from "./GridConfig";
import { InstructionInput } from "./InstructionInput";

export function PathfindingGame() {
	// Subscribe to store state
	const gridWidth = useStore(pathfindingStore, (state) => state.gridWidth);
	const gridHeight = useStore(pathfindingStore, (state) => state.gridHeight);
	const obstacleCount = useStore(
		pathfindingStore,
		(state) => state.obstacleCount,
	);
	const startPosition = useStore(
		pathfindingStore,
		(state) => state.startPosition,
	);
	const endPosition = useStore(pathfindingStore, (state) => state.endPosition);
	const currentPosition = useStore(
		pathfindingStore,
		(state) => state.currentPosition,
	);
	const obstacles = useStore(pathfindingStore, (state) => state.obstacles);
	const pathHistory = useStore(pathfindingStore, (state) => state.pathHistory);
	const instructions = useStore(
		pathfindingStore,
		(state) => state.instructions,
	);
	const isPlaying = useStore(pathfindingStore, (state) => state.isPlaying);
	const gameStatus = useStore(pathfindingStore, (state) => state.gameStatus);
	const showResultModal = useStore(
		pathfindingStore,
		(state) => state.showResultModal,
	);

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
			{/* Header */}
			<div className="p-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-20">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold text-white mb-1">
								🎮 Pathfinding Game
							</h1>
							<p className="text-sm text-gray-400">
								Programmez le chemin de 🚀 vers 🏁
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							<GridConfig
								gridWidth={gridWidth}
								gridHeight={gridHeight}
								obstacleCount={obstacleCount}
								onUpdateConfig={pathfindingActions.updateGridConfig}
								disabled={isPlaying}
							/>
							<Button
								type="button"
								onClick={pathfindingActions.resetLevel}
								disabled={isPlaying}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<RotateCcw size={16} />
								Réinitialiser
							</Button>
							<Button
								type="button"
								onClick={pathfindingActions.newLevel}
								disabled={isPlaying}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Sparkles size={16} />
								Nouveau niveau
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-4 overflow-auto">
				<div className="max-w-7xl mx-auto">
					<div className="grid lg:grid-cols-2 gap-6">
						{/* Grid Section */}
						<div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
							<Grid
								width={gridWidth}
								height={gridHeight}
								startPosition={startPosition}
								endPosition={endPosition}
								currentPosition={currentPosition}
								obstacles={obstacles}
								pathHistory={pathHistory}
								isPlaying={isPlaying}
							/>

							{/* Legend */}
							<div className="mt-4 flex flex-wrap gap-3 justify-center text-sm">
								<div className="flex items-center gap-2">
									<span className="text-xl">🚀</span>
									<span className="text-gray-300">Départ</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xl">🏁</span>
									<span className="text-gray-300">Arrivée</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xl">🎯</span>
									<span className="text-gray-300">Position actuelle</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xl">🧱</span>
									<span className="text-gray-300">Obstacle</span>
								</div>
							</div>
						</div>

						{/* Instructions Section */}
						<div className="space-y-4">
							<InstructionInput
								instructions={instructions}
								onAddInstruction={pathfindingActions.addInstruction}
								onRemoveLastInstruction={
									pathfindingActions.removeLastInstruction
								}
								onClearInstructions={pathfindingActions.clearInstructions}
								disabled={isPlaying}
							/>

							{/* Start Button */}
							<Button
								type="button"
								onClick={pathfindingActions.startGame}
								disabled={isPlaying || instructions.length === 0}
								className="w-full h-14 text-lg font-bold gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
							>
								<Play size={24} />
								{isPlaying ? "En cours..." : "Démarrer"}
							</Button>

							{/* Instructions Help */}
							<div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300">
								<h4 className="font-semibold text-white mb-2">
									📖 Comment jouer
								</h4>
								<ul className="space-y-1 list-disc list-inside">
									<li>Utilisez les flèches pour ajouter des instructions</li>
									<li>
										Cliquer plusieurs fois dans la même direction augmente le
										nombre de pas
									</li>
									<li>Évitez les obstacles 🧱 et les bords de la grille</li>
									<li>Atteignez l'arrivée 🏁 pour gagner!</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Result Modal */}
			{showResultModal && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
					<div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border-2 border-slate-700 max-w-md w-full">
						<div className="text-center">
							{gameStatus === "won" ? (
								<>
									<div className="text-6xl mb-4">🎉</div>
									<h2 className="text-3xl font-bold text-green-400 mb-2">
										Victoire !
									</h2>
									<p className="text-gray-300 mb-6">
										Vous avez atteint la destination en{" "}
										{instructions.reduce((sum, inst) => sum + inst.steps, 0)}{" "}
										déplacements !
									</p>
								</>
							) : (
								<>
									<div className="text-6xl mb-4">😢</div>
									<h2 className="text-3xl font-bold text-red-400 mb-2">
										Échec
									</h2>
									<p className="text-gray-300 mb-6">
										Vous avez heurté un obstacle ou dépassé les limites de la
										grille.
									</p>
								</>
							)}

							<div className="flex gap-3">
								<Button
									type="button"
									onClick={() => {
										pathfindingActions.closeModal();
										pathfindingActions.resetLevel();
									}}
									variant="outline"
									className="flex-1"
								>
									Réessayer
								</Button>
								<Button
									type="button"
									onClick={() => {
										pathfindingActions.closeModal();
										pathfindingActions.newLevel();
									}}
									className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
								>
									Nouveau niveau
								</Button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
