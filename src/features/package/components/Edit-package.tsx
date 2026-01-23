import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Route } from "@/routes/package/$packageId/edit";

import { useEditPackage } from "../api/editPackage";
import { packageByIdQuery } from "../api/getPackageById";
import type { PackageData } from "./package-form";
import PackageForm from "./package-form";

export default function EditPackage() {
  const navigate = useNavigate();

  const { packageId } = Route.useParams();

  //ดึงข้อมูลแพ็คเกจจาก API
  const { data: packageData } = useSuspenseQuery(packageByIdQuery(packageId));
  // เตรียมการบันทึกแก้ไขข้อมูลแพ็คเกจ
  const { mutate, isPending: isSaving } = useEditPackage();
  // เเเปลงข้อมูลจาก Backend ให้เข้ากับฟอร์ม
  const initialValues: PackageData = {
    packageName: packageData.packageName,
    equipmentSets: (packageData.equipmentSets ?? []).map((item) => ({
      equipmentId: String(item.equipmentId),
      equipmentName: item.equipment?.equipmentName || "",
      quantity: item.quantity,
    })),
  };
  // ฟังก์ชันบันทึกข้อมูล

  const handleEditSubmit = (values: PackageData) => {
    const payload = {
      id: packageId,
      equipmentId: Number(packageId),
      packageName: values.packageName,
      equipmentSets: (values.equipmentSets ?? []).map((item) => ({
        equipmentId: String(item.equipmentId),
        equipmentName: item.equipmentName,
        quantity: Number(item.quantity),
      })),
    };
    // ยิง API เพื่ออัปเดตข้อมูล
    mutate(payload, {
      onSuccess: () => {
        // สำเร็จแล้วกลับไปหน้ารายการ
        navigate({ to: "/package", replace: true });
      },
    });
  };

  return (
    // เรียกใช้ Form โดยระบุ mode="edit"
    <PackageForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
