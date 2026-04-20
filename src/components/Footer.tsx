import { Twitter, Instagram, Linkedin } from "lucide-react";

const TikTokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-swamp text-gray-300 mt-auto">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 p-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="w-[87px]">
            <img src="/sees-logo-white.png" alt="logo" loading="lazy" />
          </div>
          <p className="text-lg text-center md:text-left">
            Society of Electrical, Electronics, and Computer Engineering Students
          </p>
          <p className="text-[16px] text-center md:text-left">
            University of Lagos
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="text-xl font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-lg text-center md:text-left">
            {footerQuickLinks.map((link, index) => (
              <li key={index}>
                <FooterLink {...link} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="text-xl font-semibold mb-3 text-white">
            Connect With Us
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <div key={index}>
                <FooterLink {...link} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 dark:border-gray-700 py-4 text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
        <p className="font-semibold">
          &copy; {new Date().getFullYear()} SEES UNILAG - All rights reserved.
        </p>
        <p className="mt-2">
          Unauthorized use, duplication, or distribution of content is strictly
          prohibited.
        </p>
      </div>
    </footer>
  );
}

type Link = {
  children: React.ReactNode;
  href: string;
  target?: "_blank" | "";
};

const footerQuickLinks: Link[] = [
  { children: "Home", href: "/" },
  { children: "Events", href: "/events" },
  { children: "Blog", href: "/blog" },
  { children: "Executives", href: "/executives" },
  { children: "Teams", href: "/teams" },
  { children: "Resources", href: "/resources" },
];

const socialLinks: Link[] = [
  { children: <Twitter />, href: "https://x.com/SEESUnilag?t=6SWUPTefIGyht1g0xR_FIA&s=09", target: "_blank" },
  { children: <Instagram />, href: "https://www.instagram.com/seesunilag/", target: "_blank" },
  { children: <Linkedin />, href: "https://ng.linkedin.com/company/sees-unilag", target: "_blank" },
  { children: <TikTokIcon />, href: "https://www.tiktok.com/@seesunilag?_r=1&_t=ZS-95fEoaxMcIJ", target: "_blank" },
];

const FooterLink: React.FC<Link> = ({ children = "", href, target = "" }) => (
  <a href={href} target={target} className="hover:text-green-400 transition">
    {children}
  </a>
);