import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const location = useLocation();
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
              className="w-full h-full object-contain"
            />
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            {headerLinks.map((link, i) => (
              <HeaderLink {...link} key={i} />
            ))}
          </nav>

          <div className="hidden md:flex bg-swamp text-white py-2 px-6 rounded-2xl text-[20px] font-semibold hover:bg-[#02543d] transition-colors cursor-pointer select-none">
            <a href="/contact">Contact Us</a>
          </div>

          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
          >
            <motion.div
              initial={false}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuOpen ? (
                <X size={28} className="text-swamp" />
              ) : (
                <Menu size={28} className="text-swamp" />
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
                    href="/contact"
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
  { name: "Executives", href: "/executives" },
  { name: "Teams", href: "/teams" },
  { name: "Resources", href: "/resources" },
];

const HeaderLink: React.FC<LinkProp & { mobile?: boolean }> = ({
  name,
  href,
  mobile,
}) => {
  const onPage = location.pathname === href;
  const onMainPage = location.pathname === "/";
  return (
    <a
      href={href}
      className={`group text-lg md:text-[20px] font-medium transition-colors  hover:text-green-600 relative ${
        !mobile && onMainPage ? "text-white" : "text-swamp"
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
              !mobile && onMainPage ? "bg-white" : "bg-swamp"
            }`}
          ></motion.div>
        )}
      </AnimatePresence>
      {name}
    </a>
  );
};
