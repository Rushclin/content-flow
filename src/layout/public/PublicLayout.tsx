import LanguageSwitcher from "@/components/LanguageSwitcher";
import { appConfig } from "@/config/app";
import Head from "next/head";
import React from "react";

interface PublicLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  description,
  title,
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
      <div>
        {children}
        <LanguageSwitcher className="bottom-5" />
      </div>
    </div>
  );
};

export default PublicLayout;
