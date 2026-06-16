// Liquid-glass displacement map generator.
//
// Recreates the Aave "Building Glass for the Web" technique: instead of random
// feTurbulence noise, we build a precise displacement map from the lens's own
// rounded-rect geometry. The bend is neutral in the centre and concentrated at
// the edges, exactly where light would refract through a real curved pane.
//
// The map's red/green channels encode how far each pixel bends horizontally and
// vertically. 128 (0.5) is neutral; everything outside the lens stays neutral so
// only the region under the glass moves. An SVG feDisplacementMap then reads this
// map and pushes the backdrop pixels accordingly.
//
// Two ideas borrowed straight from the article:
//   * four-fold symmetry — we compute only the top-left quadrant and mirror it
//     into the other three (negating X across the vertical axis, Y across the
//     horizontal), cutting per-pixel work to a quarter so it stays inside frame.
//   * a fresh filter id on every regen (see NavBar) so Safari can't serve a
//     stale, cached filter result.

// Signed distance + outward normal for a rounded rectangle centred at origin.
// `dist` is negative inside the shape; `nx,ny` is the unit normal pointing out.
function roundedRectField(px, py, halfW, halfH, r) {
  const ax = Math.abs(px);
  const ay = Math.abs(py);
  const qx = ax - (halfW - r);
  const qy = ay - (halfH - r);

  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  const dist = outside + inside - r;

  const sx = px < 0 ? -1 : 1;
  const sy = py < 0 ? -1 : 1;

  let nx;
  let ny;
  if (qx > 0 || qy > 0) {
    // On or past a straight edge / corner: normal follows the exterior offset.
    const gx = Math.max(qx, 0);
    const gy = Math.max(qy, 0);
    const len = Math.hypot(gx, gy) || 1;
    nx = (gx / len) * sx;
    ny = (gy / len) * sy;
  } else if (qx > qy) {
    // Interior, nearest to a vertical (left/right) edge.
    nx = sx;
    ny = 0;
  } else {
    // Interior, nearest to a horizontal (top/bottom) edge.
    nx = 0;
    ny = sy;
  }

  return { nx, ny, dist };
}

function setPixel(data, width, x, y, r, g) {
  const i = (y * width + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = 128; // blue unused by the displacement map
  data[i + 3] = 255; // opaque so the filter always has data to read
}

const clampByte = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * Build a displacement map PNG (as a data URL) for a rounded-rect lens.
 *
 * @param {object}  opts
 * @param {number}  opts.width      lens width in px
 * @param {number}  opts.height     lens height in px
 * @param {number}  opts.radius     corner radius in px
 * @param {number} [opts.depth]     thickness of the bent band measured inward
 *                                  from the edge (px). Larger = more glass.
 * @param {number} [opts.strength]  0..1 peak bend amount at the very edge.
 * @param {number} [opts.curvature] easing exponent for the edge->centre falloff.
 *                                  Higher = bend hugs the rim more tightly.
 * @returns {string} data URL of the generated map, or "" if canvas unavailable.
 */
export function generateDisplacementMap({
  width,
  height,
  radius,
  depth = 14,
  strength = 0.85,
  curvature = 1.8,
}) {
  if (typeof document === "undefined") return "";

  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const image = ctx.createImageData(w, h);
  const data = image.data;

  const halfW = w / 2;
  const halfH = h / 2;
  const r = Math.max(0, Math.min(radius, halfW, halfH));
  const band = Math.max(1, Math.min(depth, halfW, halfH));

  const cols = Math.ceil(w / 2);
  const rows = Math.ceil(h / 2);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = x + 0.5 - halfW;
      const py = y + 0.5 - halfH;
      const { nx, ny, dist } = roundedRectField(px, py, halfW, halfH, r);

      // Distance inside the lens, measured in from the edge.
      const inward = -dist;
      let mag = 0;
      if (inward >= 0 && inward <= band) {
        const t = 1 - inward / band; // 1 at the rim, 0 `band` px inside
        mag = Math.pow(t, curvature) * strength;
      }

      // Push samples toward the centre (opposite the outward normal) so the
      // edges act like a magnifying lens.
      const dx = -nx * mag;
      const dy = -ny * mag;
      const R = clampByte(Math.round(128 + dx * 127));
      const G = clampByte(Math.round(128 + dy * 127));

      const mx = w - 1 - x;
      const my = h - 1 - y;
      // X bend flips across the vertical axis, Y bend across the horizontal.
      const Rm = clampByte(Math.round(128 - dx * 127));
      const Gm = clampByte(Math.round(128 - dy * 127));

      setPixel(data, w, x, y, R, G);
      setPixel(data, w, mx, y, Rm, G);
      setPixel(data, w, x, my, R, Gm);
      setPixel(data, w, mx, my, Rm, Gm);
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}
