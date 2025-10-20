import { ArrowDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation("home");

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center gap-0  bg-cover bg-center"
      style={{ backgroundImage: "url('/images/banner-gradient.png')" }}
    >
      <div className="flex w-full items-center justify-between max-w-3xl">
        <div
          className="flex flex-col items-center justify-center bg-no-repeat bg-center bg-contain p-10"
          style={{
            backgroundImage: "url('/images/banner-shape.png')",
          }}
        >
          <div className="flex flex-shrink-0 flex-col items-center justify-start ">
            <div
              className="flex flex-col justify-center gap-2 text-center text-4xl font-semibold leading-tight md:text-5xl"
              dangerouslySetInnerHTML={{
                __html: `<span class='text-slate-700'>${t(
                  "hero.title",
                  "The future of content generation is here, from idea to publication, one platform."
                )}</span>`,
              }}
            />

            <span className="text-slate-500 text-md max-w-lg text-center mt-5">
              {t(
                "hero.subtitle",
                "Save time, multiply your impact, and let AI help promote your online presence."
              )}
            </span>

            <div className="">
              <div className="my-5 flex flex-col items-center justify-center gap-1 text-slate-500">
                <Link
                  href="/try-it"
                  className="flex items-center mt-2 rounded-full bg-primary/80 transition-colors ease-in p-2 hover:bg-primary px-14 py-3 text-xl text-white hover:bg-orangePrimary md:px-14"
                >
                  {t("hero.try", "Try it for free")}
                  <ArrowDown className="w-4 h-4 mx-3" />
                </Link>
                <small>
                  {t("hero.noCreditCard", "No credit card required")}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
