import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

import {
	TRANSACTION_TYPE_LABEL,
	categories,
	categoryMeta,
	type Transaction,
} from "./data";

type NewTransactionModalProps = {
	onAdd: (transaction: Transaction) => void;
	children: React.ReactNode;
};

export function NewTransactionModal({
	onAdd,
	children,
}: NewTransactionModalProps) {
	const [open, setOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [value, setValue] = useState("");
	const [type, setType] = useState<"income" | "expense">("expense");
	const [category, setCategory] = useState("");
	const [date, setDate] = useState("");
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!description || !value || !category || !date) return;

		const meta = categoryMeta[category];

		if (!meta) {
			return;
		}

		const normalized = value.includes(",")
			? value.replace(/\./g, "").replace(",", ".")
			: value.replace(/,/g, "");
		const numericValue = Number.parseFloat(normalized);

		if (Number.isNaN(numericValue)) {
			return;
		}

		try {
			const newTransaction: Transaction = {
				id: crypto.randomUUID(),
				description,
				date,
				category,
				categoryVariant: meta.variant,
				iconBg: meta.iconBg,
				iconColor: meta.iconColor,
				Icon: meta.Icon,
				type,
				value: numericValue,
			};

			onAdd(newTransaction);
			setOpen(false);
			resetForm();
		} catch {
			setError("Erro ao criar transação. Tente novamente.");
		}
	};

	const resetForm = () => {
		setDescription("");
		setValue("");
		setType("expense");
		setCategory("");
		setDate("");
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader title="Nova transação" />

					{error && (
						<p className="px-4 pt-2 text-sm text-red-base" role="alert">
							{error}
						</p>
					)}

					<div className="flex flex-col gap-4 py-4">
						<Input
							label="Descrição"
							placeholder="Ex: Jantar no restaurante"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>

						<div className="grid grid-cols-2 gap-4">
							<Input
								label="Valor"
								placeholder="0,00"
								value={value}
								onChange={(e) => setValue(e.target.value)}
								required
							/>

							<Input
								label="Data"
								placeholder="DD/MM/AAAA"
								value={date}
								onChange={(e) => setDate(e.target.value)}
								required
							/>
						</div>

						<div className="flex flex-col gap-1">
							<label
								htmlFor="modal-tipo"
								className="text-xs font-semibold text-foreground"
							>
								Tipo
							</label>

							<Select
								value={type}
								onValueChange={(v) => setType(v as "income" | "expense")}
							>
								<SelectTrigger id="modal-tipo">
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="income">
										{TRANSACTION_TYPE_LABEL.income}
									</SelectItem>
									<SelectItem value="expense">
										{TRANSACTION_TYPE_LABEL.expense}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-1">
							<label
								htmlFor="modal-categoria"
								className="text-xs font-semibold text-foreground"
							>
								Categoria
							</label>

							<Select value={category} onValueChange={setCategory}>
								<SelectTrigger id="modal-categoria">
									<SelectValue placeholder="Selecione" />
								</SelectTrigger>

								<SelectContent>
									{categories.map((cat) => (
										<SelectItem key={cat.value} value={cat.value}>
											{cat.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setOpen(false);
								resetForm();
							}}
						>
							Cancelar
						</Button>

						<Button type="submit">Salvar transação</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
