"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  type TicketFormValues,
  ticketFormSchema,
} from "../../_features/ticket-schema";
import { createTicketAction } from "./actions";

const useNovoTicketViewModel = () => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: { mensagem: "" },
  });

  const onSubmit = (values: TicketFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("topico", values.topico);
      formData.append("mensagem", values.mensagem);

      const result = await createTicketAction(formData);

      if (result && !result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            form.setError(field as keyof TicketFormValues, {
              type: "server",
              message: messages[0],
            });
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
