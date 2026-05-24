import { Link } from "@tanstack/react-router";
import { ChevronRight, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { CategorySummary } from "@/types/dashboard";

type CategoriesSectionProps = {
  categories: CategorySummary[];
};

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <span className="text-caption-sm font-medium text-muted-foreground">
          Categorias
        </span>

        <Link
          to="/app/categorias"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-base transition-all outline-none hover:underline focus-visible:underline"
        >
          Gerenciar
          <ChevronRight className="size-4" />
        </Link>
      </div>

      <div className="space-y-5 p-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="flex items-center gap-1">
              <Tag variant={category.color}>{category.name}</Tag>

              <span className="flex-1 text-right text-sm text-muted-foreground">
                {category.itemCount}{" "}
                {category.itemCount === 1 ? "item" : "itens"}
              </span>

              <span className="text-sm font-semibold text-foreground">
                {category.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          ))
        ) : (
          <EmptyState
            icon={FolderOpen}
            title="Nenhuma categoria"
            description="Crie categorias para organizar suas transações"
            action={
              <Link to="/app/categorias">
                <Button size="sm" className="gap-1.5">
                  Gerenciar categorias
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </Card>
  );
}
