import type { LucideIcon } from "lucide-react";
import {
	BaggageClaim,
	BookOpen,
	BriefcaseBusiness,
	CarFront,
	Dumbbell,
	Gift,
	HeartPulse,
	House,
	Mailbox,
	PawPrint,
	PiggyBank,
	ReceiptText,
	ShoppingCart,
	Ticket,
	Utensils,
	Wrench,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ICON_OPTIONS: { key: string; icon: LucideIcon }[] = [
	{ key: "briefcase", icon: BriefcaseBusiness },
	{ key: "car", icon: CarFront },
	{ key: "heart", icon: HeartPulse },
	{ key: "piggy", icon: PiggyBank },
	{ key: "cart", icon: ShoppingCart },
	{ key: "ticket", icon: Ticket },
	{ key: "wrench", icon: Wrench },
	{ key: "utensils", icon: Utensils },
	{ key: "paw", icon: PawPrint },
	{ key: "house", icon: House },
	{ key: "gift", icon: Gift },
	{ key: "dumbbell", icon: Dumbbell },
	{ key: "book", icon: BookOpen },
	{ key: "baggage", icon: BaggageClaim },
	{ key: "mailbox", icon: Mailbox },
	{ key: "receipt", icon: ReceiptText },
];

const COLOR_OPTIONS = [
	{ key: "green", color: "#16a34a" },
	{ key: "blue", color: "#2563eb" },
	{ key: "purple", color: "#9333ea" },
	{ key: "pink", color: "#db2777" },
	{ key: "red", color: "#dc2626" },
	{ key: "orange", color: "#ea580c" },
	{ key: "yellow", color: "#ca8a04" },
];

type NewCategoryModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function NewCategoryModal({
	open,
	onOpenChange,
}: NewCategoryModalProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("briefcase");
	const [selectedColor, setSelectedColor] = useState("green");

	const handleSave = () => {
		if (!title.trim()) {
			return;
		}

		// TODO: create category via Apollo mutation
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader
					title="Nova categoria"
					description="Organize suas transações com categorias"
				/>

				<div className="flex flex-col gap-4">
					<Input
						label="Título"
						placeholder="Ex. Alimentação"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<Input
						label="Descrição"
						placeholder="Descrição da categoria"
						helper="Opcional"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>

					<div className="flex flex-col gap-2">
						<span className="text-sm font-medium text-gray-700">Ícone</span>

						<div className="flex flex-wrap gap-2">
							{ICON_OPTIONS.map(({ key, icon: Icon }) => (
								<button
									key={key}
									type="button"
									onClick={() => setSelectedIcon(key)}
									className={cn(
										"flex size-10.5 items-center justify-center rounded-lg border transition-colors",
										selectedIcon === key
											? "border-brand-base bg-gray-50 text-gray-700"
											: "border-gray-300 bg-transparent text-gray-400 hover:border-gray-400",
									)}
								>
									<Icon className="size-5" />
								</button>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<span className="text-sm font-medium text-gray-700">Cor</span>

						<div className="flex flex-wrap gap-2">
							{COLOR_OPTIONS.map(({ key, color }) => (
								<button
									key={key}
									type="button"
									onClick={() => setSelectedColor(key)}
									className={cn(
										"flex w-12 items-center justify-center rounded-sm border p-1 transition-colors",
										selectedColor === key
											? "border-brand-base bg-gray-50"
											: "border-gray-300 bg-transparent hover:border-gray-400",
									)}
								>
									<div
										className="h-5 w-full rounded-sm"
										style={{ backgroundColor: color }}
									/>
								</button>
							))}
						</div>
					</div>
				</div>

				<DialogFooter className="sm:flex-col">
					<Button
						type="button"
						size="lg"
						className="w-full"
						onClick={handleSave}
					>
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
