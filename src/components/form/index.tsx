import { createFormHook,createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { LocationField } from "./location-field";
import { PhoneField } from "./phone-field";

export const {fieldContext,useFieldContext, formContext,useFormContext} = 
createFormHookContexts();

export const {useAppForm} =createFormHook({
 fieldComponents:{TextField,LocationField,PhoneField},
 formComponents:{},
 fieldContext, 
 formContext,
});