import { createFormHook,createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { LocationField } from "./location-field";

export const {fieldContext,useFieldContext, formContext,useFormContext} = 
createFormHookContexts();

export const {useAppForm} =createFormHook({
 fieldComponents:{TextField,LocationField},
 formComponents:{},
 fieldContext, 
 formContext,
});