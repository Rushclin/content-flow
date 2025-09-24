import Link from "next/link";
import Logo from "../common/Logo";
import { appConfig } from "@/config/app";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/novalitix",
      label: "Facebook",
    },
    { icon: Twitter, href: "https://twitter.com/novalitix", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/novalitix",
      label: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/novalitix",
      label: "Instagram",
    },
    { icon: Youtube, href: "https://youtube.com/@novalitix", label: "YouTube" },
    { icon: Mail, href: "mailto:contact@novalitix.com", label: "Email" },
  ];

  return (
    <footer className="bg-primary text-white recoleta">
      <div className="px-15 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo size={200} justLogo />
            </div>
            <p className="text-base mb-6 leading-relaxed">
              {appConfig.footer.description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-800 hover:text-slate-900 transition-colors duration-200 text-xl"
                    aria-label={social.label}
                  >
                    {typeof social.icon === "string" ? (
                      <span>{social.icon}</span>
                    ) : (
                      <social.icon className="h-5 w-5" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-slate-800 font-semibold mb-6">
              Plus de Services
            </h3>
            <ul className="space-y-3 mb-6">
              {appConfig.features.slice(1, 3).map((service) => (
                <li key={service.title}>
                  <Link
                    href={service.title}
                    className="text-slate-800 hover:text-slate-900 transition-colors duration-200"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="bg-slate-800 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">Besoin d&apos;aide ?</h4>
              <p className="text-gray-400 text-sm mb-3">
                Contactez notre équipe support
              </p>
              <a
                href="mailto:support@novalitix.com"
                className="text-primary hover:text-secondary transition-colors duration-200 text-sm"
              >
                support@novalitix.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-800 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Novalitix. Tous droits réservés.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-slate-800 hover:text-slate-900 transition-colors duration-200"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-slate-800 hover:text-slate-900 transition-colors duration-200"
              >
                Conditions d&apos;utilisation
              </Link>
              <Link
                href="/cookies"
                className="text-slate-800 hover:text-slate-900 transition-colors duration-200"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
