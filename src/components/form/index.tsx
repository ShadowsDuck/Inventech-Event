import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { LocationField } from "./location-field";
import { TextField } from "./text-field";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, LocationField },
  formComponents: {},
  fieldContext,
  formContext,
});
