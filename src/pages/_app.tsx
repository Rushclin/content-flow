import { appConfig } from "@/config/app";
import { SidebarProvider } from "@/context/SidebarContext";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import NextNProgress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastProvider";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>{appConfig.name}</title>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="description" content={appConfig.description} />
        <meta name="keywords" content="AI, Generation, Automation" />
        <meta name="author" content="Novalitix" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#036eb7" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@ContentFlowAI" />
        <meta name="twitter:creator" content="@Novalitix" />
        <meta name="twitter:title" content={appConfig.name} />
        <meta name="twitter:description" content={appConfig.description} />
        <meta name="twitter:image" content="/og-image.png" />
        <meta
          name="twitter:image:alt"
          content={`${appConfig.name} - ${appConfig.description}`}
        />

        <link rel="icon" href="/favicon.png" />
      </Head>
      <Suspense fallback={<Loader2 className="animate-spin ease-in" />}>
        <NextNProgress
          color="#036eb7"
          startPosition={0.3}
          stopDelayMs={100}
          height={5}
        />
        <AuthProvider>
          <SidebarProvider>
            <Component {...pageProps} />
          </SidebarProvider>
        </AuthProvider>
        <ToastProvider />
      </Suspense>
    </>
  );
};

export default appWithTranslation(App);
