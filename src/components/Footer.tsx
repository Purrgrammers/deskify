"use client";

import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex justify-around px-2 mx-2 mt-6 py-4 pt-2 border-t border-gray text-xs font-light text-slate-400 md:mx-6">
      <p className="w-4/12 lg:w-4/12 text-center md:text-left">
        Project created at SALT Bootcamp 2024.
      </p>
      <div className="flex flex-col md:flex-row md:gap-3 gap-1">
        <a href="https://github.com/felicialyden" target="_blank">
          <div className="flex items-center gap-2">
            <Github size={20} />
            Felicia Lydén
          </div>
        </a>
        <a href="https://github.com/izabela-marcinkowska" target="_blank">
          <div className="flex items-center gap-2">
            <Github size={20} />
            Izabela Marcinkowska
          </div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
