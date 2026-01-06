import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Card ,CardContent,CardHeader,CardTitle} from "@/components/ui/card";
import StaffProfileFormFields from "@/components/AddStaffandOutsourceComponent/StaffProfileFormFields";



export default function AddStaff() {
    
    
    const form = useForm({
        defaultValues: {
            avatar: null as File | null,
            fullName: "",
            email: "",
            phone: "",
            roles: [] as string[],
        },
            onSubmit: async ({ value }) => {
                toast("You submitted the following values:", {
                    description: (
                        <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                            <code>{JSON.stringify(value, null, 2)}</code>
                        </pre>
                    ),
                    position: "bottom-right",
                    classNames: { content: "flex flex-col gap-2" },
                    style: {
                        "--border-radius": "calc(var(--radius) + 4px)",
                    } as React.CSSProperties,
                });
            },
        });

return(
    <div className="flex min-h-0 flex-1 flex-col">
            <PageHeader
                title="Add Staff"
                countLabel="Add Staff"
                actions={
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button size="add" type="submit" form="add-staff-form">
                            <Save size={18} strokeWidth={2.5} />
                            Add Staff
                        </Button>
                    </div>
                }
            />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8">
            <Card>
                <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Staff Infomation
              </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id="add-staff-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >                        
                    </form>
                    <StaffProfileFormFields
                        form={form}
                        roleOptions={["Host", "Technician", "Project Manager", "Coordinator"]}
                    />
                </CardContent>
            </Card>
        </div>
    </div>       
     
);
}