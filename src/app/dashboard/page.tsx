"use client";

import React, { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import AddMedicineDialog from "@/app/components/add-medicine-dialog";

const Page = () => {
  const { isSignedIn } = useUser();
  const storeUser = useMutation(api.users.store);
  useEffect(() => {
    if (isSignedIn) {
      storeUser();
    }
  }, [isSignedIn, storeUser]);

  const medicines = useQuery(api.medicines.list);
  const removeMedicine = useMutation(api.medicines.remove);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">My Medicines</h1>
        {isSignedIn && <AddMedicineDialog />}
      </div>

      {!isSignedIn && (
        <p className="text-sm text-foreground/50">
          Sign in to manage your medicines.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {medicines === undefined && (
          <p className="text-sm text-foreground/50">Loading...</p>
        )}

        {medicines?.length === 0 && (
          <p className="text-sm text-foreground/50">No medicines added yet.</p>
        )}

        {medicines?.map((medicine) => (
          <div
            key={medicine._id}
            className="flex items-center justify-between p-4 rounded-lg border border-white/20"
          >
            <div>
              <p className="font-medium">{medicine.name}</p>
              <p className="text-sm text-foreground/50">{medicine.dosage}</p>
            </div>
            <button
              onClick={() => removeMedicine({ id: medicine._id })}
              className="text-sm text-foreground/50 hover:text-foreground transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
