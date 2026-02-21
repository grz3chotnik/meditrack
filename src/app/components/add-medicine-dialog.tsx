"use client";

import React, { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Field } from "@base-ui/react/field";
import { Input } from "@base-ui/react/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

const AddMedicineDialog = () => {
  const addMedicine = useMutation(api.medicines.add);

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;
    await addMedicine({
      name,
      dosage,
      reminderTime: reminderTime || undefined,
    });
    setName("");
    setDosage("");
    setReminderTime("");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
        + Add medicine
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] border border-white/20 rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Add medicine
          </Dialog.Title>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field.Root>
              <Field.Label className="text-sm text-foreground/70 mb-1 block">
                Medicine name
              </Field.Label>
              <Input
                placeholder="e.g. Ibuprofen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/20 bg-transparent text-sm outline-none focus:border-white/50 transition-colors"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label className="text-sm text-foreground/70 mb-1 block">
                Dosage
              </Field.Label>
              <Input
                placeholder="e.g. 200mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/20 bg-transparent text-sm outline-none focus:border-white/50 transition-colors"
              />
            </Field.Root>

            <Field.Root>
              <Field.Label className="text-sm text-foreground/70 mb-1 block">
                Reminder time
              </Field.Label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-white/20 bg-transparent text-sm outline-none focus:border-white/50 transition-colors"
              />
            </Field.Root>

            <div className="flex justify-end gap-3 mt-2">
              <Dialog.Close className="px-4 py-2 text-sm rounded-md border border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
                Cancel
              </Dialog.Close>
              <button
                type="submit"
                className="px-4 py-2 text-sm rounded-md bg-foreground text-background font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                Add
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddMedicineDialog;
