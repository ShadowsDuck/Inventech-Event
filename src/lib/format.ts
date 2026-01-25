export const formatPhoneNumberDisplay = (
  phoneNumber: string | undefined | null,
) => {
  if (!phoneNumber) return "-";

  // กันเหนียว: ลบขีดออกก่อน เผื่อ DB เก่ามีขีดติดมา
  const cleaned = phoneNumber.replace(/\D/g, "");

  // เบอร์มือถือ 10 หลัก
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return cleaned; // ถ้าไม่เข้าเคสไหนเลย ก็โชว์เลขเดิม
};

export const formatPhoneNumberInput = (value: string) => {
  // 1. ลบทุกอย่างที่ไม่ใช่ตัวเลข
  const cleaned = value.replace(/\D/g, "");

  // 2. ตัดให้เหลือแค่ 10 หลัก
  const limited = cleaned.slice(0, 10);

  // 3. จัด Format ตามความยาวที่พิมพ์มา
  if (limited.length > 6) {
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`;
  }
  if (limited.length > 3) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`;
  }

  // ถ้ายังพิมพ์ไม่ถึง 3 ตัว ก็ส่งเลขเพียวๆ กลับไป
  return limited;
};

export const cleanPhoneNumber = (value: string) => {
  return value.replace(/\D/g, "");
};
