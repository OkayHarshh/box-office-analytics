"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b border-[#2d2e34] bg-[#111216]/90 px-6 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.24)] backdrop-blur sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* LOGO */}

        <button
          onClick={() => router.push("/")}
          className="text-xl font-black uppercase tracking-[0.12em] text-[#d7c08d] hover:scale-[1.02] sm:text-2xl"
        >
          BOX OFFICE
        </button>

        {/* NAVIGATION */}

        <div className="nav-links flex gap-4 text-sm sm:gap-8">

          <button
            onClick={() => router.push("/")}
            className={
              isActive("/")
                ? "rounded-full border border-[#66583e] bg-[#302b22] px-3 py-1.5 text-[#d7c08d] shadow-[0_4px_16px_rgba(0,0,0,0.24)]"
                : "rounded-full px-3 py-1.5 text-[#a6a39c] hover:bg-[#24252a] hover:text-[#f2eee5]"
            }
          >
            Movies
          </button>

          <button
            onClick={() => router.push("/rankings")}
            className={
              isActive("/rankings")
                ? "rounded-full border border-[#66583e] bg-[#302b22] px-3 py-1.5 text-[#d7c08d] shadow-[0_4px_16px_rgba(0,0,0,0.24)]"
                : "rounded-full px-3 py-1.5 text-[#a6a39c] hover:bg-[#24252a] hover:text-[#f2eee5]"
            }
          >
            Rankings
          </button>

          <button
            onClick={() => router.push("/years")}
            className={
              isActive("/years")
                ? "rounded-full border border-[#66583e] bg-[#302b22] px-3 py-1.5 text-[#d7c08d] shadow-[0_4px_16px_rgba(0,0,0,0.24)]"
                : "rounded-full px-3 py-1.5 text-[#a6a39c] hover:bg-[#24252a] hover:text-[#f2eee5]"
            }
          >
            Years
          </button>

        </div>

      </div>
    </nav>
  );
}
