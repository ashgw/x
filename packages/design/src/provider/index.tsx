import { fonts } from "../fonts/fonts";
import { ThemeProvider } from "../theme/provider";
import { ToastProvider } from "../ui";
import "./../css/index.css";

export const DesignSystemProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <main className={fonts.atkinsonHyperlegible.className}>{children}</main>
      </ToastProvider>
    </ThemeProvider>
  );
};
