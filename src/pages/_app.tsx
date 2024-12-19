import type { AppProps } from "next/app";
import { ChartProvider } from "@/contexts/ChartContext";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ChartProvider>
        <PortfolioProvider>
          <Component {...pageProps} />
          <Toaster />
        </PortfolioProvider>
      </ChartProvider>
    </AuthProvider>
  );
}