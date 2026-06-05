-- 1. Criar Tipos Enum
CREATE TYPE ticket_topic AS ENUM ('aula', 'cadastro', 'curso', 'eventos', 'reclamacao');
CREATE TYPE ticket_status AS ENUM ('aberto', 'em_progresso', 'finalizado');

-- 2. Criar Tabela tickets
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    aluno_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topico ticket_topic NOT NULL,
    status ticket_status NOT NULL DEFAULT 'aberto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Criar Tabela ticket_messages
CREATE TABLE IF NOT EXISTS public.ticket_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    autor_role TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT false
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para `tickets`

-- Aluno: Pode ver apenas seus próprios tickets
CREATE POLICY "Alunos podem ver seus próprios tickets"
    ON public.tickets FOR SELECT
    USING (auth.uid() = aluno_id);

-- Aluno: Pode criar seus próprios tickets
CREATE POLICY "Alunos podem criar tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (auth.uid() = aluno_id);

-- Admin: Pode ver todos os tickets
CREATE POLICY "Admins podem ver todos os tickets"
    ON public.tickets FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid()));

-- Admin: Pode atualizar o status de qualquer ticket
CREATE POLICY "Admins podem atualizar tickets"
    ON public.tickets FOR UPDATE
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid()));

-- 6. Políticas RLS para `ticket_messages`

-- Aluno: Pode ver mensagens dos seus tickets
CREATE POLICY "Alunos podem ver mensagens dos seus tickets"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE id = ticket_messages.ticket_id AND aluno_id = auth.uid()
        )
    );

-- Aluno: Pode enviar mensagens para os seus tickets
CREATE POLICY "Alunos podem enviar mensagens"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        auth.uid() = autor_id AND
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE id = ticket_messages.ticket_id AND aluno_id = auth.uid()
        )
    );

-- Admin: Pode ver todas as mensagens
CREATE POLICY "Admins podem ver todas as mensagens"
    ON public.ticket_messages FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid()));

-- Admin: Pode enviar mensagens em qualquer ticket
CREATE POLICY "Admins podem enviar mensagens"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        auth.uid() = autor_id AND
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
    );

-- Todos: Podem atualizar o status de `lida` das mensagens às quais têm acesso de leitura
CREATE POLICY "Atualização de status lida"
    ON public.ticket_messages FOR UPDATE
    USING (
        auth.uid() IN (SELECT aluno_id FROM public.tickets WHERE id = ticket_messages.ticket_id) OR
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid())
    );
