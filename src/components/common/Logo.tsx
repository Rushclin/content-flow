import Image from "next/image";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import { appConfig } from "@/config/app";

const Logo = ({
  className = "",
  size = 40,
  justLogo = false,
}) => (
  <Link
    href="/?no_redirect=true"
    className={twMerge(
      "fff flex w-full items-center justify-center gap-2 whitespace-nowrap text-center text-2xl font-normal text-slate-600 " +
        className,
    )}
  >
    <Image width={size} height={size} alt={appConfig.name} src="https://novalitix.com/wp-content/uploads/2023/10/Novalitix_v2_Logo-edulearnia_horizontal_en_blanc.png" />
    {!justLogo && (
      <span className="relative flex flex-col items-end text-inherit text-[10px] font-light border p-1 rounded-full">
        {appConfig.name}
      </span>
    )}
  </Link>
);

export default Logo