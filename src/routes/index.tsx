import { createFileRoute } from "@tanstack/react-router";
import { RamiGame } from "../features/RamiGame/components/RamiGame.tsx";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return <RamiGame />;
}
