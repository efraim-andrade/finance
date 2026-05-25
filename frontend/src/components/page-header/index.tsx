import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-heading-md font-bold text-foreground">{title}</h1>

        <p className="text-body-md text-muted-foreground">{description}</p>
      </div>

      {action}
    </div>
  );
}

export { PageHeader };
