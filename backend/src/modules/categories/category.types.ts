export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  color: string;
  icon: string;
  userId?: string;
};

export type UpdateCategoryInput = {
  name?: string;
  description?: string | null;
  color?: string;
  icon?: string;
};
