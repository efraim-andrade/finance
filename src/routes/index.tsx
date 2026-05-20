import { createFileRoute } from "@tanstack/react-router";
import { FieldType } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { LabelButton } from "#/components/ui/label-button";
import { SelectField, SelectItem } from "#/components/ui/select-field";
import { Plus, SlidersHorizontal, Star, Tag } from 'lucide-react';

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<p className="mt-4 text-lg text-brand-base">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>

			<div className="flex flex-col gap-4 p-10 mt-10 max-w-150">
				<h2>This is my inputs</h2>

				<Input label="Nome" placeholder="Insira seu nome" />

				<Input
					label="Email"
					type={FieldType.email}
					placeholder="Insira seu email"
					helper="seu email deve estar no formato de email por exemplo mail@gmail.com"
				/>

				<SelectField
					label="Selecione"
					placeholder="Selecione"
					type={FieldType.user}
				>
					<SelectItem value="option1">Option 1</SelectItem>
					<SelectItem value="option2">Option 2</SelectItem>
				</SelectField>
			</div>

			<div className="mt-10">
				<h2 className="text-2xl font-semibold mb-4">Label Buttons</h2>

				<div className="flex flex-col gap-6">
					<div>
						<p className="text-sm text-muted-foreground mb-2">primary (brand)</p>

						<div className="flex flex-wrap gap-2">
							<LabelButton variant="primary" icon={Tag}>
								Filter
							</LabelButton>

							<LabelButton variant="primary" icon={Star}>
								Favorites
							</LabelButton>

							<LabelButton variant="primary">All</LabelButton>
						</div>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-2">secondary (outline)</p>

						<div className="flex flex-wrap gap-2">
							<LabelButton icon={Tag}>Filter</LabelButton>

							<LabelButton icon={Star}>Favorites</LabelButton>

							<LabelButton>Active</LabelButton>
						</div>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-2">sm with icons</p>

						<div className="flex flex-wrap gap-2">
							<LabelButton variant="primary" size="sm" icon={Tag}>
								Tag
							</LabelButton>

							<LabelButton variant="primary" size="sm" icon={Plus}>
								Add
							</LabelButton>

							<LabelButton size="sm" icon={SlidersHorizontal}>
								Settings
							</LabelButton>
						</div>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-2">without icons</p>

						<div className="flex flex-wrap gap-2">
							<LabelButton variant="primary">All</LabelButton>

							<LabelButton variant="primary">Active</LabelButton>

							<LabelButton size="sm">Draft</LabelButton>

							<LabelButton size="sm">Archived</LabelButton>
						</div>
					</div>

					<div>
						<p className="text-sm text-muted-foreground mb-2">disabled</p>

						<div className="flex flex-wrap gap-2">
							<LabelButton variant="primary" icon={Star} disabled>
								Favorites
							</LabelButton>

							<LabelButton size="sm" icon={Plus} disabled>
								Add
							</LabelButton>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
