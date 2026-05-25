import { Search } from "lucide-react";

import { useCategoryOptions } from "#/hooks/useCategoryOptions";
import { Field } from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type FiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  periodFilter: string;
  onPeriodFilterChange: (value: string) => void;
  periodOptions: { label: string; value: string }[];
};

const typeOptions = [
  { label: "Todos", value: "all" },
  { label: "Entrada", value: "INCOME" },
  { label: "Saída", value: "EXPENSE" },
];

export function Filters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  periodFilter,
  onPeriodFilterChange,
  periodOptions,
}: FiltersProps) {
  const categoryOptions = useCategoryOptions();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field label="Buscar">
        <Search className="absolute left-2 size-4 text-muted-foreground" />

        <input
          type="text"
          placeholder="Buscar por descrição"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent pl-8 text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-tipo"
          className="text-xs font-semibold text-foreground"
        >
          Tipo
        </label>

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger id="filter-tipo">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>

          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-categoria"
          className="text-xs font-semibold text-foreground"
        >
          Categoria
        </label>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger id="filter-categoria">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>

            {categoryOptions.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-periodo"
          className="text-xs font-semibold text-foreground"
        >
          Período
        </label>

        <Select value={periodFilter} onValueChange={onPeriodFilterChange}>
          <SelectTrigger id="filter-periodo">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>

          <SelectContent>
            {periodOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
