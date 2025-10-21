import {
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Twitch,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-swamp text-gray-300">
      <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-16 p-12">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="w-[87px]">
            <img src="/sees-logo-white.png" alt="logo" />
          </div>
          <p className="text-lg  text-center md:text-left">
            Society of Electrical Engineering Students
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
  { children: "Executives", href: "/executives" },
  { children: "Teams", href: "/teams" },
  { children: "Resources", href: "/resources" },
];
const socialLinks: Link[] = [
  { children: <Twitter />, href: "#" },
  { children: <Instagram />, href: "#" },
  { children: <Linkedin />, href: "#" },
  { children: <Twitch />, href: "#" },
];
const FooterLink: React.FC<Link> = ({ children = "", href, target = "" }) => (
  <a href={href} target={target} className="hover:text-green-400 transition">
    {children}
  </a>
);
