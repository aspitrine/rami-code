import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Map as MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
			<div className="max-w-4xl w-full">
				<div className="text-center mb-12">
					<h1 className="text-6xl font-bold text-white mb-4">
						🎮 Game Collection
					</h1>
					<p className="text-xl text-gray-300">
						Choisissez votre jeu et amusez-vous !
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					{/* Rami Code Game */}
					<Link to="/rami" className="group">
						<div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700 hover:border-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
							<div className="text-6xl mb-4 text-center">🎯</div>
							<h2 className="text-3xl font-bold text-white mb-3 text-center">
								Rami Code
							</h2>
							<p className="text-gray-300 mb-6 text-center">
								Manipulez les bits pour atteindre la bonne valeur binaire. Un
								jeu de logique et de calcul !
							</p>
							<div className="flex flex-wrap gap-2 justify-center mb-6">
								<span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
									Binaire
								</span>
								<span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
									Logique
								</span>
								<span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
									3D
								</span>
							</div>
							<Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-bold">
								<Brain className="mr-2" size={20} />
								Jouer à Rami Code
							</Button>
						</div>
					</Link>

					{/* Pathfinding Game */}
					<Link to="/pathfinding" className="group">
						<div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
							<div className="text-6xl mb-4 text-center">🗺️</div>
							<h2 className="text-3xl font-bold text-white mb-3 text-center">
								Pathfinding Game
							</h2>
							<p className="text-gray-300 mb-6 text-center">
								Programmez le chemin à suivre sur une grille pour atteindre la
								destination. Évitez les obstacles !
							</p>
							<div className="flex flex-wrap gap-2 justify-center mb-6">
								<span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
									Programmation
								</span>
								<span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
									Stratégie
								</span>
								<span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
									Puzzle
								</span>
							</div>
							<Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold">
								<MapIcon className="mr-2" size={20} />
								Jouer à Pathfinding
							</Button>
						</div>
					</Link>
				</div>

				<div className="mt-12 text-center text-gray-400 text-sm">
					<p>Développé avec ❤️ en utilisant TanStack Start</p>
				</div>
			</div>
		</div>
	);
}
