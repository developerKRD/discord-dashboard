import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderAuroraLayout(context: DashboardTemplateRenderContext): string {
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
      --bg: ${design.bg ?? "#050a0e"};
      --rail: ${design.rail ?? "#0a1018"};
      --content-bg: ${design.contentBg ?? "#070d14"};
      --panel: ${design.panel ?? "rgba(12, 22, 34, 0.7)"};
      --panel-2: ${design.panel2 ?? "rgba(8, 18, 28, 0.6)"};
      --text: ${design.text ?? "#e2f0e8"};
      --muted: ${design.muted ?? "#6d9886"};
      --primary: ${design.primary ?? "#38bdf8"};
      --primary-glow: rgba(56, 189, 248, 0.3);
      --accent: ${design.accent ?? "#34d399"};
      --accent-glow: rgba(52, 211, 153, 0.25);
      --aurora-pink: rgba(236, 72, 153, 0.15);
      --success: ${design.success ?? "#34d399"};
      --warning: ${design.warning ?? "#fbbf24"};
      --danger: ${design.danger ?? "#f87171"};
      --border: ${design.border ?? "rgba(56, 189, 248, 0.1)"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
    }

    /* Animated aurora gradient background */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 120% 60% at 20% 0%, rgba(56, 189, 248, 0.12), transparent),
        radial-gradient(ellipse 100% 50% at 60% 0%, rgba(52, 211, 153, 0.10), transparent),
        radial-gradient(ellipse 80% 40% at 80% 10%, var(--aurora-pink), transparent);
      animation: auroraShift 12s ease-in-out infinite alternate;
    }

    @keyframes auroraShift {
      0% { opacity: 0.7; transform: translateX(0) scaleY(1); }
      50% { opacity: 1; transform: translateX(-3%) scaleY(1.1); }
      100% { opacity: 0.8; transform: translateX(2%) scaleY(0.95); }
    }

    /* ─── LAYOUT ─── */
    .layout {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 240px 1fr;
      height: 100vh;
    }

    /* ─── SIDEBAR ─── */
    .sidebar {
      background: rgba(5, 10, 14, 0.88);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid var(--border);
    }

    .brand {
      font-weight: 800;
      font-size: 16px;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .brand-sub {
      font-size: 11px;
      color: var(--muted);
      margin-top: 4px;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    /* Server rail in sidebar */
    .server-section {
      padding: 14px 12px;
      border-bottom: 1px solid var(--border);
      max-height: 200px;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .server-section::-webkit-scrollbar { display: none; }

    .server-section-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--muted);
      padding: 0 8px;
      margin-bottom: 8px;
    }

    .server-rail {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .server-item {
      position: relative;
      width: 100%;
      height: 40px;
      border-radius: 10px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text);
      font-weight: 600;
      font-size: 13px;
      display: flex;
      align-items: center;
      padding: 0 12px 0 40px;
      transition: all 0.2s ease;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .server-item::before {
      content: attr(title);
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .server-item:hover {
      background: rgba(56, 189, 248, 0.08);
      border-color: rgba(56, 189, 248, 0.15);
    }
    .server-item.active {
      background: linear-gradient(90deg, rgba(56, 189, 248, 0.12), rgba(52, 211, 153, 0.08));
      border-color: rgba(56, 189, 248, 0.3);
      color: #fff;
    }

    .server-item-indicator {
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 0;
      border-radius: 0 4px 4px 0;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      opacity: 0;
      transition: all 0.2s ease;
    }
    .server-item.active .server-item-indicator {
      opacity: 1; height: 20px;
    }

    .server-avatar {
      position: absolute; left: 10px; top: 50%;
      transform: translateY(-50%);
      width: 22px; height: 22px;
      border-radius: 6px;
      object-fit: cover;
    }
    .server-fallback {
      position: absolute; left: 10px; top: 50%;
      transform: translateY(-50%);
      width: 22px; height: 22px;
      border-radius: 6px;
      display: grid; place-items: center;
      background: rgba(56, 189, 248, 0.15);
      font-size: 9px; font-weight: 700;
    }
    .server-status {
      position: absolute; right: 10px; top: 50%;
      transform: translateY(-50%);
      width: 7px; height: 7px;
      border-radius: 999px;
      background: var(--accent);
      box-shadow: 0 0 6px var(--accent-glow);
    }
    .server-status.offline { background: var(--muted); box-shadow: none; }

    /* Nav links */
    .nav-section {
      flex: 1;
      padding: 14px 12px;
      overflow-y: auto;
      scrollbar-width: none;
    }
    .nav-section::-webkit-scrollbar { display: none; }

    .nav-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--muted);
      padding: 0 8px;
      margin-bottom: 8px;
    }

    .main-tabs {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .main-tab {
      width: 100%;
      text-align: left;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .main-tab:hover { background: rgba(56, 189, 248, 0.06); color: var(--text); }
    .main-tab.active {
      background: rgba(56, 189, 248, 0.1);
      color: var(--primary);
      border-color: rgba(56, 189, 248, 0.2);
    }

    /* User area at bottom */
    .user-area {
      padding: 14px 16px;
      border-top: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.2);
    }

    /* ─── MAIN CONTENT ─── */
    .content {
      display: flex;
      flex-direction: column;
      min-width: 0;
      overflow: hidden;
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 54px;
      border-bottom: 1px solid var(--border);
      background: rgba(5, 10, 14, 0.6);
      backdrop-filter: blur(12px);
      flex-shrink: 0;
    }

    .center-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      letter-spacing: 0.2px;
    }

    .pill {
      display: flex; align-items: center; gap: 8px;
      padding: 5px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(12, 22, 34, 0.6);
      font-size: 12px;
      font-weight: 500;
      color: var(--muted);
    }

    .main-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: radial-gradient(ellipse at 30% 0%, rgba(56, 189, 248, 0.04), transparent 50%),
                  var(--content-bg);
      scrollbar-width: thin;
      scrollbar-color: rgba(56, 189, 248, 0.2) transparent;
    }
    .main-area::-webkit-scrollbar { width: 5px; }
    .main-area::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 3px; }

    /* ─── SECTION ─── */
    .section-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 14px;
      background: linear-gradient(135deg, var(--text), var(--primary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 12px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }

    .panel {
      background: var(--panel);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .panel::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--accent), transparent);
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .panel:hover {
      transform: translateY(-3px);
      border-color: rgba(56, 189, 248, 0.2);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 16px rgba(56, 189, 248, 0.06);
    }
    .panel:hover::after { opacity: 1; }

    .title {
      color: var(--primary);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
    }
    .value {
      font-size: 26px;
      font-weight: 800;
      margin-top: 6px;
      background: linear-gradient(135deg, #fff, var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .subtitle {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    /* ─── CATEGORIES ─── */
    .home-categories {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 14px;
    }

    /* ─── HOME SECTIONS ─── */
    .home-sections {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 6px); max-width: calc(50% - 6px); }
    .home-width-33 { flex-basis: calc(33.333% - 8px); max-width: calc(33.333% - 8px); }
    .home-width-20 { flex-basis: calc(20% - 9.6px); max-width: calc(20% - 9.6px); }

    /* ─── FORM ELEMENTS ─── */
    button {
      border: 1px solid var(--border);
      background: rgba(56, 189, 248, 0.06);
      color: var(--text);
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    button:hover { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.25); }
    button.primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none; color: #050a0e;
      font-weight: 700;
      box-shadow: 0 2px 12px var(--primary-glow);
    }
    button.primary:hover { filter: brightness(1.1); box-shadow: 0 4px 20px var(--primary-glow); }
    button.danger {
      background: rgba(248, 113, 113, 0.12);
      border-color: rgba(248, 113, 113, 0.3);
      color: var(--danger);
    }

    .home-category-btn.active {
      background: rgba(56, 189, 248, 0.15);
      border-color: rgba(56, 189, 248, 0.4);
      color: var(--primary);
    }

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
      background: var(--panel-2);
      color: var(--text);
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .home-input:focus, .home-textarea:focus, .home-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow);
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
      background: rgba(5, 10, 14, 0.97);
      backdrop-filter: blur(16px);
      border-radius: 10px;
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.5);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0;
      text-align: left; padding: 9px 12px;
      background: transparent; color: var(--text);
      font-size: 13px;
    }
    .lookup-item:hover { background: rgba(56, 189, 248, 0.1); }
    .lookup-selected { margin-top: 4px; font-size: 11px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 8px 12px; background: var(--panel-2);
      font-size: 13px;
    }
    .list-editor {
      border: 1px solid var(--border); border-radius: 10px;
      background: var(--panel-2);
      padding: 10px; display: grid; gap: 8px;
    }
    .list-items { display: grid; gap: 6px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 7px 10px; background: rgba(0, 0, 0, 0.2);
      transition: border-color 0.15s ease;
    }
    .list-item:hover { border-color: rgba(56, 189, 248, 0.2); }
    .list-item.dragging { opacity: 0.5; }
    .drag-handle { color: var(--muted); user-select: none; font-size: 14px; }
    .list-input { width: 100%; border: none; outline: none; background: transparent; color: var(--text); font-size: 13px; font-family: inherit; }
    .list-add { justify-self: start; }
    .empty { color: var(--muted); font-size: 13px; padding: 8px 0; }
    .cursor-pointer { cursor: pointer; }

    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .main-area > * { animation: fadeUp 0.35s ease-out both; }

    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand">${safeName}</div>
        <div class="brand-sub">Control Panel</div>
      </div>

      <div class="server-section">
        <div class="server-section-label">Servers</div>
        <div id="serverRail" class="server-rail"></div>
      </div>

      <div class="nav-section">
        <div class="nav-label">Navigation</div>
        <div class="main-tabs">
          <button id="tabHome" class="main-tab active cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </button>
          <button id="tabPlugins" class="main-tab cursor-pointer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            Plugins
          </button>
        </div>

        <div class="nav-label" style="margin-top: 16px;">Categories</div>
        <div id="homeCategories" class="main-tabs"></div>
      </div>

      <div class="user-area" id="userMeta">
        <div class="pill" style="width:100%;justify-content:center;">Loading...</div>
      </div>
    </aside>

    <main class="content">
      <header class="topbar">
        <span id="centerTitle" class="center-title">Dashboard</span>
        <div id="userMetaTopbar" class="pill" style="display:none;"></div>
      </header>

      <div class="main-area">
        <section id="homeArea">
          <div class="section-title">Configuration</div>
          <section id="homeSections" class="home-sections"></section>

          <section id="overviewArea">
            <div class="section-title">Overview</div>
            <section id="overviewCards" class="grid cards"></section>
          </section>
        </section>

        <section id="pluginsArea" style="display:none;">
          <div class="section-title">Plugins</div>
          <section id="plugins" class="grid"></section>
        </section>
      </div>
    </main>
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
