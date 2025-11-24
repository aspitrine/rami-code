import { Store } from "@tanstack/store";
import { getBinPosition, getNodePosition } from "./utils";

interface GameState {
	rowStates: boolean[];
	pathPoints: [number, number, number][] | null;
	isPlaying: boolean;
	targetBin: number | null;
	showResultModal: boolean;
	showHelp: boolean;
	showPathPreview: boolean;
}

export const gameStore = new Store<GameState>({
	rowStates: [false, false, false, false],
	pathPoints: null,
	isPlaying: false,
	targetBin: null,
	showResultModal: false,
	showHelp: false,
	showPathPreview: false,
});

// Helper to determine level from node index
function getLevel(index: number): number {
	if (index === 0) return 0;
	if (index <= 2) return 1;
	if (index <= 6) return 2;
	return 3;
}

// Actions
export const gameActions = {
	toggleRow: (level: number) => {
		const state = gameStore.state;
		if (state.isPlaying) return; // Lock interaction during play

		const newRows = [...state.rowStates];
		newRows[level] = !newRows[level];
		gameStore.setState((prev) => ({ ...prev, rowStates: newRows }));
	},

	startGame: () => {
		const state = gameStore.state;
		if (state.isPlaying) return;

		// Calculate the full path
		const points: [number, number, number][] = [];

		// Get root position first
		const rootPos = getNodePosition(0);

		// Start point (high above root for dramatic fall)
		points.push([rootPos[0], 12, 0]);

		// Point just above root (for falling animation)
		points.push([rootPos[0], rootPos[1] + 2, 0]);

		let currentIndex = 0;

		// Add root position - simple pass through
		points.push([rootPos[0], rootPos[1] + 0.5, 0]); // Top of root
		points.push([rootPos[0], rootPos[1] - 0.5, 0]); // Bottom of root

		for (let level = 0; level < 4; level++) {
			const isRight = state.rowStates[level];

			// Determine next index
			const nextIndex = isRight ? 2 * currentIndex + 2 : 2 * currentIndex + 1;

			if (level < 3) {
				const nextPos = getNodePosition(nextIndex);
				points.push([nextPos[0], nextPos[1] + 0.5, 0]); // Top of next node
				points.push([nextPos[0], nextPos[1] - 0.5, 0]); // Bottom of next node

				currentIndex = nextIndex;
			} else {
				// Final level to bin
				const relativeIndex = currentIndex - 7;
				const binIndex = isRight ? 2 * relativeIndex + 1 : 2 * relativeIndex;
				const binPos = getBinPosition(binIndex);

				points.push([binPos[0], binPos[1] + 0.5, 0]); // Top of bin
				points.push(binPos); // Inside bin

				gameStore.setState((prev) => ({ ...prev, targetBin: binIndex }));
			}
		}

		gameStore.setState((prev) => ({
			...prev,
			isPlaying: true,
			pathPoints: points,
			showResultModal: false,
		}));
	},

	finishGame: () => {
		gameStore.setState((prev) => ({
			...prev,
			isPlaying: false,
			showResultModal: true,
		}));
	},

	resetGame: () => {
		gameStore.setState((prev) => ({
			...prev,
			rowStates: [false, false, false, false],
		}));
	},

	closeModal: () => {
		gameStore.setState((prev) => ({ ...prev, showResultModal: false }));
	},

	toggleHelp: () => {
		gameStore.setState((prev) => ({ ...prev, showHelp: !prev.showHelp }));
	},

	togglePathPreview: () => {
		gameStore.setState((prev) => ({
			...prev,
			showPathPreview: !prev.showPathPreview,
		}));
	},
};

// Derived state: node states for rendering
export function getNodeStates(): boolean[] {
	const { rowStates } = gameStore.state;
	return new Array(15).fill(false).map((_, i) => rowStates[getLevel(i)]);
}

// Calculate preview path based on current row states
export function calculatePreviewPath(): [number, number, number][] {
	const { rowStates } = gameStore.state;
	const points: [number, number, number][] = [];

	// Get root position first
	const rootPos = getNodePosition(0);

	// Start from root
	points.push([rootPos[0], rootPos[1], 0]);

	let currentIndex = 0;

	for (let level = 0; level < 4; level++) {
		const isRight = rowStates[level];

		// Determine next index
		const nextIndex = isRight ? 2 * currentIndex + 2 : 2 * currentIndex + 1;

		if (level < 3) {
			const nextPos = getNodePosition(nextIndex);
			points.push([nextPos[0], nextPos[1], 0]);
			currentIndex = nextIndex;
		} else {
			// Final level to bin
			const relativeIndex = currentIndex - 7;
			const binIndex = isRight ? 2 * relativeIndex + 1 : 2 * relativeIndex;
			const binPos = getBinPosition(binIndex);
			points.push(binPos);
		}
	}

	return points;
}
