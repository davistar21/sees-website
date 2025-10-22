import { useState } from "react";
import { Menu } from "lucide-react";
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="mb-30 ">
      <header
        className="
    fixed top-0 left-0 right-0 z-50 shadow-md bg-white"
      >
        <div className="flex gap-4 items-center justify-between px-2 md:px-4">
          <div className="w-[87px] h-[87px]">
            <img src="/sees-logo-black.png" alt="logo" />
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            {headerLinks.map((link, index) => (
              <HeaderLink {...link} key={index} />
            ))}
          </nav>
          <div className="hidden md:flex bg-swamp text-white py-2 px-6 rounded-2xl text-[20px]">
            <a href="/contact">Contact Us</a>
          </div>
          <button
            className="md:hidden flex items-center "
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu size={24} className="text-black" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden overflow-hidden ">
            <nav className="flex flex-col gap-4 p-4">
              {headerLinks.map((link, index) => (
                <HeaderLink {...link} key={index} />
              ))}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;

type LinkProp = {
  name: React.ReactNode;
  href: string;
};
const headerLinks: LinkProp[] = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Executives", href: "/executives" },
  { name: "Teams", href: "/teams" },
  { name: "Resources", href: "/resources" },
];

const HeaderLink: React.FC<LinkProp> = ({ name, href }) => {
  return (
    <a href={href} className="text-[20px]">
      {name}
    </a>
  );
};
