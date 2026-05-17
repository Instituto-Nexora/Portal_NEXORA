"use server";

import { Resend } from 'resend';
import { contactSchema, type ContactFormType } from "./schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarContatoAction(data: ContactFormType) {
  try {
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Dados de formulário inválidos." };
    }

    const { nome, email, mensagem } = parsed.data;

    const { error } = await resend.emails.send({
      from: 'NEXORA Site <onboarding@resend.dev>',
      to: 'caioquerino04@gmail.com', 
      subject: `Novo Contato do Portal: ${nome}`,
      html: `
        <div style="font-family: sans-serif; color: #334155;">
          <h2 style="color: #0f766e;">Novo Contato - Portal NEXORA</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Mensagem:</strong></p>
          <div style="padding: 12px; border-left: 4px solid #f59e0b; background-color: #f8fafc; white-space: pre-wrap;">${mensagem}</div>
        </div>
      `,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro interno no servidor ao enviar a mensagem." };
  }
}
