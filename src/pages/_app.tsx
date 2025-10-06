import { appConfig } from "@/config/app";
import { SidebarProvider } from "@/context/SidebarContext";
import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import i18n from "@/lib/i18n";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    // Initialize i18n with the current locale and sync on every locale change
    if (router.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale]);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <meta name="description" content={appConfig.description} />
        <meta name="keywords" content="AI, Generation, Automation" />
        <meta name="author" content="Rushclin Takam From Novalitix" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />

        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ClerkProvider
        {...pageProps}
        appearance={{
          cssLayerName: "clerk",
        }}
      >
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </ClerkProvider>
    </>
  );
};

export default App;
