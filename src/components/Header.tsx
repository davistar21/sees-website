import { useEffect, useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const location = useLocation();
  const onDarkHeroPage = ["/", "/events"].includes(location.pathname);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all shadow-md ${
          !isScrolled && !menuOpen
            ? "bg-glass shadow-md backdrop-blur-xl"
            : "bg-white"
        }`}
      >
        <div className="flex gap-4 items-center justify-between px-4 md:px-8">
          <div className="w-[87px] h-[87px] flex-shrink-0">
            <img
              src="/sees-logo-black.png"
              alt="logo"
              loading="eager"
              className="w-full h-full object-contain"
            />
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            {headerLinks.map((link, i) => (
              <HeaderLink {...link} key={i} />
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/admin/login"
              className={`flex items-center gap-2 py-2 px-4 rounded-2xl text-[18px] font-semibold border transition-colors ${
                !isScrolled && onDarkHeroPage
                  ? "border-white/50 text-white hover:bg-white/10"
                  : "border-swamp text-swamp hover:bg-swamp/10"
              }`}
            >
              <LogIn size={18} /> Login
            </a>
            <a
              href="mailto:theseesunilagofficial@gmail.com?subject=General%20Inquiry%20%E2%80%93%20SEES&body=Hello%20SEES%2C%20I'd%20like%20to%20learn%20more%20about%20your%20society%20and%20how%20I%20can%20get%20involved.%20Please%20get%20back%20to%20me%20at%20your%20earliest%20convenience.%20Thank%20you."
              className="bg-swamp text-white py-2 px-6 rounded-2xl text-[20px] font-semibold hover:bg-[#02543d] transition-colors"
            >
              Contact Us
            </a>
          </div>

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`md:hidden flex items-center justify-center p-2 rounded-md  transition  ${
              !isScrolled && onDarkHeroPage
                ? "text-white hover:bg-swamp"
                : "text-swamp hover:bg-gray-100"
            }`}
          >
            <motion.div
              initial={false}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? (
                <X size={28} className="" />
              ) : (
                <Menu size={28} className="" />
              )}
            </motion.div>
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white shadow-inner"
            >
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                  },
                  hidden: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
                className="flex flex-col gap-4 p-6 items-center"
              >
                {headerLinks.map((link, i) => (
                  <motion.li
                    key={i}
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -10 },
                    }}
                  >
                    <HeaderLink {...link} mobile />
                  </motion.li>
                ))}
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full"
                >
                  <a
                    href="/admin/login"
                    className="flex items-center justify-center gap-2 border-2 border-swamp text-swamp py-3 px-6 rounded-2xl text-center text-lg font-semibold hover:bg-swamp/10 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn size={18} /> Login
                  </a>
                </motion.li>
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full"
                >
                  <a
                    href="mailto:theseesunilagofficial@gmail.com?subject=Inquiry%20from%20SEES%20Website&body=Hello%20SEES%20Team%2C%20I%20hope%20this%20message%20finds%20you%20well.%20My%20name%20is%20%5BYour%20Name%5D%2C%20and%20I%20am%20reaching%20out%20regarding%20%5Byour%20reason%5D.%20Please%20find%20the%20details%20of%20my%20inquiry%20below.%20I%20would%20appreciate%20your%20response%20at%20your%20earliest%20convenience.%20Thank%20you%20for%20your%20time%20and%20consideration.%20Best%20regards%2C%20%5BYour%20Name%5D."
                    className="block bg-swamp text-white py-3 px-6 rounded-2xl text-center text-lg font-semibold hover:bg-[#02543d] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Contact Us
                  </a>
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
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
  { name: "Blog", href: "/blog" },
  { name: "Executives", href: "/executives" },
  { name: "Teams", href: "/teams" },
  { name: "Resources", href: "/resources" },
];

const HeaderLink: React.FC<
  LinkProp & { mobile?: boolean; isScrolled?: boolean }
> = ({ name, href, mobile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const onPage = location.pathname === href;
  const onDarkHeroPage = ["/", "/events"].includes(location.pathname);
  return (
    <a
      href={href}
      className={`group text-lg md:text-[20px] font-medium transition-colors  hover:text-green-600 relative ${
        !mobile && onDarkHeroPage && !isScrolled ? "text-white" : "text-swamp"
      }`}
    >
      <AnimatePresence>
        {onPage && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8 }}
            className={`group-hover:bg-green-600 transition-colors absolute w-full h-[2px] rounded-full bottom-0 left-0 ${
              !mobile && onDarkHeroPage && !isScrolled ? "bg-white" : "bg-swamp"
            }`}
          ></motion.div>
        )}
      </AnimatePresence>
      {name}
    </a>
  );
};
