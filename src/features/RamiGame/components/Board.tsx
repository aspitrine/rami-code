import { getBinPosition, getNodePosition } from "../lib/utils";
import { Bin } from "./Bin";
import { Node } from "./Node";
import { Track } from "./Track";

interface BoardProps {
	nodeStates: boolean[]; // Array of boolean states for each node
	onToggleNode: (index: number) => void;
	hideLabels?: boolean;
}

export function Board({ nodeStates, onToggleNode, hideLabels }: BoardProps) {
	// Helper to calculate node positions
	// Tree has 4 levels of switches (0 to 3)
	// Level 0: 1 node (index 0)
	// Level 1: 2 nodes (indices 1-2)
	// Level 2: 4 nodes (indices 3-6)
	// Level 3: 8 nodes (indices 7-14)
	// Bins: 16 bins

	const levels = 4;

	const renderNodes = () => {
		const nodes = [];
		let index = 0;

		for (let level = 0; level < levels; level++) {
			const nodesInLevel = Math.pow(2, level);

			for (let i = 0; i < nodesInLevel; i++) {
				const currentIndex = index;
				const [x, y, z] = getNodePosition(currentIndex);

				nodes.push(
					<Node
						key={`node-${currentIndex}`}
						position={[x, y, z + 0.1]}
						isOn={nodeStates[currentIndex]}
						onToggle={() => onToggleNode(currentIndex)}
					/>,
				);
				index++;
			}
		}
		return nodes;
	};

	const renderBins = () => {
		const bins = [];
		const binCount = 16;

		for (let i = 0; i < binCount; i++) {
			const [x, y, z] = getBinPosition(i);
			bins.push(
				<Bin
					key={`bin-${i}`}
					position={[x, y, z]}
					value={i}
					hideLabel={hideLabels}
				/>,
			);
		}
		return bins;
	};

	const renderTracks = () => {
		const tracks = [];

		// Connect nodes to children
		// Levels 0 to 2 connect to nodes
		// Level 3 connects to bins

		for (let level = 0; level < levels; level++) {
			const nodesInLevel = Math.pow(2, level);
			const firstIndexInLevel = Math.pow(2, level) - 1;

			for (let i = 0; i < nodesInLevel; i++) {
				const currentIndex = firstIndexInLevel + i;
				const currentPos = getNodePosition(currentIndex);

				// Left child
				const leftChildIndex = 2 * currentIndex + 1;
				let leftChildPos: [number, number, number];

				if (level < levels - 1) {
					leftChildPos = getNodePosition(leftChildIndex);
				} else {
					// Connect to bin
					// We need to map the leaf node index to bin index
					// This is tricky. Let's use a simpler logic for bins.
					// The bins are at y = -2.5
					// We can calculate the x position of the target bin
					// But wait, the bin index depends on the path.
					// Actually, the physical structure is fixed.
					// Left output of node X goes to...

					// Let's use the getBinPosition logic but we need to know WHICH bin.
					// For the last level (level 3, indices 7-14), each node has 2 outputs.
					// Node 7 (leftmost) outputs to Bin 0 and Bin 1?
					// Let's verify the binary tree structure for bins.
					// Root (0) -> L(1), R(2)
					// 1 -> L(3), R(4)
					// ...
					// 7 -> L(Bin 0), R(Bin 1)
					// 8 -> L(Bin 2), R(Bin 3)
					// ...
					// 14 -> L(Bin 14), R(Bin 15)

					// So for level 3 nodes (indices 7-14):
					// Left child is Bin (2 * (currentIndex - 7))
					// Right child is Bin (2 * (currentIndex - 7) + 1)

					const relativeIndex = currentIndex - 7;
					leftChildPos = getBinPosition(2 * relativeIndex);
				}

				tracks.push(
					<Track
						key={`track-${currentIndex}-left`}
						start={[currentPos[0], currentPos[1] - 0.5, 0]} // Start from bottom of node
						end={[leftChildPos[0], leftChildPos[1] + 0.5, 0]} // End at top of child/bin
					/>,
				);

				// Right child
				const rightChildIndex = 2 * currentIndex + 2;
				let rightChildPos: [number, number, number];

				if (level < levels - 1) {
					rightChildPos = getNodePosition(rightChildIndex);
				} else {
					const relativeIndex = currentIndex - 7;
					rightChildPos = getBinPosition(2 * relativeIndex + 1);
				}

				tracks.push(
					<Track
						key={`track-${currentIndex}-right`}
						start={[currentPos[0], currentPos[1] - 0.5, 0]}
						end={[rightChildPos[0], rightChildPos[1] + 0.5, 0]}
					/>,
				);
			}
		}
		return tracks;
	};

	return (
		<group>
			{renderTracks()}
			{renderNodes()}
			{renderBins()}
		</group>
	);
}
