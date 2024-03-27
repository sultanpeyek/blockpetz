import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e) && e.response) {
    // Check if the error is a Zod validation error
    if (e.response.data.error?.fieldErrors) {
      const fieldErrors: [string, string[]][] = Object.entries(
        e.response.data.error.fieldErrors,
      );
      if (fieldErrors.length > 0) {
        const [field, errors] = fieldErrors[0];
        if (errors.length > 0) {
          return `${field}: ${errors[0]}`;
        }
      }
    }

    return e.response.data.error ?? e.message;
  }

  return (e as Error)?.message || (e as Error)?.toString();
};
