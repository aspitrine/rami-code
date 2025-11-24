import { createFileRoute } from "@tanstack/react-router";
import { PathfindingGame } from "../features/PathfindingGame/components/PathfindingGame";

export const Route = createFileRoute("/pathfinding")({ component: App });

function App() {
	return <PathfindingGame />;
}
