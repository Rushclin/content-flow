import React from "react";
import Head from "next/head";
import { appConfig } from "@/config/app";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  rightContent?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  description,
  title,
  rightContent,
}) => {
  return (
    <div>
      <Head>
        <title>
          {title ? `${title} -- ${appConfig.name}` : `${appConfig.name}`}
        </title>
        <meta
          property="description"
          content={description || appConfig.description}
        />
        <meta property="og:title" content={title} />
      </Head>

      <div className="min-h-screen flex">
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="relative hidden lg:flex flex-1">
          {rightContent ? (
            rightContent
          ) : (
            <div className="relative w-full h-screen overflow-hidden">
              <img
                src="https://shtheme.com/demosd/ziptech/wp-content/uploads/2023/04/request-a-call-back-im1.jpg"
                alt="Créateurs de contenu"
                className="w-full h-full object-cover "
              />

              <div className="absolute bottom-0 left-0 w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative px-5 py-6 text-white text-center">
                  <div className="font-black text-2xl montserrat text-right">
                    Rejoignez plus de <span className="recoleta">100 000</span>{" "} auteurs et
                    créateurs de contenu qui nous font confiance au quotidien.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <LanguageSwitcher className="bottom-5" />
    </div>
  );
};

export default AuthLayout;
