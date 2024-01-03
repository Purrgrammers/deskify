"use client";

import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex justify-between px-8 mx-6 mt-8 py-5 border-t border-gray text-sm font-light text-slate-400">
      <p>Project created at SALT Bootcamp 2024.</p>
      <div className="flex gap-5">
        <a href="https://github.com/felicialyden" target="_blank">
          <div className="flex">
            <Github />
            Felicia Lydén
          </div>
        </a>
        <a href="https://github.com/izabela-marcinkowska" target="_blank">
          <div className="flex">
            <Github />
            Izabela Marcinkowska
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
