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
import { excluirCurso } from "../EditarCurso/actions";

type Props = {
  cursoId: string;
  cursoTitle: string;
};

export function DeleteCursoDialog({ cursoId, cursoTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await excluirCurso(cursoId);
      if (result?.message) {
        toast.error(result.message);
      } else {
        toast.success("Curso excluído");
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
        Excluir curso
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir curso</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>&ldquo;{cursoTitle}&rdquo;</strong>? Esta ação não pode ser
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
