"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { contactSchema, type ContactFormType } from "./schema";

export type ContactViewModel = {
  form: UseFormReturn<ContactFormType>;
  isSubmitting: boolean;
  isSuccess: boolean;
  onSubmit: (data: ContactFormType) => Promise<void>;
};

const useContactViewModel = (): ContactViewModel => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
    defaultValues: { nome: "", email: "", mensagem: "" },
  });

  const onSubmit = async (data: ContactFormType) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // TODO: Substituir por chamada real à API (Route Handler) no futuro
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Mensagem recebida:", data);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor.");
      }

      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar contato:", error);
      // Opcional no futuro: setar um estado `isError` e exibir um Toast do Shadcn
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, isSubmitting, isSuccess, onSubmit };
};

export default useContactViewModel;