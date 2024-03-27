import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e) && e.response) {
    return e.response.data.error ?? e.message;
  }

  return (e as Error)?.message || (e as Error)?.toString();
};
