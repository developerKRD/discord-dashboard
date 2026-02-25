import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderHologramLayout(context: DashboardTemplateRenderContext): string {
  const safeName = escapeHtml(context.dashboardName);
  const design = context.setupDesign ?? {};

  const clientScript = getClientScript(context.basePath, design);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: ${design.bg ?? "#04060c"};
      --rail: ${design.rail ?? "#080b14"};
      --content-bg: ${design.contentBg ?? "#060912"};
      --panel: ${design.panel ?? "rgba(14, 20, 36, 0.45)"};
      --panel-2: ${design.panel2 ?? "rgba(10, 16, 30, 0.35)"};
      --text: ${design.text ?? "#e8edf6"};
      --muted: ${design.muted ?? "#7a8bb0"};
      --primary: ${design.primary ?? "#60a5fa"};
      --primary-glow: rgba(96, 165, 250, 0.3);
      --accent: ${design.accent ?? "#a78bfa"};
      --accent-glow: rgba(167, 139, 250, 0.25);
      --holo-1: rgba(96, 165, 250, 0.12);
      --holo-2: rgba(167, 139, 250, 0.10);
      --holo-3: rgba(52, 211, 153, 0.08);
      --holo-4: rgba(244, 114, 182, 0.06);
      --success: ${design.success ?? "#34d399"};
      --warning: ${design.warning ?? "#fbbf24"};
      --danger: ${design.danger ?? "#f87171"};
      --border: ${design.border ?? "rgba(96, 165, 250, 0.08)"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
    }

    /* Holographic shimmer background */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 80% 50% at 15% 20%, var(--holo-1), transparent),
        radial-gradient(ellipse 60% 40% at 75% 15%, var(--holo-2), transparent),
        radial-gradient(ellipse 70% 45% at 50% 80%, var(--holo-3), transparent),
        radial-gradient(ellipse 50% 30% at 90% 60%, var(--holo-4), transparent);
      animation: holoShift 16s ease-in-out infinite alternate;
    }

    @keyframes holoShift {
      0% { opacity: 0.8; filter: hue-rotate(0deg); }
      33% { opacity: 1; filter: hue-rotate(15deg); }
      66% { opacity: 0.9; filter: hue-rotate(-10deg); }
      100% { opacity: 0.85; filter: hue-rotate(5deg); }
    }

    /* Floating particle effect via dot grid */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image: radial-gradient(circle, rgba(96, 165, 250, 0.06) 1px, transparent 1px);
      background-size: 32px 32px;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 70%);
    }

    /* ─── SHELL ─── */
    .shell {
      position: relative;
      z-index: 1;
      height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    /* ─── TOP BAR ─── */
    .topbar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 20px;
      padding: 0 24px;
      height: 54px;
      background: rgba(4, 6, 12, 0.65);
      backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2);
      border-bottom: 1px solid var(--border);
      position: relative;
    }

    /* Holographic rainbow line */
    .topbar::after {
      content: "";
      position: absolute;
      bottom: -1px; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent,
        rgba(96, 165, 250, 0.5),
        rgba(167, 139, 250, 0.5),
        rgba(52, 211, 153, 0.4),
        rgba(244, 114, 182, 0.3),
        transparent
      );
    }

    .brand {
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 0.4px;
      background: linear-gradient(135deg, var(--primary), var(--accent), #34d399);
      background-size: 200% 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      animation: brandShimmer 4s ease-in-out infinite;
    }

    @keyframes brandShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .center-title {
      text-align: center;
      font-weight: 600;
      font-size: 13px;
      color: var(--muted);
      letter-spacing: 0.3px;
    }

    .pill {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(14, 20, 36, 0.4);
      backdrop-filter: blur(12px);
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
    }

    /* ─── BODY LAYOUT ─── */
    .layout {
      display: grid;
      grid-template-columns: 72px 1fr;
      min-height: 0;
      overflow: hidden;
    }

    /* ─── SERVER RAIL ─── */
    .sidebar {
      background: rgba(4, 6, 12, 0.5);
      backdrop-filter: blur(16px);
      border-right: 1px solid var(--border);
      padding: 14px 0;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .sidebar::-webkit-scrollbar { display: none; }

    .server-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-height: min-content;
    }

    .server-item {
      position: relative;
      width: 46px !important; height: 46px !important;
      min-width: 46px !important; min-height: 46px !important;
      flex: 0 0 46px !important;
      border-radius: 14px;
      border: 1px solid var(--border);
      background: rgba(14, 20, 36, 0.4);
      backdrop-filter: blur(8px);
      color: var(--text);
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: visible;
      padding: 0;
    }
    .server-item:hover {
      border-color: rgba(96, 165, 250, 0.35);
      background: rgba(96, 165, 250, 0.08);
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 4px 20px rgba(96, 165, 250, 0.1);
    }
    .server-item.active {
      border-color: rgba(167, 139, 250, 0.5);
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.12), rgba(167, 139, 250, 0.1));
      box-shadow:
        0 0 0 1px rgba(167, 139, 250, 0.15),
        0 4px 20px rgba(167, 139, 250, 0.12),
        inset 0 0 20px rgba(96, 165, 250, 0.05);
    }

    .server-item-indicator {
      position: absolute;
      left: -10px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 0;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      box-shadow: 0 0 8px var(--primary-glow);
      opacity: 0;
      transition: all 0.25s ease;
    }
    .server-item.active .server-item-indicator {
      opacity: 1; height: 24px;
    }

    .server-avatar {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .server-fallback {
      display: grid; place-items: center;
      width: 100%; height: 100%;
      font-size: 12px; font-weight: 700;
      color: var(--primary);
    }
    .server-status {
      position: absolute;
      right: -3px; bottom: -3px;
      width: 10px; height: 10px;
      border-radius: 999px;
      border: 2px solid rgba(4, 6, 12, 0.8);
      background: var(--success);
      box-shadow: 0 0 6px rgba(52, 211, 153, 0.4);
    }
    .server-status.offline { background: var(--muted); box-shadow: none; }

    /* ─── CONTENT ─── */
    .content {
      min-width: 0;
      padding: 20px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(96, 165, 250, 0.15) transparent;
    }
    .content::-webkit-scrollbar { width: 4px; }
    .content::-webkit-scrollbar-thumb { background: rgba(96, 165, 250, 0.15); border-radius: 2px; }

    .container {
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(1.1); -webkit-backdrop-filter: blur(20px) saturate(1.1);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* Iridescent top border on container */
    .container::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg,
        transparent 5%,
        rgba(96, 165, 250, 0.4),
        rgba(167, 139, 250, 0.4),
        rgba(52, 211, 153, 0.3),
        transparent 95%
      );
    }

    /* ─── TABS ─── */
    .main-tabs {
      display: inline-flex;
      gap: 4px;
      padding: 3px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border);
      margin-bottom: 18px;
    }

    button {
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: 10px;
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    button:hover { color: var(--text); background: rgba(96, 165, 250, 0.06); }

    button.primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none; color: #fff;
      font-weight: 700;
      box-shadow: 0 2px 14px var(--primary-glow);
    }
    button.primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 22px var(--primary-glow);
    }
    button.danger {
      background: rgba(248, 113, 113, 0.1);
      border-color: rgba(248, 113, 113, 0.25);
      color: var(--danger);
    }

    .main-tab.active, .home-category-btn.active {
      background: linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.12));
      border-color: rgba(96, 165, 250, 0.3);
      color: var(--primary);
      box-shadow: 0 0 10px rgba(96, 165, 250, 0.08);
    }

    /* ─── SECTION ─── */
    .section-title {
      font-size: 16px;
      font-weight: 700;
      margin: 14px 0 12px;
      letter-spacing: 0.2px;
      background: linear-gradient(135deg, var(--text), var(--primary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 12px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); }

    .panel {
      background: var(--panel);
      backdrop-filter: blur(16px) saturate(1.1); -webkit-backdrop-filter: blur(16px) saturate(1.1);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 18px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    /* Holographic shimmer on panels */
    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg,
        rgba(96, 165, 250, 0.04),
        rgba(167, 139, 250, 0.03),
        rgba(52, 211, 153, 0.02)
      );
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    .panel:hover {
      transform: translateY(-3px);
      border-color: rgba(96, 165, 250, 0.2);
      box-shadow:
        0 8px 28px rgba(0, 0, 0, 0.25),
        0 0 20px rgba(96, 165, 250, 0.05),
        0 0 40px rgba(167, 139, 250, 0.03);
    }
    .panel:hover::before { opacity: 1; }

    .title {
      color: var(--primary);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    .value {
      font-size: 24px;
      font-weight: 800;
      margin-top: 6px;
      background: linear-gradient(135deg, #fff, var(--primary), var(--accent));
      background-size: 200% 200%;
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      animation: valueShimmer 6s ease-in-out infinite;
    }

    @keyframes valueShimmer {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    .subtitle {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    /* ─── HOME SECTIONS ─── */
    .home-categories {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    .home-sections {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 6px); max-width: calc(50% - 6px); }
    .home-width-33 { flex-basis: calc(33.333% - 8px); max-width: calc(33.333% - 8px); }
    .home-width-20 { flex-basis: calc(20% - 9.6px); max-width: calc(20% - 9.6px); }

    /* ─── FORM ELEMENTS ─── */
    .home-fields, .plugin-fields { display: grid; gap: 10px; margin-top: 12px; }
    .home-field, .plugin-field { display: grid; gap: 5px; }
    .home-field label, .plugin-field > label {
      color: var(--muted);
      font-size: 11px; font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .home-input, .home-textarea, .home-select {
      width: 100%;
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(8px);
      color: var(--text);
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .home-input:focus, .home-textarea:focus, .home-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow), 0 0 16px rgba(96, 165, 250, 0.06);
      background: rgba(0, 0, 0, 0.3);
    }
    .home-textarea { min-height: 80px; resize: vertical; }
    .home-checkbox { width: 16px; height: 16px; accent-color: var(--primary); }
    .home-field-row { display: flex; align-items: center; gap: 8px; }
    .home-message { margin-top: 6px; color: var(--muted); font-size: 12px; }

    .lookup-wrap { position: relative; }
    .lookup-results {
      position: absolute; left: 0; right: 0;
      top: calc(100% + 4px);
      z-index: 20;
      border: 1px solid var(--border);
      background: rgba(4, 6, 12, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(96, 165, 250, 0.05);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0;
      text-align: left; padding: 9px 14px;
      background: transparent; color: var(--text);
      font-size: 13px;
    }
    .lookup-item:hover { background: rgba(96, 165, 250, 0.08); }
    .lookup-selected { margin-top: 4px; font-size: 11px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border); border-radius: 10px;
      padding: 8px 12px; background: var(--panel-2);
      font-size: 13px; backdrop-filter: blur(8px);
    }
    .list-editor {
      border: 1px solid var(--border); border-radius: 12px;
      background: rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(8px);
      padding: 10px; display: grid; gap: 8px;
    }
    .list-items { display: grid; gap: 6px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 7px 10px; background: rgba(14, 20, 36, 0.3);
      transition: border-color 0.2s ease;
    }
    .list-item:hover { border-color: rgba(96, 165, 250, 0.2); }
    .list-item.dragging { opacity: 0.5; }
    .drag-handle { color: var(--muted); user-select: none; font-size: 14px; }
    .list-input { width: 100%; border: none; outline: none; background: transparent; color: var(--text); font-size: 13px; font-family: inherit; }
    .list-add { justify-self: start; }
    .empty { color: var(--muted); font-size: 13px; padding: 8px 0; }
    .cursor-pointer { cursor: pointer; }

    @media (max-width: 900px) {
      .layout { grid-template-columns: 60px 1fr; }
      .server-item {
        width: 38px !important; height: 38px !important;
        min-width: 38px !important; min-height: 38px !important;
        flex: 0 0 38px !important;
        border-radius: 12px;
      }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
    }
    @media (max-width: 640px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .topbar { grid-template-columns: 1fr auto; }
      .center-title { display: none; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .container { animation: fadeUp 0.35s ease-out; }

    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">${safeName}</div>
      <div id="centerTitle" class="center-title">Holographic Interface</div>
      <div id="userMeta" class="pill">Loading...</div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <div id="serverRail" class="server-rail"></div>
      </aside>

      <main class="content">
        <div class="container">
          <div class="main-tabs">
            <button id="tabHome" class="main-tab active cursor-pointer">Home</button>
            <button id="tabPlugins" class="main-tab cursor-pointer">Plugins</button>
          </div>

          <section id="homeArea">
            <div class="section-title">System Interface</div>
            <section id="homeCategories" class="home-categories"></section>
            <section id="homeSections" class="home-sections"></section>

            <section id="overviewArea">
              <div class="section-title">Telemetry</div>
              <section id="overviewCards" class="grid cards"></section>
            </section>
          </section>

          <section id="pluginsArea" style="display:none;">
            <div class="section-title">Extensions</div>
            <section id="plugins" class="grid"></section>
          </section>
        </div>
      </main>
    </div>
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
