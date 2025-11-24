export type Direction = "up" | "down" | "left" | "right";

export interface Position {
	x: number;
	y: number;
}

export interface Instruction {
	direction: Direction;
	steps: number;
}

/**
 * Check if a position is within grid bounds
 */
export function isValidPosition(
	pos: Position,
	gridWidth: number,
	gridHeight: number,
): boolean {
	return pos.x >= 0 && pos.x < gridWidth && pos.y >= 0 && pos.y < gridHeight;
}

/**
 * Get the next position based on direction
 */
export function getNextPosition(pos: Position, direction: Direction): Position {
	switch (direction) {
		case "up":
			return { x: pos.x, y: pos.y - 1 };
		case "down":
			return { x: pos.x, y: pos.y + 1 };
		case "left":
			return { x: pos.x - 1, y: pos.y };
		case "right":
			return { x: pos.x + 1, y: pos.y };
	}
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}

/**
 * Generate random position within grid bounds
 */
export function generateRandomPosition(
	gridWidth: number,
	gridHeight: number,
	excludePositions: Position[] = [],
): Position {
	let pos: Position;
	let attempts = 0;
	const maxAttempts = 100;

	do {
		pos = {
			x: Math.floor(Math.random() * gridWidth),
			y: Math.floor(Math.random() * gridHeight),
		};
		attempts++;
	} while (
		attempts < maxAttempts &&
		excludePositions.some((p) => positionsEqual(p, pos))
	);

	return pos;
}

/**
 * Generate random obstacles
 */
export function generateObstacles(
	gridWidth: number,
	gridHeight: number,
	count: number,
	excludePositions: Position[],
): Position[] {
	const obstacles: Position[] = [];

	for (let i = 0; i < count; i++) {
		const obstacle = generateRandomPosition(gridWidth, gridHeight, [
			...excludePositions,
			...obstacles,
		]);
		obstacles.push(obstacle);
	}

	return obstacles;
}

/**
 * Calculate Manhattan distance between two positions
 */
export function manhattanDistance(pos1: Position, pos2: Position): number {
	return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

/**
 * Get direction label in French
 */
export function getDirectionLabel(direction: Direction): string {
	const labels: Record<Direction, string> = {
		up: "Haut",
		down: "Bas",
		left: "Gauche",
		right: "Droite",
	};
	return labels[direction];
}

/**
 * Get direction icon/arrow
 */
export function getDirectionArrow(direction: Direction): string {
	const arrows: Record<Direction, string> = {
		up: "↑",
		down: "↓",
		left: "←",
		right: "→",
	};
	return arrows[direction];
}
