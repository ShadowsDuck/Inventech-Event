import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Save, Box } from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryOptions = [
  { value: "video", label: "Video" },
  { value: "computer", label: "Computer" },
  { value: "audio", label: "Audio" },
  { value: "lighting", label: "Lighting" },
  { value: "cables", label: "Cables" },
];

export default function AddEquipment() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("audio");

  return (
    <>
      <PageHeader
        title="Add Equipment"
        description="Add a new equipment item to the inventory"
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-slate-700"
              onClick={() => navigate({ to: "/equipment" })}
            >
              Cancel
            </Button>

            <Button
              size="add"
              onClick={() => {
                /* TODO: submit */
              }}
            >
              <Save className="h-5 w-5" />
              Save Item
            </Button>
          </div>
        }
      />

      <div className="py-8">
        <div className="mx-auto w-full max-w-[720px]">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base font-extrabold">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Equipment Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldTitle>
                    Equipment Name <span className="text-red-500">*</span>
                  </FieldTitle>
                  <FieldContent>
                    <InputGroup className="h-11 rounded-xl">
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>
                          <Box className="h-4 w-4" />
                        </InputGroupText>
                      </InputGroupAddon>

                      <InputGroupInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Wireless Microphone Set"
                      />
                    </InputGroup>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldTitle>Category</FieldTitle>
                  <FieldContent>
                    <Select value={category}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
