import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Pencil, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldType } from "@/components/ui/field";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { LabelButton } from "@/components/ui/label-button";
import { Link } from "@/components/ui/link";
import { PaginationButton } from "@/components/ui/pagination-button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from "@/components/ui/tag";
import { TransactionType } from "@/components/ui/transaction-type";

export const Route = createFileRoute("/ui")({
	component: UiExamplePage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="space-y-4">
			<h2 className="text-heading-md font-semibold text-foreground">{title}</h2>

			{children}
		</section>
	);
}

function VariantRow({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-28 shrink-0 text-caption-sm text-muted-foreground">{label}</span>

			<div className="flex flex-wrap items-center gap-3">{children}</div>
		</div>
	);
}

function UiExamplePage() {
	return (
		<main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-12 bg-background p-8 text-foreground">
			<div>
				<h1 className="text-display-lg font-bold text-foreground">UI Components</h1>

				<p className="text-body-lg text-muted-foreground">
					Example page showcasing all UI components in the design system.
				</p>
			</div>

			{/* ─── Button ─── */}
			<Section title="Button">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>Default shadcn/ui button with all variants and sizes.</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Default">
							<Button>Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="link">Link</Button>
						</VariantRow>

						<VariantRow label="Sizes">
							<Button size="sm">Small</Button>
							<Button size="default">Default</Button>
							<Button size="lg">Large</Button>
						</VariantRow>

						<VariantRow label="States">
							<Button disabled>Disabled</Button>
							<Button>
								<Plus />
								With Icon
							</Button>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── LabelButton ─── */}
			<Section title="LabelButton">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>Label button with icon support, built on top of Button.</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Variants">
							<LabelButton>Outline (default)</LabelButton>
							<LabelButton variant="primary">Solid</LabelButton>
						</VariantRow>

						<VariantRow label="With icon">
							<LabelButton icon={Plus}>Add</LabelButton>
							<LabelButton icon={Pencil} variant="primary">Edit</LabelButton>
						</VariantRow>

						<VariantRow label="Sizes">
							<LabelButton size="sm">Small</LabelButton>
							<LabelButton size="md">Medium</LabelButton>
						</VariantRow>

						<VariantRow label="States">
							<LabelButton disabled>Disabled</LabelButton>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── IconButton ─── */}
			<Section title="IconButton">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>
							Icon-only button (32×32). Use for actions like delete, edit, add.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Outline">
							<IconButton aria-label="Edit"><Pencil /></IconButton>
							<IconButton aria-label="Add"><Plus /></IconButton>
							<IconButton aria-label="Delete"><Trash /></IconButton>
						</VariantRow>

						<VariantRow label="Danger">
							<IconButton variant="danger" aria-label="Delete"><Trash /></IconButton>
						</VariantRow>

						<VariantRow label="States">
							<IconButton disabled aria-label="Disabled"><Trash /></IconButton>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── Link ─── */}
			<Section title="Link">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>
							Brand-colored text link. Supports underline behavior and asChild for use with router links.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Hover (default)">
							<Link href="#">
								<ArrowLeft className="size-4" />
								Voltar
							</Link>
							<Link href="#">
								Ver mais
								<ArrowRight className="size-4" />
							</Link>
						</VariantRow>

						<VariantRow label="Always underline">
							<Link href="#" underline="always">Link sublinhado</Link>
						</VariantRow>

						<VariantRow label="Never underline">
							<Link href="#" underline="never">Sem sublinhado</Link>
						</VariantRow>

						<VariantRow label="With asChild">
							<Link asChild>
								<button type="button">Button as link</button>
							</Link>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── PaginationButton ─── */}
			<Section title="PaginationButton">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>
							Pagination page number button (32×32). Default, active, and disabled states.
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Example">
							<PaginationButton>1</PaginationButton>
							<PaginationButton variant="active">2</PaginationButton>
							<PaginationButton>3</PaginationButton>
							<PaginationButton>4</PaginationButton>
							<PaginationButton disabled>5</PaginationButton>
						</VariantRow>

						<VariantRow label="States">
							<PaginationButton>Default</PaginationButton>
							<PaginationButton variant="active">Active</PaginationButton>
							<PaginationButton disabled>Disabled</PaginationButton>
						</VariantRow>

						<VariantRow label="With asChild">
							<PaginationButton asChild>
								<a href="/page/2">2</a>
							</PaginationButton>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── Tag ─── */}
			<Section title="Tag">
				<Card>
					<CardHeader>
						<CardTitle>Color variants</CardTitle>

						<CardDescription>Pill-shaped tag with 8 color categories.</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="All colors">
							<Tag variant="gray">Gray</Tag>
							<Tag variant="blue">Blue</Tag>
							<Tag variant="purple">Purple</Tag>
							<Tag variant="pink">Pink</Tag>
							<Tag variant="red">Red</Tag>
							<Tag variant="orange">Orange</Tag>
							<Tag variant="yellow">Yellow</Tag>
							<Tag variant="green">Green</Tag>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── TransactionType ─── */}
			<Section title="TransactionType">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>Income/expense indicator with icon and label.</CardDescription>
					</CardHeader>

					<CardContent className="space-y-3">
						<VariantRow label="Income">
							<TransactionType>Entrada</TransactionType>
						</VariantRow>

						<VariantRow label="Expense">
							<TransactionType variant="expense">Saída</TransactionType>
						</VariantRow>
					</CardContent>
				</Card>
			</Section>

			{/* ─── Field + Input ─── */}
			<Section title="Field + Input">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>Form field with label, icon, and input.</CardDescription>
					</CardHeader>

					<CardContent className="max-w-sm space-y-4">
						<Field label="E-mail" type={FieldType.email}>
							<Input type={FieldType.email} placeholder="mail@exemplo.com" />
						</Field>

						<Field label="Senha" type={FieldType.password}>
							<Input type={FieldType.password} placeholder="••••••••" />
						</Field>

						<Field label="Nome" type={FieldType.user}>
							<Input type={FieldType.text} placeholder="Seu nome" />
						</Field>
					</CardContent>
				</Card>
			</Section>

			{/* ─── Select ─── */}
			<Section title="Select">
				<Card>
					<CardHeader>
						<CardTitle>Variants</CardTitle>

						<CardDescription>Radix-based select component.</CardDescription>
					</CardHeader>

					<CardContent className="max-w-sm space-y-3">
						<Select defaultValue="option-1">
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectItem value="option-1">Option 1</SelectItem>
									<SelectItem value="option-2">Option 2</SelectItem>
									<SelectItem value="option-3">Option 3</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</Section>

			{/* ─── Card ─── */}
			<Section title="Card">
				<Card>
					<CardHeader>
						<CardTitle>Card Title</CardTitle>

						<CardDescription>Card description goes here.</CardDescription>
					</CardHeader>

					<CardContent>
						<p className="text-body-md text-muted-foreground">
							Card content with body text. This is a sample card showing the shadcn/ui card
							component with header, content, and footer sections.
						</p>
					</CardContent>

					<CardFooter>
						<Button>Action</Button>
						<Button variant="outline">Cancel</Button>
					</CardFooter>
				</Card>
			</Section>
		</main>
	);
}
