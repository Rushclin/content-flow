import Loading from "@/components/common/Loading";
import Footer from "@/components/public/Footer";
import FormGeneration from "@/components/public/FormGeneration";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import Pricing from "@/components/public/Pricing";
import PublicLayout from "@/layout/public/PublicLayout";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [mounted, setMounted] = useState(false); // https://stackoverflow.com/questions/73162551/how-to-solve-react-hydration-error-in-nextjs

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Loading />;

  return (
    <PublicLayout title="Home">
      <Header />
      <Hero />
      <FormGeneration />
      <Pricing />
      <Footer />
    </PublicLayout>
  );
};

export default HomePage;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common", "home"])),
    },
  };
};
