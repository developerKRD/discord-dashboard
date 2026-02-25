import type { DashboardTemplateRenderer } from "../Types";
import { renderAuroraLayout } from "./layouts/aurora";
import { renderCompactLayout } from "./layouts/compact";
import { renderCyberpunkLayout } from "./layouts/cyberpunk";
import { renderDefaultLayout } from "./layouts/default";
import { renderHologramLayout } from "./layouts/hologram";
import { renderNebulaLayout } from "./layouts/nebula";
import { renderShadcnMagicLayout } from "./layouts/shadcn-magic";

export const BuiltinLayouts = {
  default: renderDefaultLayout,
  compact: renderCompactLayout,
  "shadcn-magic": renderShadcnMagicLayout,
  aurora: renderAuroraLayout,
  cyberpunk: renderCyberpunkLayout,
  hologram: renderHologramLayout,
  nebula: renderNebulaLayout,
} satisfies Record<string, DashboardTemplateRenderer>;
