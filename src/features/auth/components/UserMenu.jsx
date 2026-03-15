"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineUserCircle, HiChevronDown } from "react-icons/hi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { ConfirmModal } from "@/shared/components/modals/ConfirmModal";

export function UserMenu({ isMobile = false }) {
  const supabaseRef = useRef(null);
  if (!supabaseRef.current) supabaseRef.current = createClient();
  const supabase = supabaseRef.current;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef(null);
  const initialLoadDone = useRef(false);
  const userIdRef = useRef(null);

  useEffect(() => {
    let active = true;

    const loadSession = async ({ withLoading = true, skipIfSameUser = false } = {}) => {
      try {
        if (withLoading && !initialLoadDone.current) {
          setIsLoading(true);
        }
        const { data } = await supabase.auth.getUser();
        if (!active) return;

        const currentUser = data?.user;

        if (skipIfSameUser && currentUser?.id && userIdRef.current === currentUser.id) {
          if (!initialLoadDone.current) setIsLoading(false);
          return;
        }

        if (skipIfSameUser && !currentUser && !userIdRef.current) {
          if (!initialLoadDone.current) setIsLoading(false);
          return;
        }

        if (!currentUser) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
          userIdRef.current = null;
          return;
        }

        const { data: perfilData } = await supabase
          .from("perfiles")
          .select("nombre_completo, rol")
          .eq("id", currentUser.id)
          .single();

        if (!active) return;

        setUser(currentUser);
        setProfile(perfilData || null);
        userIdRef.current = currentUser.id;
      } catch {
        if (active) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (active) {
          initialLoadDone.current = true;
          setIsLoading(false);
        }
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsOpen(false);
        setIsLoading(false);
        userIdRef.current = null;
        return;
      }

      loadSession({ withLoading: false, skipIfSameUser: true });
    });

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      active = false;
      subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [supabase]);

  const rolLower = (profile?.rol || "").toLowerCase();
  const isAdmin = rolLower === "admin" || rolLower === "superadmin";
  const roleLabel = rolLower === "superadmin" ? "Super Admin" : rolLower === "admin" ? "Admin" : "Usuario";

  const initials = (() => {
    const base = profile?.nombre_completo || user?.email || "";
    const parts = base
      .replace(/@.*/, "")
      .split(/\s+|\./)
      .filter(Boolean)
      .slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase()).join("") || "U";
  })();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      setShowLogoutConfirm(false);
      setIsOpen(false);
      router.push("/auth/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          width: isMobile ? '100%' : '120px',
          height: '40px',
          borderRadius: 'var(--ctz-radius-sm)',
          background: 'var(--ctz-bg-tertiary)',
          animation: 'ctz-shimmer 1.5s infinite linear',
        }}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          background: 'var(--ctz-accent-gradient)',
          color: '#ffffff',
          borderRadius: 'var(--ctz-radius-sm)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 600,
          transition: 'opacity 200ms ease-out',
          width: isMobile ? '100%' : 'auto',
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
      >
        <HiOutlineUserCircle size={18} />
        Iniciar Sesión
      </Link>
    );
  }

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: isMobile ? '10px 16px' : '6px 12px',
    borderRadius: 'var(--ctz-radius-sm)',
    border: '1px solid var(--ctz-border)',
    background: 'var(--ctz-bg-elevated)',
    color: 'var(--ctz-text-primary)',
    cursor: 'pointer',
    transition: 'all 200ms ease-out',
    width: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
  };

  const menuStyle = {
    position: 'absolute',
    [isMobile ? 'left' : 'right']: 0,
    marginTop: '8px',
    width: isMobile ? '100%' : '260px',
    background: 'var(--ctz-bg-elevated)',
    border: '1px solid var(--ctz-border)',
    borderRadius: 'var(--ctz-radius-md)',
    boxShadow: 'var(--ctz-shadow-lg)',
    overflow: 'hidden',
    zIndex: 50,
    backdropFilter: 'blur(16px)',
  };

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={buttonStyle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--ctz-accent-light)',
            color: 'var(--ctz-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ctz-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
              {profile?.nombre_completo || user.email}
            </span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--ctz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {roleLabel}
            </span>
          </div>
        </div>
        <HiChevronDown
          size={16}
          style={{
            color: 'var(--ctz-text-muted)',
            transition: 'transform 200ms ease-out',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {isOpen && (
        <div style={menuStyle} role="menu">
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--ctz-border)',
            background: 'var(--ctz-bg-secondary)',
          }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--ctz-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.nombre_completo || user.email}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--ctz-text-muted)', margin: '2px 0 0' }}>{user.email}</p>
          </div>
          <div style={{ padding: '4px 0' }}>
            {isAdmin && (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontSize: '0.8125rem',
                  color: 'var(--ctz-text-secondary)',
                  textDecoration: 'none',
                  transition: 'background 200ms ease-out, color 200ms ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--ctz-accent-light)';
                  e.currentTarget.style.color = 'var(--ctz-text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--ctz-text-secondary)';
                }}
              >
                <MdAdminPanelSettings size={18} style={{ color: 'var(--ctz-accent)' }} />
                Panel de administración
              </Link>
            )}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              role="menuitem"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                fontSize: '0.8125rem',
                color: 'var(--ctz-error)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 200ms ease-out',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--ctz-error-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <FiLogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        confirmTone="danger"
        confirmLabel="Cerrar sesión"
        title="¿Cerrar sesión?"
        message="Se cerrará tu sesión actual."
      />
    </div>
  );
}
