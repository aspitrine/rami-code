import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useStore } from "@tanstack/react-store";
import { Eye, HelpCircle } from "lucide-react";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
	calculatePreviewPath,
	gameActions,
	gameStore,
	getNodeStates,
} from "../../lib/game-store";
import { Button } from "../ui/button";
import { Board } from "./Board";
import { Marble } from "./Marble";
import { PathPreview } from "./PathPreview";

function ResponsiveCamera() {
	const { camera, size } = useThree();

	useEffect(() => {
		if (!(camera instanceof THREE.PerspectiveCamera)) return;

		// Board dimensions to fit
		const targetWidth = 32; // 16 bins * 1.6 + margin
		const targetHeight = 18; // Vertical space + margin

		// Calculate distance needed for height
		// tan(fov/2) = (height/2) / distance
		// distance = (height/2) / tan(fov/2)
		const vFov = (camera.fov * Math.PI) / 180;
		const distHeight = targetHeight / (2 * Math.tan(vFov / 2));

		// Calculate distance needed for width
		// aspect = width / height
		// visibleWidth = visibleHeight * aspect
		// visibleWidth = 2 * distance * tan(fov/2) * aspect
		// distance = visibleWidth / (2 * tan(fov/2) * aspect)
		const aspect = size.width / size.height;
		const distWidth = targetWidth / (2 * Math.tan(vFov / 2) * aspect);

		// Choose the larger distance to ensure both fit
		const finalDist = Math.max(distHeight, distWidth);

		camera.position.z = finalDist;
		camera.updateProjectionMatrix();
	}, [camera, size]);

	return null;
}

export function RamiGame() {
	// Subscribe to store state
	const rowStates = useStore(gameStore, (state) => state.rowStates);
	const pathPoints = useStore(gameStore, (state) => state.pathPoints);
	const isPlaying = useStore(gameStore, (state) => state.isPlaying);
	const targetBin = useStore(gameStore, (state) => state.targetBin);
	const showResultModal = useStore(gameStore, (state) => state.showResultModal);
	const showHelp = useStore(gameStore, (state) => state.showHelp);
	const showPathPreview = useStore(gameStore, (state) => state.showPathPreview);

	// Calculate preview path when needed
	// biome-ignore lint/correctness/useExhaustiveDependencies: rowStates is needed for refresh previewPath
	const previewPath = useMemo(() => {
		if (showPathPreview && !isPlaying) {
			return calculatePreviewPath();
		}
		return null;
	}, [showPathPreview, isPlaying, rowStates]);

	// Helper to determine level from node index
	const getLevel = (index: number) => {
		if (index === 0) return 0;
		if (index <= 2) return 1;
		if (index <= 6) return 2;
		return 3;
	};

	// Derived node states for rendering
	const nodeStates = getNodeStates();

	const handleToggleNode = (index: number) => {
		gameActions.toggleRow(getLevel(index));
	};

	// Show modal when marble lands in bin
	useEffect(() => {
		if (targetBin !== null && !isPlaying) {
			gameActions.finishGame();
		}
	}, [targetBin, isPlaying]);

	return (
		<div className="w-full h-screen bg-slate-900 flex flex-col">
			<div className="p-4 bg-slate-800 text-white z-10">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Rami Code</h1>

					<Button
						type="button"
						onClick={gameActions.startGame}
						disabled={isPlaying}
					>
						{isPlaying ? "En cours" : "Commencer"}
					</Button>
				</div>

				{/* Bottom row: Row Controls - wraps on mobile */}
				<div className="flex flex-wrap gap-4 items-center justify-center">
					<div className="flex flex-col gap-2">
						<div className="flex gap-4 items-center bg-slate-700 p-2 rounded-lg">
							<span className="text-sm font-semibold text-gray-300">Rows:</span>
							{rowStates.map((isOn, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: it's ok here, it's a row number
								<div key={index} className="flex flex-col items-center gap-1">
									<button
										type="button"
										onClick={() => gameActions.toggleRow(index)}
										disabled={isPlaying}
										className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
											isOn
												? "bg-yellow-500 text-black"
												: "bg-slate-600 text-white"
										} ${isPlaying ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-400"}`}
									>
										{isOn ? "1" : "0"}
									</button>
									{showHelp && (
										<span className="text-xs text-gray-400 whitespace-nowrap">
											2^{3 - index} = {2 ** (3 - index)}
										</span>
									)}
								</div>
							))}
							<button
								type="button"
								onClick={gameActions.toggleHelp}
								className={`p-1.5 rounded-full transition-colors ${
									showHelp
										? "bg-blue-500 text-white"
										: "bg-slate-600 text-gray-300 hover:bg-slate-500"
								}`}
								title="Afficher/Masquer l'aide"
							>
								<HelpCircle size={16} />
							</button>
							<button
								type="button"
								onClick={gameActions.togglePathPreview}
								disabled={isPlaying}
								className={`p-1.5 rounded-full transition-colors ${
									showPathPreview
										? "bg-cyan-500 text-white"
										: "bg-slate-600 text-gray-300 hover:bg-slate-500"
								} ${isPlaying ? "opacity-50 cursor-not-allowed" : ""}`}
								title="Afficher/Masquer la prévisualisation du chemin"
							>
								<Eye size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="flex-1">
				<Canvas shadows>
					<PerspectiveCamera makeDefault position={[0, 0, 30]} />
					<ResponsiveCamera />
					<OrbitControls
						enablePan={true}
						enableZoom={true}
						enableRotate={false}
						mouseButtons={{
							LEFT: THREE.MOUSE.PAN,
							MIDDLE: THREE.MOUSE.DOLLY,
							RIGHT: THREE.MOUSE.PAN,
						}}
					/>

					<ambientLight intensity={1} />

					<Board
						nodeStates={nodeStates}
						onToggleNode={handleToggleNode}
						hideLabels={showResultModal}
					/>

					{/* Path Preview */}
					{previewPath && <PathPreview pathPoints={previewPath} />}

					{isPlaying && pathPoints && (
						<Marble
							pathPoints={pathPoints}
							onFinish={() =>
								gameStore.setState((prev) => ({ ...prev, isPlaying: false }))
							}
						/>
					)}

					{/* <gridHelper
						args={[30, 30, 0x444444, 0x222222]}
						rotation={[Math.PI / 2, 0, 0]}
						position={[0, 0, -1]}
					/> */}
				</Canvas>
			</div>

			{/* Result Modal */}
			{showResultModal && targetBin !== null && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-9999">
					<div className="bg-slate-800 rounded-lg p-8 shadow-2xl border-2 border-green-500 max-w-md w-full mx-4">
						<h2 className="text-3xl font-bold text-white mb-4 text-center">
							🎯 Résultat
						</h2>
						<div className="bg-slate-700 rounded-lg p-6 mb-6 space-y-4">
							<div>
								<p className="text-gray-300 text-sm mb-1 text-center">
									Valeur binaire (4 bits)
								</p>
								<p className="text-5xl font-bold text-green-400 text-center font-mono">
									{targetBin.toString(2).padStart(4, "0")}
								</p>
							</div>
							<div className="border-t border-slate-600 pt-4">
								<p className="text-gray-300 text-sm mb-1 text-center">
									Valeur décimale
								</p>
								<p className="text-5xl font-bold text-blue-400 text-center">
									{targetBin}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={gameActions.closeModal}
							className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-white text-lg transition-colors"
						>
							Fermer
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
