import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Save } from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";

export default function AddEquipment() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const categoryOptions: FilterOption[] = [
    { value: "video", label: "Video" },
    { value: "computer", label: "Computer" },
    { value: "audio", label: "Audio" },
    { value: "lighting", label: "Lighting" },
    { value: "cables", label: "Cables" },
  ];
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
                // TODO: submit
              }}
            >
              <Save className="h-5 w-5" />
              Save Item
            </Button>
          </div>
        }
      />
      <div className="py-8">
        <div className="mx-auto w-full max-w-[620px]">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              <div className="text-lg font-extrabold text-slate-900">
                Equipment Details
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  Equipment Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Microphone Set"
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Category</Label>
                {
                  <FilterMultiSelect
                    title="Category"
                    options={categoryOptions}
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
