import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { ContactPersonField } from "./contact-person-field";
import { LocationField } from "./location-field";
import { TextField } from "./text-field";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: { TextField, LocationField, ContactPersonField },
  formComponents: {},
  fieldContext,
  formContext,
});
