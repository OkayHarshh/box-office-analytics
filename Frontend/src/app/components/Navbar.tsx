"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b border-zinc-800 px-8 py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* LOGO */}

        <button
          onClick={() => router.push("/")}
          className="text-2xl font-bold tracking-tight hover:text-zinc-300"
        >
          BOX OFFICE
        </button>

        {/* NAVIGATION */}

        <div className="flex gap-8 text-sm">

          <button
            onClick={() => router.push("/")}
            className={
              isActive("/")
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }
          >
            Movies
          </button>

          <button
            onClick={() => router.push("/rankings")}
            className={
              isActive("/rankings")
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }
          >
            Rankings
          </button>

          <button
            onClick={() => router.push("/years")}
            className={
              isActive("/years")
                ? "text-white"
                : "text-zinc-400 hover:text-white"
            }
          >
            Years
          </button>

        </div>

      </div>
    </nav>
  );
}