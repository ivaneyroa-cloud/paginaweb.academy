"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoCalculatorOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { UserMenu } from "@/features/auth";
import ThemeToggle from "@/shared/components/ThemeToggle";

export const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navItems = [
    {
      href: "/cotizadorv2",
      label: "Cotizador de Envío",
      icon: <TbTruckDelivery size={22} />,
    },
    {
      href: "/calculadora",
      label: "Calculadora Rentabilidad",
      icon: <IoCalculatorOutline size={22} />,
    },
  ];

  return (
    <header
      ref={menuRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled || isOpen
          ? "bg-white/90 backdrop-blur-md border-sky-200/50 shadow-sm"
          : "bg-transparent border-transparent"
      }`}
    >
      {/* CAMBIO 1: h-20 a h-24 (Más alto) */}
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        
        {/* --- LOGO --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <img 
            src="/logo.png" 
            alt="Shippar" 
            className="h-10 md:h-11 object-contain transition-transform group-hover:scale-105 mt-4" 
          />
        </Link>

        {/* --- DESKTOP MENU --- */}
        <div className="hidden md:flex items-center gap-6">
            
          {/* Contenedor "Isla" */}
          <nav className="flex items-center bg-white p-1.5 rounded-full border border-sky-200 shadow-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : "text-sky-700 hover:bg-sky-50"
                  }`}
                >
                  <span className={isActive ? "text-sky-100" : "text-sky-400 group-hover:text-sky-600"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="h-8 w-px bg-sky-200 mx-1"></div>

          <ThemeToggle />
          <UserMenu />
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden text-sky-700 p-2 rounded-lg hover:bg-sky-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <HiX size={32} /> : <HiMenuAlt3 size={32} />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-sky-100 shadow-lg animate-fade-in">
          <nav className="flex flex-col p-4 space-y-3">
            {navItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    // CAMBIO 2: Lógica de colores Mobile (Todo Celeste)
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl border transition-all ${
                    isActive
                        ? "bg-sky-600 text-white border-sky-600 font-bold shadow-md"
                        : "bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-100 font-semibold" 
                        // ^ Aquí cambiamos el gris por bg-sky-50 y text-sky-700
                    }`}
                >
                    <span className={isActive ? "text-sky-100" : "text-sky-500"}>
                        {item.icon}
                    </span>
                    {item.label}
                </Link>
               );
            })}
            
            <div className="pt-4 border-t border-sky-100 mt-2 flex items-center justify-between">
              <ThemeToggle />
              <UserMenu isMobile={true} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;