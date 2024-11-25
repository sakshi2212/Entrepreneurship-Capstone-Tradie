import { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PortfolioProvider>
      <Component {...pageProps} />
      <Toaster />
    </PortfolioProvider>
  );
}

export default MyApp;