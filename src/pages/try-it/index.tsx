import Loading from "@/components/common/Loading";
import FormGeneration from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import PublicLayout from "@/layout/public/PublicLayout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TryPage = () => {
  const { t } = useTranslation("try-it");

  const [mounted, setMounted] = useState(false); // https://stackoverflow.com/questions/73162551/how-to-solve-react-hydration-error-in-nextjs

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;
  return (
    <PublicLayout title="Essayez notre outil de generation">
      <Header />
      {/* <div className="py-10 mt-10 text-center max-w-3xl mx-auto">
        <h1 className="text-2xl mt-10">Essayez notre outil</h1>
      </div> */}
      <FormGeneration />
    </PublicLayout>
  );
};

export default TryPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", [
        "common",
        "home",
        "try-it",
      ])),
    },
  };
};
