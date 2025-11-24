import { createFileRoute } from "@tanstack/react-router";
import { RamiGame } from "../components/game/RamiGame";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return <RamiGame />;
}
