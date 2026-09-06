// Shared duration for the mobile drawer's slide/fade and the hamburger's
// morph into an X, so the two stay perceptibly in sync however either is tuned.
export const MENU_TRANSITION_MS = 450;

// A slow-start, slow-finish curve reads as more deliberate/visible than the
// default ease-out, without adding overshoot/bounce.
export const MENU_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
