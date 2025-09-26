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
    <html lang="en">
      <body className={fonts.atkinsonHyperlegible.className}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};
