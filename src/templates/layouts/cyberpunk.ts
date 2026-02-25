import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderCyberpunkLayout(context: DashboardTemplateRenderContext): string {
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
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: ${design.bg ?? "#0a0a0f"};
      --rail: ${design.rail ?? "#0e0e15"};
      --content-bg: ${design.contentBg ?? "#0c0c12"};
      --panel: ${design.panel ?? "rgba(16, 16, 24, 0.9)"};
      --panel-2: ${design.panel2 ?? "rgba(22, 22, 32, 0.8)"};
      --text: ${design.text ?? "#e4e4ef"};
      --muted: ${design.muted ?? "#6b6b8a"};
      --primary: ${design.primary ?? "#ec4899"};
      --primary-glow: rgba(236, 72, 153, 0.35);
      --accent: ${design.accent ?? "#06b6d4"};
      --accent-glow: rgba(6, 182, 212, 0.3);
      --success: ${design.success ?? "#10b981"};
      --warning: ${design.warning ?? "#eab308"};
      --danger: ${design.danger ?? "#ef4444"};
      --border: ${design.border ?? "rgba(236, 72, 153, 0.12)"};
      --border-accent: rgba(6, 182, 212, 0.15);
      --neon-pink: rgba(236, 72, 153, 0.7);
      --neon-cyan: rgba(6, 182, 212, 0.7);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
    }

    /* Scanline overlay */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 100;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.04) 2px,
        rgba(0, 0, 0, 0.04) 4px
      );
    }

    /* Neon glow accents in corners */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse at 0% 0%, rgba(236, 72, 153, 0.08), transparent 35%),
        radial-gradient(ellipse at 100% 100%, rgba(6, 182, 212, 0.06), transparent 35%);
    }

    /* ─── SHELL ─── */
    .shell {
      position: relative;
      z-index: 1;
      height: 100vh;
      display: grid;
      grid-template-columns: 70px 1fr;
      grid-template-rows: auto 1fr;
    }

    /* ─── TOP BAR ─── */
    .topbar {
      grid-column: 1 / -1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      height: 48px;
      background: rgba(10, 10, 15, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: relative;
    }

    /* Pink neon line at top */
    .topbar::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon-pink), var(--neon-cyan), transparent);
    }

    .brand {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--primary);
      text-shadow: 0 0 12px var(--primary-glow);
    }

    .topbar-center {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .center-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent);
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 4px 12px;
      border: 1px solid var(--border-accent);
      background: rgba(6, 182, 212, 0.06);
    }

    .main-tabs {
      display: flex;
      gap: 2px;
    }

    .main-tab {
      font-family: 'JetBrains Mono', monospace;
      padding: 5px 14px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--muted);
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .main-tab:first-child { border-radius: 4px 0 0 4px; }
    .main-tab:last-child { border-radius: 0 4px 4px 0; }
    .main-tab:hover { background: rgba(236, 72, 153, 0.06); color: var(--text); }
    .main-tab.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
      text-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .pill {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      color: var(--muted);
      padding: 4px 10px;
      border: 1px solid var(--border);
      letter-spacing: 0.5px;
    }

    /* ─── SERVER RAIL ─── */
    .sidebar {
      background: var(--rail);
      border-right: 1px solid var(--border);
      padding: 8px 0;
      overflow-y: auto;
      scrollbar-width: none;
      position: relative;
    }
    .sidebar::-webkit-scrollbar { display: none; }

    /* Cyan neon line on right edge */
    .sidebar::after {
      content: "";
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 1px;
      background: linear-gradient(180deg, var(--neon-pink), transparent 30%, transparent 70%, var(--neon-cyan));
    }

    .server-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      min-height: min-content;
    }

    .server-item {
      position: relative;
      width: 46px !important; height: 46px !important;
      min-width: 46px !important; min-height: 46px !important;
      flex: 0 0 46px !important;
      border-radius: 4px;
      border: 1px solid var(--border);
      background: var(--panel);
      color: var(--text);
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      overflow: visible;
      padding: 0;
    }
    .server-item:hover {
      border-color: var(--primary);
      box-shadow: 0 0 10px var(--primary-glow), inset 0 0 10px rgba(236, 72, 153, 0.05);
      transform: scale(1.05);
    }
    .server-item.active {
      border-color: var(--accent);
      box-shadow: 0 0 14px var(--accent-glow), inset 0 0 14px rgba(6, 182, 212, 0.08);
      background: rgba(6, 182, 212, 0.08);
    }

    .server-item-indicator {
      position: absolute;
      left: -9px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 0;
      background: var(--accent);
      box-shadow: 0 0 8px var(--accent-glow);
      opacity: 0;
      transition: all 0.2s ease;
    }
    .server-item.active .server-item-indicator {
      opacity: 1; height: 22px;
    }

    .server-avatar {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .server-fallback {
      display: grid; place-items: center;
      width: 100%; height: 100%;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px; font-weight: 700;
      color: var(--primary);
    }
    .server-status {
      position: absolute;
      right: -3px; bottom: -3px;
      width: 9px; height: 9px;
      border-radius: 2px;
      border: 2px solid var(--rail);
      background: var(--success);
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
    }
    .server-status.offline { background: var(--muted); box-shadow: none; }

    /* ─── CONTENT ─── */
    .content {
      min-width: 0;
      padding: 14px;
      overflow-y: auto;
      background: var(--content-bg);
      scrollbar-width: thin;
      scrollbar-color: rgba(236, 72, 153, 0.2) transparent;
    }
    .content::-webkit-scrollbar { width: 4px; }
    .content::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.2); border-radius: 2px; }

    .container {
      border: 1px solid var(--border);
      background: var(--panel);
      padding: 16px;
      position: relative;
    }

    /* Corner accents on container */
    .container::before,
    .container::after {
      content: "";
      position: absolute;
      width: 12px; height: 12px;
      border-color: var(--accent);
      border-style: solid;
    }
    .container::before {
      top: -1px; left: -1px;
      border-width: 2px 0 0 2px;
    }
    .container::after {
      bottom: -1px; right: -1px;
      border-width: 0 2px 2px 0;
    }

    /* ─── SECTION ─── */
    .section-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 14px 0 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-accent);
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 10px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    .panel {
      background: var(--panel-2);
      border: 1px solid var(--border);
      padding: 16px;
      transition: all 0.2s ease;
      position: relative;
    }
    .panel::before {
      content: "";
      position: absolute;
      top: 0; left: 0;
      width: 0; height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent));
      transition: width 0.3s ease;
    }
    .panel:hover {
      border-color: rgba(236, 72, 153, 0.25);
      box-shadow: 0 0 16px rgba(236, 72, 153, 0.06), 0 4px 16px rgba(0, 0, 0, 0.3);
    }
    .panel:hover::before { width: 100%; }

    .title {
      font-family: 'JetBrains Mono', monospace;
      color: var(--primary);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 24px;
      font-weight: 800;
      margin-top: 6px;
      color: var(--accent);
      text-shadow: 0 0 20px var(--accent-glow);
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
      margin-bottom: 12px;
    }

    .home-category-btn.active {
      background: rgba(6, 182, 212, 0.1);
      border-color: rgba(6, 182, 212, 0.4);
      color: var(--accent);
      box-shadow: 0 0 8px rgba(6, 182, 212, 0.1);
    }

    .home-sections {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }
    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 5px); max-width: calc(50% - 5px); }
    .home-width-33 { flex-basis: calc(33.333% - 6.67px); max-width: calc(33.333% - 6.67px); }
    .home-width-20 { flex-basis: calc(20% - 8px); max-width: calc(20% - 8px); }

    /* ─── FORM ELEMENTS ─── */
    button {
      font-family: 'JetBrains Mono', monospace;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text);
      border-radius: 2px;
      padding: 7px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    button:hover {
      background: rgba(236, 72, 153, 0.08);
      border-color: var(--primary);
      box-shadow: 0 0 8px var(--primary-glow);
    }
    button.primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #fff;
      box-shadow: 0 0 14px var(--primary-glow);
    }
    button.primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 0 22px var(--primary-glow);
    }
    button.danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.4);
      color: var(--danger);
    }

    .home-fields, .plugin-fields { display: grid; gap: 10px; margin-top: 10px; }
    .home-field, .plugin-field { display: grid; gap: 5px; }
    .home-field label, .plugin-field > label {
      font-family: 'JetBrains Mono', monospace;
      color: var(--muted);
      font-size: 10px; font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .home-input, .home-textarea, .home-select {
      width: 100%;
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.4);
      color: var(--text);
      border-radius: 2px;
      padding: 9px 12px;
      font-size: 13px;
      font-family: 'JetBrains Mono', monospace;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .home-input:focus, .home-textarea:focus, .home-select:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 1px var(--accent-glow), 0 0 12px var(--accent-glow);
    }
    .home-textarea { min-height: 80px; resize: vertical; }
    .home-checkbox { width: 16px; height: 16px; accent-color: var(--primary); }
    .home-field-row { display: flex; align-items: center; gap: 8px; }
    .home-message {
      font-family: 'JetBrains Mono', monospace;
      margin-top: 6px;
      color: var(--accent);
      font-size: 11px;
    }

    .lookup-wrap { position: relative; }
    .lookup-results {
      position: absolute; left: 0; right: 0;
      top: calc(100% + 4px);
      z-index: 20;
      border: 1px solid var(--border);
      background: rgba(10, 10, 15, 0.97);
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.1), 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0;
      text-align: left; padding: 8px 12px;
      background: transparent; color: var(--text);
      font-size: 12px;
    }
    .lookup-item:hover { background: rgba(236, 72, 153, 0.1); }
    .lookup-selected { margin-top: 4px; font-size: 10px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
    .actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 12px; }

    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border);
      padding: 7px 10px; background: var(--panel-2);
      font-size: 12px;
    }
    .list-editor {
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.3);
      padding: 8px; display: grid; gap: 6px;
    }
    .list-items { display: grid; gap: 4px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border);
      padding: 6px 8px; background: var(--panel);
      transition: border-color 0.15s ease;
    }
    .list-item:hover { border-color: var(--primary); }
    .list-item.dragging { opacity: 0.5; }
    .drag-handle { color: var(--primary); user-select: none; font-size: 14px; }
    .list-input { width: 100%; border: none; outline: none; background: transparent; color: var(--text); font-size: 13px; font-family: 'JetBrains Mono', monospace; }
    .list-add { justify-self: start; }
    .empty { color: var(--muted); font-size: 12px; font-family: 'JetBrains Mono', monospace; padding: 8px 0; }
    .cursor-pointer { cursor: pointer; }

    @media (max-width: 980px) {
      .shell { grid-template-columns: 60px 1fr; }
      .server-item {
        width: 38px !important; height: 38px !important;
        min-width: 38px !important; min-height: 38px !important;
        flex: 0 0 38px !important;
      }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
    }
    @media (max-width: 640px) {
      .shell { grid-template-columns: 1fr; grid-template-rows: auto auto 1fr; }
      .sidebar { flex-direction: row; border-right: none; border-bottom: 1px solid var(--border); padding: 6px 8px; overflow-x: auto; overflow-y: hidden; }
      .sidebar::after { display: none; }
      .server-rail { flex-direction: row; }
      .server-item-indicator { display: none; }
      .topbar-center { display: none; }
    }

    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">${safeName}</div>
      <div class="topbar-center">
        <div class="main-tabs">
          <button id="tabHome" class="main-tab active cursor-pointer">SYS</button>
          <button id="tabPlugins" class="main-tab cursor-pointer">EXT</button>
        </div>
        <div id="centerTitle" class="center-title">ONLINE</div>
      </div>
      <div id="userMeta" class="pill">INIT...</div>
    </header>

    <aside class="sidebar">
      <div id="serverRail" class="server-rail"></div>
    </aside>

    <main class="content">
      <div class="container">
        <section id="homeArea">
          <div class="section-title">// SYSTEM CONFIG</div>
          <section id="homeCategories" class="home-categories"></section>
          <section id="homeSections" class="home-sections"></section>

          <section id="overviewArea">
            <div class="section-title">// TELEMETRY</div>
            <section id="overviewCards" class="grid cards"></section>
          </section>
        </section>

        <section id="pluginsArea" style="display:none;">
          <div class="section-title">// EXTENSIONS</div>
          <section id="plugins" class="grid"></section>
        </section>
      </div>
    </main>
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
