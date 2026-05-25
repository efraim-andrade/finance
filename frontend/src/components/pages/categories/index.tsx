import { useMutation } from "@apollo/client/react";
import { ArrowUpDown, Plus, Tag, Utensils } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { NewCategoryModal } from "#/components/new-category-modal";
import { PageHeader } from "#/components/page-header";
import { Button } from "#/components/ui/button";
import { SummaryCard } from "#/components/ui/summary-card";
import { useCategories } from "#/hooks/useCategories";
import { categoryIconMap } from "#/lib/category-icons";
import { DELETE_CATEGORY } from "#/services/categories";
import type { CategoryColor, CategoryDetail } from "#/types/dashboard";

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
  const [editingCategory, setEditingCategory] = useState<CategoryDetail | null>(
    null,
  );

  const [doDelete] = useMutation(DELETE_CATEGORY, {
    refetchQueries: ["ListCategories"],
    onCompleted: () => toast.success("Categoria excluída"),
    onError: (err) => toast.error(err.message),
  });

  const mostUsed = stats.mostUsedCategory;
  const MostUsedIcon = categoryIconMap[mostUsed.icon] ?? Utensils;

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
      <PageHeader
        title="Categorias"
        description="Organize suas transações por categorias"
        action={
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nova categoria</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        }
      />

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
            isGlobal={!category.userId}
            onEdit={() => {
              setEditingCategory(category);
              setIsModalOpen(true);
            }}
            onDelete={() => doDelete({ variables: { id: category.id } })}
          />
        ))}
      </div>

      <NewCategoryModal
        key={editingCategory?.id ?? "new"}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingCategory(null);
        }}
        editCategory={editingCategory}
      />
    </div>
  );
}
