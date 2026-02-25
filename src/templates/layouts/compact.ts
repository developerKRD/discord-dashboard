import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderCompactLayout(context: DashboardTemplateRenderContext): string {
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
      --bg: ${design.bg ?? "#0a0c14"};
      --rail: ${design.rail ?? "#0e1120"};
      --content-bg: ${design.contentBg ?? "#0f1221"};
      --panel: ${design.panel ?? "rgba(22, 27, 48, 0.75)"};
      --panel-2: ${design.panel2 ?? "rgba(30, 37, 62, 0.6)"};
      --text: ${design.text ?? "#eaefff"};
      --muted: ${design.muted ?? "#8490b5"};
      --primary: ${design.primary ?? "#7c87ff"};
      --primary-glow: rgba(124, 135, 255, 0.35);
      --success: ${design.success ?? "#2bd4a6"};
      --warning: ${design.warning ?? "#ffd166"};
      --danger: ${design.danger ?? "#ff6f91"};
      --info: ${design.info ?? "#66d9ff"};
      --border: ${design.border ?? "rgba(255, 255, 255, 0.07)"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
    }

    /* ─── SHELL ─── */
    .shell {
      height: 100vh;
      display: grid;
      grid-template-rows: auto 1fr;
    }

    /* ─── TOP BAR ─── */
    .topbar {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
      padding: 0 20px;
      height: 52px;
      border-bottom: 1px solid var(--border);
      background: rgba(10, 12, 20, 0.85);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      z-index: 50;
    }

    .brand {
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: linear-gradient(135deg, var(--primary), #a5b4fc);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .center-title {
      text-align: center;
      font-weight: 600;
      font-size: 13px;
      color: var(--muted);
      letter-spacing: 0.3px;
    }

    .pill {
      justify-self: end;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--panel);
      color: var(--muted);
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    /* ─── BODY LAYOUT ─── */
    .layout {
      display: grid;
      grid-template-columns: 64px 1fr;
      min-height: 0;
      overflow: hidden;
    }

    /* ─── SERVER RAIL ─── */
    .sidebar {
      background: linear-gradient(180deg, var(--rail), rgba(8, 10, 18, 0.95));
      border-right: 1px solid var(--border);
      padding: 12px 0;
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
      width: 42px !important; height: 42px !important;
      min-width: 42px !important; min-height: 42px !important;
      flex: 0 0 42px !important;
      border-radius: 12px;
      border: 1px solid transparent;
      background: var(--panel-2);
      color: var(--text);
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: visible;
      padding: 0;
    }
    .server-item:hover {
      border-color: rgba(124, 135, 255, 0.5);
      background: rgba(124, 135, 255, 0.12);
      transform: translateY(-2px);
    }
    .server-item.active {
      background: var(--primary);
      border-color: var(--primary);
      box-shadow: 0 0 16px var(--primary-glow);
      color: #fff;
    }

    .server-item-indicator {
      position: absolute;
      left: -8px; top: 50%;
      transform: translateY(-50%) scaleY(0.5);
      width: 3px; height: 16px;
      background: var(--primary);
      border-radius: 999px;
      opacity: 0;
      transition: all 0.2s ease;
    }
    .server-item.active .server-item-indicator {
      opacity: 1;
      transform: translateY(-50%) scaleY(1);
    }

    .server-avatar {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .server-fallback {
      display: grid;
      place-items: center;
      width: 100%; height: 100%;
      font-size: 12px;
      font-weight: 700;
    }

    .server-status {
      position: absolute;
      right: -3px; bottom: -3px;
      width: 10px; height: 10px;
      border-radius: 999px;
      border: 2px solid var(--rail);
      background: var(--success);
    }
    .server-status.offline { background: var(--muted); }

    /* Separator after "ME" tile */
    .server-rail > .server-item:first-child::after {
      display: none; /* separator handled via JS */
    }

    /* ─── CONTENT AREA ─── */
    .content {
      min-width: 0;
      padding: 16px;
      overflow-y: auto;
      background: radial-gradient(ellipse at 10% 0%, rgba(124, 135, 255, 0.06), transparent 60%),
                  var(--content-bg);
      scrollbar-width: thin;
      scrollbar-color: rgba(124, 135, 255, 0.3) transparent;
    }
    .content::-webkit-scrollbar { width: 5px; }
    .content::-webkit-scrollbar-thumb { background: rgba(124, 135, 255, 0.3); border-radius: 3px; }

    .container {
      background: var(--panel);
      backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
    }

    /* ─── TABS ─── */
    .main-tabs {
      display: inline-flex;
      gap: 4px;
      padding: 3px;
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid var(--border);
      margin-bottom: 16px;
    }

    button {
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: 8px;
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    button:hover { background: rgba(255, 255, 255, 0.05); color: var(--text); }
    button.primary {
      background: linear-gradient(135deg, var(--primary), #a5b4fc);
      border: none; color: #fff;
      box-shadow: 0 2px 10px var(--primary-glow);
      font-weight: 700;
    }
    button.primary:hover { filter: brightness(1.1); box-shadow: 0 4px 16px var(--primary-glow); }
    button.danger {
      background: rgba(255, 111, 145, 0.15);
      border-color: rgba(255, 111, 145, 0.4);
      color: var(--danger);
    }
    button.danger:hover { background: rgba(255, 111, 145, 0.25); }

    .main-tab.active, .home-category-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 2px 8px var(--primary-glow);
    }

    /* ─── SECTION ─── */
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      margin: 16px 0 10px;
      letter-spacing: 0.2px;
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 10px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

    .panel {
      background: var(--panel-2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .panel:hover {
      transform: translateY(-2px);
      border-color: rgba(124, 135, 255, 0.25);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    .title {
      color: var(--primary);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .value {
      font-size: 22px;
      font-weight: 800;
      margin-top: 4px;
      background: linear-gradient(135deg, #fff, var(--primary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .subtitle {
      margin-top: 4px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    /* ─── HOME CATEGORIES ─── */
    .home-categories {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }

    /* ─── HOME SECTIONS ─── */
    .home-sections {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 6px); max-width: calc(50% - 6px); }
    .home-width-33 { flex-basis: calc(33.333% - 8px); max-width: calc(33.333% - 8px); }
    .home-width-20 { flex-basis: calc(20% - 9.6px); max-width: calc(20% - 9.6px); }

    /* ─── FIELDS ─── */
    .home-fields, .plugin-fields { display: grid; gap: 10px; margin-top: 10px; }
    .home-field, .plugin-field { display: grid; gap: 5px; }
    .home-field label, .plugin-field > label {
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .home-input, .home-textarea, .home-select {
      width: 100%;
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.25);
      color: var(--text);
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .home-input:focus, .home-textarea:focus, .home-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow);
    }
    .home-textarea { min-height: 80px; resize: vertical; }
    .home-checkbox { width: 16px; height: 16px; accent-color: var(--primary); }
    .home-field-row { display: flex; align-items: center; gap: 8px; }
    .home-message { margin-top: 6px; color: var(--muted); font-size: 12px; }

    /* ─── LOOKUP ─── */
    .lookup-wrap { position: relative; }
    .lookup-results {
      position: absolute; left: 0; right: 0;
      top: calc(100% + 4px);
      z-index: 20;
      border: 1px solid var(--border);
      background: rgba(14, 17, 32, 0.97);
      backdrop-filter: blur(12px);
      border-radius: 10px;
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0; text-align: left;
      padding: 9px 12px; background: transparent; color: var(--text);
      font-size: 13px;
    }
    .lookup-item:hover { background: rgba(124, 135, 255, 0.12); }
    .lookup-selected { margin-top: 4px; font-size: 11px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

    /* ─── KV / LIST ─── */
    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 8px 10px; background: var(--panel-2);
      font-size: 13px;
    }
    .list-editor {
      border: 1px solid var(--border); border-radius: 10px;
      background: rgba(0, 0, 0, 0.2);
      padding: 10px; display: grid; gap: 8px;
    }
    .list-items { display: grid; gap: 6px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 7px 10px; background: var(--panel-2);
      transition: border-color 0.15s ease;
    }
    .list-item:hover { border-color: rgba(124, 135, 255, 0.25); }
    .list-item.dragging { opacity: 0.5; }
    .drag-handle { color: var(--muted); user-select: none; font-size: 14px; }
    .list-input {
      width: 100%; border: none; outline: none;
      background: transparent; color: var(--text);
      font-size: 13px; font-family: inherit;
    }
    .list-add { justify-self: start; }
    .empty { color: var(--muted); font-size: 13px; padding: 8px 0; }
    .cursor-pointer { cursor: pointer; }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 980px) {
      .layout { grid-template-columns: 56px 1fr; }
      .server-item {
        width: 36px !important; height: 36px !important;
        min-width: 36px !important; min-height: 36px !important;
        flex: 0 0 36px !important;
        border-radius: 10px;
      }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
      .content { padding: 12px; }
    }
    @media (max-width: 640px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { display: none; }
      .topbar { grid-template-columns: 1fr auto; }
      .center-title { display: none; }
    }

    /* Inject User Custom CSS Here */
    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="shell">
    <header class="topbar">
      <div class="brand">${safeName}</div>
      <div id="centerTitle" class="center-title">User Dashboard</div>
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
            <div class="section-title">Home</div>
            <section id="homeCategories" class="home-categories"></section>
            <section id="homeSections" class="home-sections"></section>

            <section id="overviewArea">
              <div class="section-title">Dashboard Stats</div>
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
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
