import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";

import { NewCategoryModal } from "@/components/new-category-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Tag } from "@/components/ui/tag";
import type { CategorySummary } from "@/types/dashboard";

type CategoriesSectionProps = {
  categories: CategorySummary[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-caption-sm font-medium text-muted-foreground">
          Categorias
        </span>

        <Link underline="hover" className="gap-0.5 text-sm">
          Gerenciar
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="space-y-5 p-6">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-1">
            <Tag variant={category.color}>{category.name}</Tag>

            <span className="flex-1 text-right text-sm text-muted-foreground">
              {category.itemCount} {category.itemCount === 1 ? "item" : "itens"}
            </span>

            <span className="text-sm font-semibold text-foreground">
              {category.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center border-t border-border px-6 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 text-brand-base hover:text-brand-base hover:underline"
        >
          <Plus className="size-4" />
          Nova categoria
        </Button>
      </div>

      <NewCategoryModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </Card>
  );
}
