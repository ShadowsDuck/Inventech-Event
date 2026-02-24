import { isAxiosError } from "axios";

export const handleApiError = (
  error: unknown,
  fallbackMessage: string,
): never => {
  if (isAxiosError(error) && error.response) {
    const errorData = error.response.data;
    const errorMessage =
      (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
      errorData.detail ||
      fallbackMessage;
    throw new Error(errorMessage);
  }
  throw new Error(`${fallbackMessage} (Network error)`);
};
