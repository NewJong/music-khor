import { useState, useEffect } from "react";
import {
  HamburgerMenuIcon,
  Cross2Icon,
  ChevronLeftIcon,
} from "@radix-ui/react-icons";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Sidebar from "@/components/Sidebar/Sidebar";
import GoogleLogin from "../Login/GoogleLogin";
import { AnimatePresence, motion } from "framer-motion";
import MusicSearch from "./MusicSearch";

export default function PageHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="relative pt-6 px-8 xs:px-8 flex justify-between items-center">
        {!searchMode && (
          <button
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
            className="bg-zinc-900 rounded-full inline-flex justify-center
            items-center h-12 w-12 lg:hidden hover:scale-110
            shadow-lg shadow-gray-800/50 transition-all
            transition duration-300 ease-in-out 
        hover:translate-y-[-2px]"
          >
            <HamburgerMenuIcon className="h-4 w-4" />
          </button>
        )}

        {!searchMode && (
          <a
            href="/"
            aria-label="Home"
            className="bg-zinc-900 rounded-full inline-flex justify-center 
            items-center h-12 w-12 hidden lg:flex hover:scale-110
            shadow-lg shadow-gray-800/50 transition-all
            transition duration-300 ease-in-out z-[40]"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </a>
        )}

        <div className="flex items-center justify-end gap-3 s550:gap-8 z-[40]">
          <div className="hidden s550:flex">
            <MusicSearch closeSearch={() => setSearchMode(false)} />
          </div>

          {searchMode ? (
            <div className="s550:hidden">
              <MusicSearch closeSearch={() => setSearchMode(false)} />
            </div>
          ) : (
            <>
              <button
                className="s550:hidden bg-zinc-900 rounded-full inline-flex justify-center 
                items-center shadow-lg shadow-gray-800/50 h-12 w-12
                transition-all hover:scale-110"
                aria-label="Search music"
                onClick={() => setSearchMode(true)}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>

              <GoogleLogin />
            </>
          )}
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="fixed inset-0 z-50 bg-black "
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10 }}
            ></motion.div>

            <motion.div
              className="relative z-50 w-[32vh] xs:w-[44vh] bg-zinc-900 border-r border-gray-500
                  shadow-xl transition-all h-full m-2"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0 }}
            >
              <div className="p-4 flex justify-end">
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white"
                >
                  <Cross2Icon className="h-5 w-5" />
                </button>
              </div>
              <div className="h-full overflow-y-auto pb-40">
                <Sidebar />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
