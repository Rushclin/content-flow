import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import Logo from "../common/Logo";
import { ArrowRightCircle } from "lucide-react";

const Header = ({ hideMenu = false }) => {
  const [, setIsMenuOpen] = useState(false);
  const [, setHasToken] = useState(false);
  const [scrollStart, setScrollStart] = useState(0);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      setHasToken(!!localStorage.getItem("token"));
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollStart) {
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
      setScrollStart(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollStart]);

  return (
    <div
      className={twMerge(
        "fixed left-0 top-0 z-50 flex h-14 w-full items-center justify-between p-5 transition-all " +
          (scrollStart > 80 ? " bg-white py-10 md:p-10" : " py-10 md:p-14")
      )}
    >
      <div className="logo hidden md:block">
        <Logo size={140} />
      </div>
       <div className="logo md:hidden">
        <Logo size={140} justLogo />
      </div>
      <div className={twMerge("hidden " + (hideMenu ? "" : " md:flex"))}>
        <ul className="text-md flex justify-between text-slate-800 md:gap-4 xl:gap-12">
          <li>
            <Link href={"/solutions"}>Solutions</Link>
          </li>
          <li>
            <a href={"/reviews"}>Revues</a>
          </li>
          <li>
            <a href={"/ressource"}>Ressource</a>
          </li>
          <li className="relative">
            <a href="/ai-voice" className="relative inline-flex items-center">
              AI Voice
              <span className="absolute -top-3 -right-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex items-center px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extralight">
                  soon
                </span>
              </span>
            </a>
          </li>
          <li className="relative">
            <a href="#PricingSection" className="relative inline-flex items-center">
              Pricing
            </a>
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between gap-2">
        <>
          <Link
            href="/auth/login"
            className="cursor-pointer rounded-full p-2 px-5 text-center text-white bg-primary/90 transition-colors ease-in hover:bg-primary lg:w-28 "
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="flex cursor-pointer items-center justify-evenly rounded-full bg-primary/90 p-2 px-2 text-white hover:bg-primary md:w-32"
          >
            Register
            <span className="hidden md:inline-block">
              <ArrowRightCircle className="h-4 w-4" />
            </span>
          </Link>
        </>
      </div>
    </div>
  );
}


export default Header