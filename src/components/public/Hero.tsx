import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-0 mt-24">
      <div className="flex w-full flex-col items-center justify-between lg:flex-row">
        <div className="flex flex-shrink-0 flex-col items-center justify-start px-3 md:px-10 lg:w-[50%]">
          <div
            className="recoleta flex flex-col justify-center gap-2 text-center text-5xl font-semibold leading-tight md:text-4xl lg:text-5xl 2xl:text-6xl"
            dangerouslySetInnerHTML={{
              __html:
                "<span class='text-primary'>Générez vos articles plus facilement avec Content Flow Toolbox </span>",
            }}
          />

          <div className="">
            <div className="my-5 flex flex-col items-center justify-center gap-1 text-slate-500">
              <Link
                href="/dashboard"
                className="recoleta relative mt-2 rounded-full bg-slate-500/90 p-2 hover:bg-slate-500 px-14 py-3 text-xl text-white hover:bg-orangePrimary md:px-14"
              >
                Essayer gratuitement
              </Link>
              <small>Pas de carte de crédit requis</small>
            </div>
          </div>
        </div>
        <div className="relative my-32 flex w-[90%] items-center justify-center lg:w-1/2">
          <div className="relative w-[50%] h-[30%] overflow-hidden rounded-lg border shadow-md">
            <Image
              src="https://shtheme.com/demosd/ziptech/wp-content/uploads/2023/04/request-a-call-back-im1.jpg"
              alt="placeholder"
              className="w-full h-full"
              width={256}
              height={160}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
