"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { IoCalculatorOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { UserMenu } from "@/features/auth";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useTheme } from "@/shared/context/ThemeContext";

export const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const { theme } = useTheme();

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
      label: "Cotizador",
      icon: <TbTruckDelivery size={18} />,
    },
    {
      href: "/calculadora",
      label: "Calculadora",
      icon: <IoCalculatorOutline size={18} />,
    },
  ];

  return (
    <header
      ref={menuRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50,
        height: '60px',
        borderBottom: '1px solid var(--ctz-border)',
        background: scrolled || isOpen
          ? (theme === 'dark' ? 'rgba(5, 11, 31, 0.9)' : 'rgba(248, 250, 252, 0.9)')
          : 'transparent',
        backdropFilter: scrolled || isOpen ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled || isOpen ? 'blur(16px)' : 'none',
        transition: 'background 300ms ease-out, backdrop-filter 300ms ease-out',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        
        {/* --- LOGO --- */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img 
            src={theme === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
            alt="Shippar" 
            style={{
              height: '32px',
              objectFit: 'contain',
              transition: 'opacity 200ms ease-out',
            }}
          />
        </Link>

        {/* --- DESKTOP NAV --- */}
        <nav className="hidden md:flex" style={{
          alignItems: 'center',
          gap: '4px',
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--ctz-radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--ctz-accent)' : 'var(--ctz-text-secondary)',
                  background: isActive ? 'var(--ctz-accent-light)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 200ms ease-out',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--ctz-text-primary)';
                    e.currentTarget.style.background = 'var(--ctz-accent-light)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--ctz-text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ 
                  color: isActive ? 'var(--ctz-accent)' : 'var(--ctz-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* --- RIGHT SECTION --- */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
          
          <div style={{
            width: '1px',
            height: '20px',
            background: 'var(--ctz-border)',
            margin: '0 4px',
          }} />

          <UserMenu />
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{
            padding: '8px',
            borderRadius: 'var(--ctz-radius-sm)',
            color: 'var(--ctz-text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 200ms ease-out',
          }}
        >
          {isOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
        </button>
      </div>

      {/* --- MOBILE MENU --- */}
      {isOpen && (
        <div 
          className="md:hidden"
          style={{
            background: theme === 'dark' ? 'rgba(5, 11, 31, 0.95)' : 'rgba(248, 250, 252, 0.97)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderTop: '1px solid var(--ctz-border)',
            padding: '12px 16px',
            animation: 'ctz-fade-in 200ms ease-out',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    borderRadius: 'var(--ctz-radius-sm)',
                    fontSize: '0.9375rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--ctz-accent)' : 'var(--ctz-text-secondary)',
                    background: isActive ? 'var(--ctz-accent-light)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 200ms ease-out',
                  }}
                >
                  <span style={{ 
                    color: isActive ? 'var(--ctz-accent)' : 'var(--ctz-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--ctz-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <ThemeToggle />
            <UserMenu isMobile={true} />
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;