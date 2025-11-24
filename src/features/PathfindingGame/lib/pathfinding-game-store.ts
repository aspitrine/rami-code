import { Store } from "@tanstack/store";
import type { Direction, Instruction, Position } from "./pathfinding-utils";
import {
	generateObstacles,
	generateRandomPosition,
	getNextPosition,
	isValidPosition,
	positionsEqual,
} from "./pathfinding-utils";

export interface GameState {
	// Grid configuration
	gridWidth: number;
	gridHeight: number;
	obstacleCount: number;

	// Game elements
	startPosition: Position;
	endPosition: Position;
	obstacles: Position[];

	// Player state
	currentPosition: Position;
	pathHistory: Position[];

	// Instructions
	instructions: Instruction[];
	currentInstructionIndex: number;

	// Game status
	isPlaying: boolean;
	gameStatus: "idle" | "playing" | "won" | "lost";
	showResultModal: boolean;
}

const DEFAULT_GRID_WIDTH = 8;
const DEFAULT_GRID_HEIGHT = 8;
const DEFAULT_OBSTACLE_COUNT = 8;

function createInitialLevel(
	width = DEFAULT_GRID_WIDTH,
	height = DEFAULT_GRID_HEIGHT,
	obstacleCount = DEFAULT_OBSTACLE_COUNT,
): Pick<
	GameState,
	"startPosition" | "endPosition" | "obstacles" | "currentPosition"
> {
	const startPosition = generateRandomPosition(width, height);
	const endPosition = generateRandomPosition(width, height, [startPosition]);

	const obstacles = generateObstacles(width, height, obstacleCount, [
		startPosition,
		endPosition,
	]);

	return {
		startPosition,
		endPosition,
		obstacles,
		currentPosition: { ...startPosition },
	};
}

const initialLevel = createInitialLevel();

const initialState: GameState = {
	gridWidth: DEFAULT_GRID_WIDTH,
	gridHeight: DEFAULT_GRID_HEIGHT,
	obstacleCount: DEFAULT_OBSTACLE_COUNT,
	...initialLevel,
	pathHistory: [{ ...initialLevel.startPosition }],
	instructions: [],
	currentInstructionIndex: 0,
	isPlaying: false,
	gameStatus: "idle",
	showResultModal: false,
};

export const pathfindingStore = new Store<GameState>(initialState);

// Actions
export const pathfindingActions = {
	/**
	 * Add an instruction to the queue
	 */
	addInstruction: (direction: Direction, steps = 1) => {
		pathfindingStore.setState((state) => {
			// Check if we can merge with the last instruction
			const lastInstruction = state.instructions[state.instructions.length - 1];
			if (lastInstruction && lastInstruction.direction === direction) {
				return {
					...state,
					instructions: [
						...state.instructions.slice(0, -1),
						{ direction, steps: lastInstruction.steps + steps },
					],
				};
			}

			return {
				...state,
				instructions: [...state.instructions, { direction, steps }],
			};
		});
	},

	/**
	 * Remove the last instruction
	 */
	removeLastInstruction: () => {
		pathfindingStore.setState((state) => ({
			...state,
			instructions: state.instructions.slice(0, -1),
		}));
	},

	/**
	 * Clear all instructions
	 */
	clearInstructions: () => {
		pathfindingStore.setState((state) => ({
			...state,
			instructions: [],
			currentInstructionIndex: 0,
		}));
	},

	/**
	 * Start executing the instructions
	 */
	startGame: () => {
		const state = pathfindingStore.state;
		if (state.instructions.length === 0) return;

		pathfindingStore.setState((state) => ({
			...state,
			isPlaying: true,
			gameStatus: "playing",
			currentPosition: { ...state.startPosition },
			pathHistory: [{ ...state.startPosition }],
			currentInstructionIndex: 0,
		}));

		// Execute instructions step by step
		pathfindingActions.executeNextStep();
	},

	/**
	 * Execute the next movement step (one tile at a time)
	 */
	executeNextStep: () => {
		const state = pathfindingStore.state;

		if (!state.isPlaying || state.gameStatus !== "playing") return;

		const currentInstruction =
			state.instructions[state.currentInstructionIndex];
		if (!currentInstruction) {
			// No more instructions, check if we reached the goal
			pathfindingActions.checkGameEnd();
			return;
		}

		// Get the current step within this instruction
		const stepsCompleted = state.pathHistory.length - 1;
		const instructionStartStep = state.instructions
			.slice(0, state.currentInstructionIndex)
			.reduce((sum, inst) => sum + inst.steps, 0);
		const stepInCurrentInstruction = stepsCompleted - instructionStartStep;

		// If we've completed all steps in current instruction, move to next
		if (stepInCurrentInstruction >= currentInstruction.steps) {
			pathfindingStore.setState((state) => ({
				...state,
				currentInstructionIndex: state.currentInstructionIndex + 1,
			}));
			// Continue with next instruction after a small delay
			setTimeout(() => {
				pathfindingActions.executeNextStep();
			}, 300);
			return;
		}

		// Calculate next position (one tile at a time)
		const nextPos = getNextPosition(
			state.currentPosition,
			currentInstruction.direction,
		);

		// Check if next position is valid
		if (
			!isValidPosition(nextPos, state.gridWidth, state.gridHeight) ||
			state.obstacles.some((obs) => positionsEqual(obs, nextPos))
		) {
			// Game over - hit obstacle or boundary
			pathfindingStore.setState((state) => ({
				...state,
				isPlaying: false,
				gameStatus: "lost",
				showResultModal: true,
			}));
			return;
		}

		// Update position
		pathfindingStore.setState((state) => ({
			...state,
			currentPosition: nextPos,
			pathHistory: [...state.pathHistory, { ...nextPos }],
		}));

		// Continue with next step after animation delay
		setTimeout(() => {
			pathfindingActions.executeNextStep();
		}, 400);
	},

	/**
	 * Check if game is won or lost
	 */
	checkGameEnd: () => {
		const state = pathfindingStore.state;

		if (positionsEqual(state.currentPosition, state.endPosition)) {
			pathfindingStore.setState((state) => ({
				...state,
				isPlaying: false,
				gameStatus: "won",
				showResultModal: true,
			}));
		} else {
			pathfindingStore.setState((state) => ({
				...state,
				isPlaying: false,
				gameStatus: "lost",
				showResultModal: true,
			}));
		}
	},

	/**
	 * Reset the current level
	 */
	resetLevel: () => {
		const state = pathfindingStore.state;
		pathfindingStore.setState({
			...state,
			currentPosition: { ...state.startPosition },
			pathHistory: [{ ...state.startPosition }],
			instructions: [],
			currentInstructionIndex: 0,
			isPlaying: false,
			gameStatus: "idle",
			showResultModal: false,
		});
	},

	/**
	 * Generate a new level
	 */
	newLevel: () => {
		const state = pathfindingStore.state;
		const newLevel = createInitialLevel(
			state.gridWidth,
			state.gridHeight,
			state.obstacleCount,
		);

		pathfindingStore.setState({
			...state,
			...newLevel,
			pathHistory: [{ ...newLevel.startPosition }],
			instructions: [],
			currentInstructionIndex: 0,
			isPlaying: false,
			gameStatus: "idle",
			showResultModal: false,
		});
	},

	/**
	 * Close the result modal
	 */
	closeModal: () => {
		pathfindingStore.setState((state) => ({
			...state,
			showResultModal: false,
		}));
	},

	/**
	 * Update grid configuration
	 */
	updateGridConfig: (width: number, height: number, obstacleCount: number) => {
		const newLevel = createInitialLevel(width, height, obstacleCount);

		pathfindingStore.setState((state) => ({
			...state,
			gridWidth: width,
			gridHeight: height,
			obstacleCount,
			...newLevel,
			pathHistory: [{ ...newLevel.startPosition }],
			instructions: [],
			currentInstructionIndex: 0,
			isPlaying: false,
			gameStatus: "idle",
			showResultModal: false,
		}));
	},
};
