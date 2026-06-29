import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Github, Home, Linkedin, Moon, PackageOpen, Sun, Twitter, UserRound, FileText } from "lucide-react";
import useTheme from "./useTheme";
import { generateDisplacementMap } from "./liquidGlass";

const navLinks = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/about", label: "About", Icon: UserRound },
  { href: "/projects", label: "Projects", Icon: PackageOpen },
  { href: "/bookshelf", label: "Books", Icon: BookOpen },
];

// Lens geometry for the glass. `scale` controls how hard the backdrop bends.
const GLASS_RADIUS = 9999; // clamped to half-height inside the generator
const GLASS_DEPTH = 16; // px band, inward from the rim, that refracts
const GLASS_SCALE = 22; // peak pixel displacement fed to feDisplacementMap

// iOS-style springs: snappy capsule pop + tactile press.
const CAPSULE_SPRING = { type: "spring", stiffness: 460, damping: 26, mass: 0.7 };
const PRESS_SPRING = { type: "spring", stiffness: 600, damping: 28 };

const cellInner = "relative grid h-10 w-10 place-items-center rounded-full sm:h-11 sm:w-11";

// A single tappable cell: shared press/hover spring + a hover tooltip.
function Cell({ item, theme, children }) {
  return (
    <motion.div
      className={`group relative ${item.social ? "hidden sm:block" : "block"}`}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.82 }}
      transition={PRESS_SPRING}
    >
      <span
        className={`pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black px-3 py-1.5 text-xs font-semibold opacity-0 shadow-xl shadow-black/30 transition-opacity duration-150 group-hover:opacity-100 ${theme.tooltip}`}
      >
        {item.label}
      </span>
      {children}
    </motion.div>
  );
}

const iconFor = (Icon, active, theme) => (
  <Icon
    className={`relative z-10 ${active ? theme.active : `${theme.idle} ${theme.idleHover}`} transition-colors duration-200`}
    size={18}
    strokeWidth={active ? 2.6 : 2.1}
    // Filled look on the active tab, like SF Symbols' filled variant.
    fill={active ? "currentColor" : "none"}
    fillOpacity={active ? 0.16 : 0}
  />
);

function NavBar() {
  const { isLight, isTransitioning, toggleTheme } = useTheme();
  const pathname = typeof window === "undefined" ? "/" : window.location.pathname;

  // Palette adapts to the page behind the glass so icons stay legible on both
  // the dark and light backgrounds.
  const theme = isLight
    ? {
        bar: "border-white/60 bg-white/30",
        idle: "text-zinc-500",
        idleHover: "hover:text-zinc-900",
        active: "text-emerald-600",
        capsule: "bg-white ring-1 ring-zinc-950/[0.06] shadow-[0_4px_12px_rgba(24,24,27,0.16)]",
        divider: "border-zinc-400/50",
        tooltip: "bg-zinc-900 text-[#ffffff]",
        sheen: "bg-[linear-gradient(180deg,rgba(255,255,255,0.7)_0%,rgba(255,255,255,0.12)_22%,transparent_46%)]",
      }
    : {
        bar: "border-white/15 bg-zinc-900/35",
        idle: "text-zinc-300",
        idleHover: "hover:text-white",
        active: "text-emerald-300",
        capsule: "bg-white/15 ring-1 ring-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.4)]",
        divider: "border-white/20",
        tooltip: "bg-white text-zinc-900",
        sheen: "bg-[linear-gradient(180deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.08)_22%,transparent_46%)]",
      };

  // --- Liquid glass plumbing -------------------------------------------------
  const dockRef = useRef(null);
  const baseFilterId = useId().replace(/[:]/g, "");
  const [glass, setGlass] = useState({ map: "", width: 0, height: 0, version: 0 });

  useLayoutEffect(() => {
    const node = dockRef.current;
    if (!node) return undefined;

    let frame = 0;
    const regenerate = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width === 0 || height === 0) return;

      // Skip work when the shape hasn't changed — the map is portable across
      // position, only its *shape* matters (per the Aave write-up).
      setGlass((prev) => {
        if (prev.width === width && prev.height === height && prev.map) return prev;
        const map = generateDisplacementMap({
          width,
          height,
          radius: Math.min(GLASS_RADIUS, height / 2),
          depth: GLASS_DEPTH,
        });
        // Bump version -> fresh filter id so Safari can't serve a stale,
        // ID-cached filter result and freeze the glass mid-resize.
        return { map, width, height, version: prev.version + 1 };
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(regenerate);
    };

    schedule();
    const observer = new ResizeObserver(schedule);
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const filterId = `${baseFilterId}-${glass.version}`;
  const glassReady = Boolean(glass.map);

  const activePath = useMemo(() => {
    if (pathname.startsWith("/projects")) return "/projects";
    if (pathname.startsWith("/bookshelf")) return "/bookshelf";
    if (pathname.startsWith("/about")) return "/about";
    return "/";
  }, [pathname]);

  const utilityItems = useMemo(
    () => [
      {
        href: "https://github.com/lakshay-devs",
        label: "GitHub",
        Icon: Github,
        type: "external",
        social: true,
      },
      {
        href: "https://www.linkedin.com/in/lakshay-goyal-9778a6246/",
        label: "LinkedIn",
        Icon: Linkedin,
        type: "external",
        social: true,
      },
      {
        href: "https://x.com/lakshayg2004",
        label: "X",
        Icon: Twitter,
        type: "external",
        social: true,
      },
      {
        href: "/Lakshay_Resume.pdf",
        label: "Resume",
        Icon: FileText,
        type: "external",
      },
      {
        label: isLight ? "Dark mode" : "Light mode",
        Icon: isLight ? Moon : Sun,
        type: "button",
        onClick: (event) => toggleTheme(event.currentTarget),
      },
    ],
    [isLight, toggleTheme]
  );

  const renderRoute = (item) => {
    const active = activePath === item.href;
    return (
      <Cell key={item.href} item={item} theme={theme}>
        <a href={item.href} aria-label={item.label} aria-current={active ? "page" : undefined} className={cellInner}>
          {active && (
            // iOS-native selection: the capsule springs/pops into place right
            // after the tab switch (plays on mount, since nav reloads the page).
            <motion.span
              aria-hidden="true"
              className={`absolute inset-0 rounded-full ${theme.capsule}`}
              initial={{ scale: 0.35, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={CAPSULE_SPRING}
            />
          )}
          {iconFor(item.Icon, active, theme)}
        </a>
      </Cell>
    );
  };

  const renderUtility = (item) => {
    const shared = { "aria-label": item.label, className: cellInner };
    if (item.type === "button") {
      return (
        <Cell key={item.label} item={item} theme={theme}>
          <button type="button" onClick={item.onClick} disabled={isTransitioning} aria-pressed={isLight} {...shared}>
            {iconFor(item.Icon, false, theme)}
          </button>
        </Cell>
      );
    }
    return (
      <Cell key={item.href} item={item} theme={theme}>
        <a href={item.href} target="_blank" rel="noopener noreferrer" {...shared}>
          {iconFor(item.Icon, false, theme)}
        </a>
      </Cell>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-3 z-50 px-3 sm:bottom-5" aria-label="Primary navigation">
      {/* Off-screen SVG holding the refraction filter. feImage carries the
          generated displacement map; feDisplacementMap bends the backdrop the
          glass sits over. Re-rendered with a fresh id on every resize. */}
      {glassReady && (
        <svg aria-hidden="true" className="pointer-events-none absolute h-0 w-0" width="0" height="0">
          <defs>
            <filter id={filterId} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
              <feImage
                href={glass.map}
                x="0"
                y="0"
                width={glass.width}
                height={glass.height}
                preserveAspectRatio="none"
                result="map"
              />
              <feDisplacementMap in="SourceGraphic" in2="map" scale={GLASS_SCALE} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={dockRef}
        className={`liquid-glass relative mx-auto flex w-max max-w-full items-center gap-1.5 rounded-full border p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.55)] sm:gap-2 ${theme.bar}`}
        style={{
          backdropFilter: glassReady
            ? `blur(2px) url(#${filterId}) saturate(1.4) brightness(1.04)`
            : "blur(14px) saturate(1.4)",
          WebkitBackdropFilter: glassReady
            ? `blur(2px) url(#${filterId}) saturate(1.4) brightness(1.04)`
            : "blur(14px) saturate(1.4)",
        }}
      >
        {/* Specular sheen: a soft top-edge highlight that keeps the glass
            legible against whatever scrolls underneath it. */}
        <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-full mix-blend-screen ${theme.sheen}`} />

        <div className="relative flex items-center gap-1.5 sm:gap-2">{navLinks.map(renderRoute)}</div>

        <div className={`relative mx-0.5 h-7 w-px border-l border-dashed ${theme.divider}`} />

        <div className="relative flex items-center gap-1.5 sm:gap-2">{utilityItems.map(renderUtility)}</div>
      </div>
    </nav>
  );
}

export default NavBar;
