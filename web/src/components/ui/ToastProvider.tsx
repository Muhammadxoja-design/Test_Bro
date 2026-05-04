import { Toaster as SonnerToaster } from "sonner";

export const ToastProvider = () => {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors
      closeButton
      theme="dark"
      toastOptions={{
        className: "glass-morphism border-slate-800 text-white rounded-xl",
        style: {
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
      }}
    />
  );
};
