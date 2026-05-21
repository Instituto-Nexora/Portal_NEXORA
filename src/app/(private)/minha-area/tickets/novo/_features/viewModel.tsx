"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { novoTicketSchema, type NovoTicketFormValues } from "./schema";
import { createTicketAction } from "./actions";

const useNovoTicketViewModel = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<NovoTicketFormValues>({
    resolver: zodResolver(novoTicketSchema),
    defaultValues: {
      mensagem: "",
    },
  });

  const onSubmit = (values: NovoTicketFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("topico", values.topico);
      formData.append("mensagem", values.mensagem);

      const result = await createTicketAction(formData);

      // O redirect lança uma exceção no servidor e não chega aqui se der sucesso. 
      // Logo, só cai aqui se houver erro (return success: false).
      if (result && !result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof NovoTicketFormValues, { type: "server", message: messages[0] });
          });
        } else if (result.message) {
          form.setError("root", { type: "server", message: result.message });
        }
      }
    });
  };

  return { form, isPending, onSubmit: form.handleSubmit(onSubmit) };
};

export default useNovoTicketViewModel;