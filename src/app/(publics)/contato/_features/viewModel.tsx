"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { contactSchema, type ContactFormType } from "./schema";
import { enviarContatoAction } from "./actions";

export type ContactViewModel = {
  form: UseFormReturn<ContactFormType>;
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  onSubmit: (data: ContactFormType) => Promise<void>;
};

const useContactViewModel = (): ContactViewModel => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nome: "", email: "", mensagem: "" },
  });

  const onSubmit = async (data: ContactFormType) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);

    try {
      const result = await enviarContatoAction(data);

      if (!result.success) {
        setError(result.error || "Falha ao enviar mensagem.");
        return;
      }

      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setError("Ocorreu um erro inesperado ao conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, isSubmitting, isSuccess, error, onSubmit };
};

export default useContactViewModel;