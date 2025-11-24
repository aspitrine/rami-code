export const LEVELS = 4;
export const VERTICAL_SPACING = 2.5;
export const BIN_SPACING = 1.6;

export function getNodePosition(index: number): [number, number, number] {
	// Determine level of the node
	let level = 0;
	if (index >= 1) level = 1;
	if (index >= 3) level = 2;
	if (index >= 7) level = 3;

	// Calculate horizontal spacing based on bin spacing
	// Level 3 (bottom) nodes are above 2 bins each.
	// The distance between two adjacent nodes at level L should be enough to cover their children.
	// At level 3, spacing is 2 * BIN_SPACING
	// At level 2, spacing is 4 * BIN_SPACING
	// At level L, spacing is 2^(3-L) * 2 * BIN_SPACING = 2^(4-L) * BIN_SPACING

	const spacingAtLevel = Math.pow(2, 4 - level) * BIN_SPACING;

	// Calculate index within the level (0 to nodesInLevel - 1)
	const firstIndexInLevel = Math.pow(2, level) - 1;
	const indexInLevel = index - firstIndexInLevel;
	const nodesInLevel = Math.pow(2, level);

	const x = (indexInLevel - (nodesInLevel - 1) / 2) * spacingAtLevel;
	const y = (LEVELS - 1 - level) * VERTICAL_SPACING;

	return [x, y, 0];
}

export function getBinPosition(index: number): [number, number, number] {
	const binCount = 16;
	const y = -2.5;

	const x = (index - (binCount - 1) / 2) * BIN_SPACING;
	return [x, y, 0];
}
