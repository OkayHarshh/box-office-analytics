"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Movies", path: "/" },
    { label: "Rankings", path: "/rankings" },
    { label: "Years", path: "/years" },
  ];

  return (
    <nav className="theatre-navbar sticky top-0 z-50">
      <div className="theatre-navbar-inner">
        <button
          onClick={() => router.push("/")}
          className="theatre-brand"
          aria-label="Box Office home"
        >
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              x="5"
              y="15"
              width="38"
              height="27"
              rx="2"
              fill="#4D1720"
              stroke="#D3B477"
              strokeWidth="1.5"
            />
            <path
              d="M5 15L9 5L44 10L40 20L5 15Z"
              fill="#D3B477"
              stroke="#E9D3A5"
              strokeWidth="1.3"
            />
            <path d="M14 6L21 7L17 17L10 16L14 6Z" fill="#291416" />
            <path d="M29 8L36 9L32 19L25 18L29 8Z" fill="#291416" />
            <path
              d="M13 27H35M13 33H29"
              stroke="#E9D3A5"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          <span>
            <strong>BOX OFFICE</strong>
            <small>THE CINEMA LEDGER</small>
          </span>
        </button>

        <div className="theatre-nav-links">
          {navItems.map((item) => {
            const active = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                aria-current={active ? "page" : undefined}
                className={active ? "active" : ""}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="navbar-status">
          <span />
          THE SHOW IS ON
        </div>
      </div>
    </nav>
  );
}