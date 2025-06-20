import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="label">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className="input"
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                {...field}
              />
              {isPassword && (
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18M10.584 10.587A2 2 0 0012 16a2 2 0 002-2c0-.414-.126-.8-.34-1.12m-1.076-1.076A2 2 0 0012 8a2 2 0 00-2 2c0 .414.126.8.34 1.12m1.076 1.076zM12 6c-5.523 0-10 6-10 6s2.5 4 7 4c1.657 0 3.156-.672 4.243-1.757M17.657 17.657C19.5 16.5 22 12 22 12s-2.5-4-7-4c-1.657 0-3.156.672-4.243 1.757"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 12s4.477-6 11-6 11 6 11 6-4.477 6-11 6S1 12 1 12zm11-3a3 3 0 100 6 3 3 0 000-6z"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
