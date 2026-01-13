import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TextFieldProps ={
    label:string;
    placeholder?:string
};

export const TextField = ({label,placeholder}:TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-6">
    <Label htmlFor={field.name}>{label}</Label>
    <Input
      placeholder={placeholder}
      id={field.name}
      value={field.state.value}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
    /></div>
  );
};
