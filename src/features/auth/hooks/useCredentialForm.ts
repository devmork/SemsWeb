import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";

export type CredentialMode = "login" | "signup";

export interface CredentialValues {
  firstName: string;
  lastName: string;
  idNumber: string;
  password: string;
  confirmPassword: string;
}

export type CredentialField = keyof CredentialValues;
export type CredentialErrors = Partial<Record<CredentialField, string>>;

const EMPTY: CredentialValues = {
  firstName: "",
  lastName: "",
  idNumber: "",
  password: "",
  confirmPassword: "",
};

/** Keeps digits only and inserts the dash after the fourth digit. */
export function formatSchoolId(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
}

/**
 * Client-side state and validation for the school-ID credential card.
 * The API does not expose password sign-in/sign-up yet, so a successful local
 * validation surfaces a clear notice instead of pretending to authenticate.
 */
export function useCredentialForm(mode: CredentialMode) {
  const [values, setValues] = useState<CredentialValues>(EMPTY);
  const [errors, setErrors] = useState<CredentialErrors>({});
  const [notice, setNotice] = useState<string | null>(null);

  const setValue = useCallback((field: CredentialField, value: string) => {
    const nextValue = field === "idNumber" ? formatSchoolId(value) : value;
    setValues((previous) => ({ ...previous, [field]: nextValue }));
    setErrors((previous) =>
      previous[field] ? { ...previous, [field]: undefined } : previous,
    );
    setNotice(null);
  }, []);

  const fieldProps = useCallback(
    (field: CredentialField) => ({
      id: `credential-${field}`,
      name: field,
      value: values[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        if (field !== "idNumber") {
          setValue(field, input.value);
          return;
        }
        const caret = input.selectionStart ?? input.value.length;
        const digitsBeforeCaret = input.value
          .slice(0, caret)
          .replace(/\D/g, "").length;
        const formatted = formatSchoolId(input.value);
        setValue(field, formatted);
        // Keep the caret after the same digit after the dash is inserted.
        requestAnimationFrame(() => {
          let seen = 0;
          let position = formatted.length;
          for (let index = 0; index < formatted.length; index++) {
            if (/\d/.test(formatted[index]!)) {
              seen++;
              if (seen === digitsBeforeCaret) {
                position = index + 1;
                break;
              }
            }
          }
          if (digitsBeforeCaret === 0) position = 0;
          input.setSelectionRange(position, position);
        });
      },
      "aria-invalid": errors[field] ? (true as const) : undefined,
      "aria-describedby": errors[field]
        ? `credential-${field}-error`
        : undefined,
    }),
    [errors, setValue, values],
  );

  const errorProps = useCallback(
    (field: CredentialField) => ({
      id: `credential-${field}-error`,
      children: errors[field],
    }),
    [errors],
  );

  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const next: CredentialErrors = {};
      if (!/^\d{4}-\d{4}$/.test(values.idNumber.trim())) {
        next.idNumber = "Use the school ID format 2023-0444.";
      }
      if (!values.password) {
        next.password = "Password is required.";
      } else if (mode === "signup" && values.password.length < 8) {
        next.password = "Use at least 8 characters.";
      }
      if (mode === "signup") {
        if (!values.firstName.trim()) next.firstName = "First name is required.";
        if (!values.lastName.trim()) next.lastName = "Last name is required.";
        if (values.confirmPassword !== values.password) {
          next.confirmPassword = "Passwords do not match.";
        }
      }
      setErrors(next);
      if (Object.values(next).some(Boolean)) return;
      setNotice(
        mode === "signup"
          ? "Account creation is not connected to the API yet. Continue with Google for now."
          : "Password sign-in is not connected to the API yet. Continue with Google for now.",
      );
    },
    [mode, values],
  );

  return { values, errors, fieldProps, errorProps, submit, notice };
}
