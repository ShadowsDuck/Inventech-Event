import { FilterMultiSelect, type FilterOption } from "@/components/ui/filter-multi-select";

type RoleFilterProps = {
  title?: string;
  options: FilterOption[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export const RoleFilter = ({
  title = "Role",
  options,
  selected,
  onChange,
}: RoleFilterProps) => {
  return (
    <FilterMultiSelect
      title={title}
      options={options}
      selected={selected}
      onChange={onChange}
    />
  );
};
