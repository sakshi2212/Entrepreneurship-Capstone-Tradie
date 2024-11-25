import { AppProps } from "next/app";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { StockProvider } from "@/contexts/StockContext"; // Import the StockProvider
import "@/styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PortfolioProvider>
      <StockProvider> {/* Wrap the application with StockProvider */}
        <Component {...pageProps} />
        <Toaster />
      </StockProvider>
    </PortfolioProvider>
  );
}

export default MyApp;
