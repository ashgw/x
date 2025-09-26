import { ThemeProvider } from "../theme/provider";
import { ToastProvider } from "../ui";

export const DesignSystemProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  );
};
