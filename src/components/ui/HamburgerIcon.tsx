import { MENU_TRANSITION_MS, MENU_EASING } from "@/lib/motion";

// Split evenly: bars widen to match, then rotate/fade into the X — the two
// phases together must add up to MENU_TRANSITION_MS to stay in lockstep with
// the drawer's own slide/fade, which runs for the same total duration.
const WIDEN_MS = MENU_TRANSITION_MS / 2;
const MORPH_MS = MENU_TRANSITION_MS / 2;
const EASE = MENU_EASING;

export function HamburgerIcon({ open }: { open: boolean }) {
  const bar = "absolute left-0 h-0.5 rounded-full bg-cream";

  return (
    <span className="relative block h-4 w-6" aria-hidden="true">
      {/* Top bar: full-width at rest; rotates into the X's first stroke. */}
      <span
        className={`${bar} w-6 ${open ? "top-[7px] rotate-45" : "top-0 rotate-0"}`}
        style={{
          transition: open
            ? `top ${MORPH_MS}ms ${EASE} ${WIDEN_MS}ms, transform ${MORPH_MS}ms ${EASE} ${WIDEN_MS}ms`
            : `top ${MORPH_MS}ms ${EASE}, transform ${MORPH_MS}ms ${EASE}`,
        }}
      />
      {/* Middle bar: widens to match the top bar first, then fades away. */}
      <span
        className={`${bar} top-[7px] ${open ? "w-6 opacity-0" : "w-[18px] opacity-100"}`}
        style={{
          transition: open
            ? `width ${WIDEN_MS}ms ${EASE}, opacity ${MORPH_MS}ms ${EASE} ${WIDEN_MS}ms`
            : `opacity ${MORPH_MS}ms ${EASE}, width ${WIDEN_MS}ms ${EASE} ${MORPH_MS}ms`,
        }}
      />
      {/* Bottom bar: widens first, then rotates into the X's second stroke. */}
      <span
        className={`${bar} ${open ? "top-[7px] w-6 -rotate-45" : "top-[14px] w-3 rotate-0"}`}
        style={{
          transition: open
            ? `width ${WIDEN_MS}ms ${EASE}, top ${MORPH_MS}ms ${EASE} ${WIDEN_MS}ms, transform ${MORPH_MS}ms ${EASE} ${WIDEN_MS}ms`
            : `top ${MORPH_MS}ms ${EASE}, transform ${MORPH_MS}ms ${EASE}, width ${WIDEN_MS}ms ${EASE} ${MORPH_MS}ms`,
        }}
      />
    </span>
  );
}
