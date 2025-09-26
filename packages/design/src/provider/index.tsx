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
      <ThemeProvider>
        <ToastProvider>
          <body className={fonts.atkinsonHyperlegible.className}>
            {children}
          </body>
        </ToastProvider>
      </ThemeProvider>
    </html>
  );
};
