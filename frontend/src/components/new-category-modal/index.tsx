import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { COLOR_OPTIONS, ICON_OPTIONS } from "#/lib/category-form-data";
import { cn } from "#/lib/utils";
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "#/services/categories";
import type { CategoryDetail } from "#/types/dashboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type NewCategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editCategory?: CategoryDetail | null;
};

export function NewCategoryModal({
  open,
  onOpenChange,
  editCategory,
}: NewCategoryModalProps) {
  const [title, setTitle] = useState(editCategory?.name ?? "");
  const [description, setDescription] = useState(
    editCategory?.description ?? "",
  );
  const [selectedIcon, setSelectedIcon] = useState<string>(
    editCategory?.icon ?? "briefcase",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    editCategory?.color ?? "green",
  );

  const isEditing = !!editCategory;

  const [doCreate, { loading: createLoading }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: ["ListCategories"],
  });

  const [doUpdate, { loading: updateLoading }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: ["ListCategories"],
  });

  const loading = createLoading || updateLoading;

  const resetForm = () => {
    if (!isEditing) {
      setTitle("");
      setDescription("");
      setSelectedIcon("briefcase");
      setSelectedColor("green");
    }
  };

  const handleSave = async () => {
    if (!title.trim() || loading) {
      return;
    }

    if (isEditing) {
      await doUpdate({
        variables: {
          id: editCategory.id,
          input: {
            name: title.trim(),
            description: description || null,
            color: selectedColor,
            icon: selectedIcon,
          },
        },
      });
    } else {
      await doCreate({
        variables: {
          input: {
            name: title.trim(),
            description: description || null,
            color: selectedColor,
            icon: selectedIcon,
          },
        },
      });
    }

    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader
          title={isEditing ? "Editar categoria" : "Nova categoria"}
          description={
            isEditing
              ? "Altere as informações da categoria"
              : "Organize suas transações com categorias"
          }
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
            disabled={loading}
          >
            {isEditing ? "Salvar alterações" : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
