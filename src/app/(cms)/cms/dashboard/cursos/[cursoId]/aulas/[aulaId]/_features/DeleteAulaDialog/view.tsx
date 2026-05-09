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
import { deletarAula } from "../EditarAula/actions";

type Props = {
  aulaId: string;
  cursoId: string;
  aulaTitle: string;
};

export function DeleteAulaDialog({ aulaId, cursoId, aulaTitle }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deletarAula(aulaId, cursoId);
      if (result?.message) {
        toast.error(result.message);
      } else {
        toast.success("Aula excluída");
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className={cn("shrink-0")}
          />
        }
      >
        Excluir aula
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir aula</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir{" "}
            <strong>&ldquo;{aulaTitle}&rdquo;</strong>? Esta ação não pode ser
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
