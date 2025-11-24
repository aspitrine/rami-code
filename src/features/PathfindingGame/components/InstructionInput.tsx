import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	Trash2,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Direction, Instruction } from "../lib/pathfinding-utils";
import { getDirectionArrow, getDirectionLabel } from "../lib/pathfinding-utils";

interface InstructionInputProps {
	instructions: Instruction[];
	onAddInstruction: (direction: Direction) => void;
	onRemoveLastInstruction: () => void;
	onClearInstructions: () => void;
	disabled?: boolean;
}

export function InstructionInput({
	instructions,
	onAddInstruction,
	onRemoveLastInstruction,
	onClearInstructions,
	disabled = false,
}: InstructionInputProps) {
	return (
		<div className="bg-slate-800 rounded-lg p-4 space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold text-white">Instructions</h3>
				{instructions.length > 0 && (
					<Button
						type="button"
						onClick={onClearInstructions}
						disabled={disabled}
						variant="destructive"
						size="sm"
						className="gap-2"
					>
						<Trash2 size={16} />
						Effacer tout
					</Button>
				)}
			</div>

			{/* Direction Buttons */}
			<div className="grid grid-cols-3 gap-2">
				{/* Up button - centered in first row */}
				<div />
				<Button
					type="button"
					onClick={() => onAddInstruction("up")}
					disabled={disabled}
					className="h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold"
				>
					<ArrowUp size={24} />
				</Button>
				<div />

				{/* Left, Down, Right buttons in second row */}
				<Button
					type="button"
					onClick={() => onAddInstruction("left")}
					disabled={disabled}
					className="h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold"
				>
					<ArrowLeft size={24} />
				</Button>
				<Button
					type="button"
					onClick={() => onAddInstruction("down")}
					disabled={disabled}
					className="h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold"
				>
					<ArrowDown size={24} />
				</Button>
				<Button
					type="button"
					onClick={() => onAddInstruction("right")}
					disabled={disabled}
					className="h-16 bg-blue-600 hover:bg-blue-700 text-white font-bold"
				>
					<ArrowRight size={24} />
				</Button>
			</div>

			{/* Instruction Queue Display */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h4 className="text-sm font-medium text-gray-300">
						File d'instructions ({instructions.length})
					</h4>
					{instructions.length > 0 && (
						<Button
							type="button"
							onClick={onRemoveLastInstruction}
							disabled={disabled}
							variant="outline"
							size="sm"
							className="gap-1 h-7 px-2"
						>
							<X size={14} />
							Retirer
						</Button>
					)}
				</div>

				{instructions.length === 0 ? (
					<div className="text-center py-4 text-gray-500 text-sm">
						Ajoutez des instructions en cliquant sur les flèches
					</div>
				) : (
					<div className="flex flex-wrap gap-2">
						{instructions.map((instruction, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: index is stable during render
								key={index}
								className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded-lg border border-slate-600"
							>
								<span className="text-2xl">
									{getDirectionArrow(instruction.direction)}
								</span>
								<div className="flex flex-col">
									<span className="text-xs text-gray-400">
										{getDirectionLabel(instruction.direction)}
									</span>
									<span className="text-sm font-bold text-white">
										×{instruction.steps}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Summary */}
			{instructions.length > 0 && (
				<div className="text-xs text-gray-400 text-center">
					Total: {instructions.reduce((sum, inst) => sum + inst.steps, 0)}{" "}
					déplacements
				</div>
			)}
		</div>
	);
}
