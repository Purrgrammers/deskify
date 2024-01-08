"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
// import logo from "../logo.png";
import logo from "../deskify.svg";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  return (
    <header className="flex justify-between px-4 mx-2 md:mx-6 lg:mx-12 mt-4 pb-6 border-b border-gray">
      <Link href="/">
        <Image src={logo} alt="logo" width={50} height={50} />
      </Link>
      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div
            className="HAMBURGER-ICON space-y-2 mt-4"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
            <span className="block h-0.5 w-8 bg-gray-600"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b hover:border-gray-400 my-8 uppercase">
                <Link
                  className={`link ${pathname === "/" ? "font-bold" : ""}`}
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li className="border-b hover:border-gray-400 my-8 uppercase">
                <Link
                  className={`link ${pathname === "/maps" ? "font-bold" : ""}`}
                  href="/maps"
                >
                  Maps
                </Link>
              </li>
              <li className="border-b hover:border-gray-400 my-8 uppercase">
                <Link
                  className={`link ${
                    pathname === "/book-desk/107" ? "font-bold" : ""
                  }`}
                  href="/book-desk/107"
                >
                  Book space
                </Link>
              </li>
              <li className="border-b hover:border-gray-400 my-8 uppercase">
                <Link
                  className={`link ${
                    pathname === "/my-bookings" ? "font-bold" : ""
                  }`}
                  href="/my-bookings"
                >
                  Bookings
                </Link>
              </li>
            </ul>
          </div>
        </section>

        <ul className="DESKTOP-MEN hidden space-x-8 mt-4 lg:flex">
          <li>
            <Link
              className={`link ${pathname === "/" ? "font-semibold" : ""}`}
              href="/"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className={`link ${pathname === "/maps" ? "font-semibold" : ""}`}
              href="/maps"
            >
              Maps
            </Link>
          </li>
          <li>
            <Link
              className={`link ${
                pathname === "/book-desk/107" ? "font-semibold" : ""
              }`}
              href="/book-desk/107"
            >
              Book space
            </Link>
          </li>
          <li>
            <Link
              className={`link ${
                pathname === "/my-bookings" ? "font-semibold" : ""
              }`}
              href="/my-bookings"
            >
              Bookings
            </Link>
          </li>
        </ul>
      </nav>
      <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        display: block;
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        left: 0;
        background: white;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
      }
    `}</style>
    </header>
  );
};

export default Navbar;
