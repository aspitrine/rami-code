import { createFileRoute } from "@tanstack/react-router";
import { RamiGame } from "../features/RamiGame/components/RamiGame";

export const Route = createFileRoute("/rami")({ component: App });

function App() {
	return <RamiGame />;
}
