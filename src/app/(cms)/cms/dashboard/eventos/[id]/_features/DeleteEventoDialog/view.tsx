"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { excluirEvento } from "../EditarEvento/actions";

type Props = {
  eventoId: string;
  eventoTitle: string;
};

export function DeleteEventoDialog({ eventoId, eventoTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await excluirEvento(eventoId);
      if (result?.message) {
        toast.error(result.message ?? "Erro ao excluir");
      } else {
        toast.error("Evento excluído");
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="destructive" size="sm" className={cn("shrink-0")} />
        }
      >
        Excluir evento
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir evento</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>&ldquo;{eventoTitle}&rdquo;</strong>? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>
            Cancelar
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
          >
            {isPending ? "Excluindo…" : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
