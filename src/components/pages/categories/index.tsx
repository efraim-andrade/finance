import { ArrowUpDown, Tag, UserRoundPlus } from "lucide-react";
import { useMemo, useState } from "react";

import { NewCategoryModal } from "@/components/new-category-modal";
import { SummaryCard } from "@/components/ui/summary-card";
import { useCategories } from "@/hooks/useCategories";
import { categoryIconMap } from "@/lib/category-icons";
import type { CategoryColor } from "@/types/dashboard";

import { CategoryCard } from "./category-card";

const summaryIconColorMap: Record<CategoryColor, string> = {
	gray: "text-gray-700 dark:text-gray-200",
	blue: "text-blue-base dark:text-blue-light",
	purple: "text-purple-base dark:text-purple-light",
	pink: "text-pink-base dark:text-pink-light",
	red: "text-red-base dark:text-red-light",
	orange: "text-orange-base dark:text-orange-light",
	yellow: "text-yellow-base dark:text-yellow-light",
	green: "text-green-base dark:text-green-light",
};

export function CategoriesPage() {
	const { categories, stats, isLoading } = useCategories();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const mostUsed = stats.mostUsedCategory;
	const MostUsedIcon = categoryIconMap[mostUsed.icon];

	const summaryCards = useMemo(
		() => [
			{
				icon: Tag,
				iconColor: "text-gray-700 dark:text-gray-200",
				label: "total de categorias",
				value: String(stats.totalCategories),
			},
			{
				icon: ArrowUpDown,
				iconColor: "text-purple-base dark:text-purple-light",
				label: "total de transações",
				value: String(stats.totalItems),
			},
			{
				icon: MostUsedIcon,
				iconColor: summaryIconColorMap[mostUsed.color],
				label: "categoria mais utilizada",
				value: mostUsed.name,
			},
		],
		[stats, mostUsed, MostUsedIcon],
	);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-8">
				<p className="text-muted-foreground">Carregando...</p>
			</div>
		);
	}

	return (
		<div className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-4 md:gap-8 md:p-12">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-0.5">
					<h1 className="text-2xl font-bold text-foreground">Categorias</h1>

					<p className="hidden text-base text-muted-foreground sm:block">
						Organize suas transações por categorias
					</p>
				</div>

				<button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand-base px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
				>
					<UserRoundPlus className="size-4" />
					<span className="hidden sm:inline">Nova categoria</span>
				</button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
				{summaryCards.map(({ icon, iconColor, label, value }) => (
					<SummaryCard
						key={label}
						icon={icon}
						iconColor={iconColor}
						label={label}
						value={value}
					/>
				))}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
				{categories.map((category) => (
					<CategoryCard
						key={category.id}
						name={category.name}
						description={category.description}
						icon={category.icon}
						color={category.color}
						itemCount={category.itemCount}
					/>
				))}
			</div>

			<NewCategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
		</div>
	);
}
