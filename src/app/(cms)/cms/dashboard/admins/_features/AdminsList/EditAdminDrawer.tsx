"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ActionState, AdminProfile } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { editarAdmin } from "./editAdminActions";
import { type EditAdminFormData, editAdminSchema } from "./editAdminSchema";

const ROLE_OPTIONS = [
  { value: "content_creator", label: "Content Creator" },
  { value: "professor", label: "Professor" },
  { value: "admin", label: "Admin" },
] as const;

type Props = {
  admin: AdminProfile | null;
  onClose: () => void;
};

export function EditAdminDrawer({ admin, onClose }: Props) {
  const boundAction = editarAdmin.bind(null, admin?.id ?? "");

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    undefined,
  );

  const {
    register,
    control,
    formState: { errors },
  } = useForm<EditAdminFormData>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: {
      full_name: admin?.full_name ?? "",
      role: (admin?.role as EditAdminFormData["role"]) ?? "content_creator",
    },
  });

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <Sheet
      open={admin !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Editar administrador</SheetTitle>
          <SheetDescription>
            Atualize os dados de {admin?.full_name ?? "administrador"}.
          </SheetDescription>
        </SheetHeader>

        <form action={formAction} className={cn("flex flex-col gap-5 px-4 py-2")}>
          <div className={cn("space-y-1.5")}>
            <Label htmlFor="edit_full_name">Nome completo</Label>
            <Input
              id="edit_full_name"
              type="text"
              {...register("full_name")}
              name="full_name"
              className={cn({
                "border-destructive":
                  errors.full_name || state?.errors?.full_name,
              })}
            />
            {(errors.full_name || state?.errors?.full_name) && (
              <p className={cn("text-xs text-destructive")}>
                {errors.full_name?.message ?? state?.errors?.full_name?.[0]}
              </p>
            )}
          </div>

          <div className={cn("space-y-1.5")}>
            <Label htmlFor="edit_role">Permissão</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <>
                  <input type="hidden" name="role" value={field.value} />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit_role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
            {(errors.role || state?.errors?.role) && (
              <p className={cn("text-xs text-destructive")}>
                {errors.role?.message ?? state?.errors?.role?.[0]}
              </p>
            )}
          </div>

          {state?.message && !state.success && (
            <p className={cn("text-sm text-destructive")}>{state.message}</p>
          )}

          <SheetFooter>
            <Button type="submit" disabled={isPending} className={cn("w-full")}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className={cn("w-full")}
            >
              Cancelar
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
