import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import GlobalStyles from "../../styles/GlobalStyles";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { DarkModeProvider } from "../../context/DarkModeProvider";
import { AuthProvider } from "../../context/AuthContext";

const queryClient = new QueryClient();
function Provider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <GlobalStyles />
        <AuthProvider>
          <DarkModeProvider>{children}</DarkModeProvider>
        </AuthProvider>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{
          margin: "8px",
        }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "var(--backgraund-color)",
            color: "var(--text-color)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default Provider;
