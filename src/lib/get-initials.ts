export const getInitials = (fullName: string) => {
  if (!fullName) return "??";

  const parts = fullName.split(" ").filter(Boolean); // แยกคำด้วยช่องว่าง
  if (parts.length === 0) return "";

  if (parts.length === 1) {
    // กรณีมีแค่ชื่อเดียว เอา 2 ตัวแรก
    return parts[0].substring(0, 2).toUpperCase();
  }

  // กรณีมี ชื่อ-นามสกุล เอาตัวแรกของทั้งคู่
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
