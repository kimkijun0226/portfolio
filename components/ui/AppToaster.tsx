"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            "border border-line-soft bg-bg text-fg font-sans shadow-[0_8px_24px_rgba(0,0,0,0.4)]",
          title: "text-body",
        },
      }}
    />
  );
}
