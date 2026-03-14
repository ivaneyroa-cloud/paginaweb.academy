"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineUserCircle, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { ConfirmModal } from "@/shared/components/modals/ConfirmModal";

export function UserMenu({ isMobile = false }) {
  const supabase = useMemo(() => createClient(), []);
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

  const isAdmin = (profile?.rol || "").toLowerCase() === "admin";

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
        className={`${isMobile ? "w-full" : "w-48"} h-11 rounded-xl bg-slate-100 animate-pulse`}
      />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className={`${
          isMobile ? "w-full justify-center" : ""
        } flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl shadow hover:bg-sky-700 transition`}
      >
        <HiOutlineUserCircle size={20} />
        <span className="font-semibold">Iniciar Sesión</span>
      </Link>
    );
  }

  const buttonClasses = isMobile
    ? "w-full flex items-center justify-between px-4 py-3 rounded-xl border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50 transition"
    : "flex items-center gap-3 px-3 py-2 rounded-xl border border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50 transition";

  const menuClasses = isMobile
    ? "absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
    : "absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50";

  return (
    <div className={`relative ${isMobile ? "w-full" : ""}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClasses}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="cursor-pointer flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            {initials}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold text-slate-800 line-clamp-1">
              {profile?.nombre_completo || user.email}
            </span>
            <span className="text-xs text-slate-500 uppercase">{profile?.rol || "Usuario"}</span>
          </div>
        </div>
        {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
      </button>

      {isOpen && (
        <div className={menuClasses} role="menu">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="text-sm font-semibold text-slate-800 line-clamp-1">
              {profile?.nombre_completo || user.email}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <MdAdminPanelSettings size={18} className="text-purple-600" />
                Ir al panel de administración
              </Link>
            )}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              role="menuitem"
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
