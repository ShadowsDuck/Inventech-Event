import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

import { ContactPersonField } from "./contact-person-field";
import { DateField } from "./date-field";
import { EquipmentSelectField } from "./equipment-select-field";
import { EventFormatField } from "./event-format-field";
import { LocationField } from "./location-field";
import { MultiSelectField } from "./multiselect-field";
import PackageEventField from "./package-event-field";
import { PasswordField } from "./password-field";
import { PeriodSelectField } from "./period-field";
import StaffAssignmentBuilder from "./resource-manage-form";
import { SelectField } from "./select-field";
import { SelectField2 } from "./select-field-2";
import { SwitchField } from "./switch-field";
import { TextAreaField } from "./text-area";
import { TextField } from "./text-field";
import { TimeField } from "./time-field";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    LocationField,
    ContactPersonField,
    MultiSelectField,
    SwitchField,
    SelectField,
    SelectField2,
    EquipmentSelectField,
    EventFormatField,
    DateField,
    TimeField,
    PeriodSelectField,
    PackageEventField,
    StaffAssignmentBuilder,
    TextAreaField,
    PasswordField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
