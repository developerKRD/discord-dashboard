import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderNebulaLayout(context: DashboardTemplateRenderContext): string {
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
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: dark;
      --bg: ${design.bg ?? "#080410"};
      --rail: ${design.rail ?? "#0c0816"};
      --content-bg: ${design.contentBg ?? "#0a0614"};
      --panel: ${design.panel ?? "rgba(20, 12, 36, 0.7)"};
      --panel-2: ${design.panel2 ?? "rgba(28, 16, 48, 0.5)"};
      --text: ${design.text ?? "#f0e8ff"};
      --muted: ${design.muted ?? "#9b8ab8"};
      --primary: ${design.primary ?? "#d946ef"};
      --primary-glow: rgba(217, 70, 239, 0.35);
      --accent: ${design.accent ?? "#818cf8"};
      --accent-glow: rgba(129, 140, 248, 0.25);
      --success: ${design.success ?? "#34d399"};
      --warning: ${design.warning ?? "#fbbf24"};
      --danger: ${design.danger ?? "#fb7185"};
      --border: ${design.border ?? "rgba(217, 70, 239, 0.1)"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Outfit', ui-sans-serif, system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      overflow: hidden;
      height: 100vh;
    }

    /* Nebula background — multiple cosmic clouds */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background:
        radial-gradient(ellipse 100% 60% at 20% 15%, rgba(217, 70, 239, 0.14), transparent),
        radial-gradient(ellipse 80% 50% at 75% 25%, rgba(129, 140, 248, 0.12), transparent),
        radial-gradient(ellipse 90% 70% at 50% 85%, rgba(236, 72, 153, 0.08), transparent),
        radial-gradient(ellipse 60% 40% at 90% 70%, rgba(99, 102, 241, 0.06), transparent);
      animation: nebulaFloat 20s ease-in-out infinite alternate;
    }

    @keyframes nebulaFloat {
      0% { transform: scale(1) translate(0, 0); opacity: 0.8; }
      50% { transform: scale(1.05) translate(-1%, 1%); opacity: 1; }
      100% { transform: scale(0.98) translate(1%, -1%); opacity: 0.85; }
    }

    /* Star field overlay */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        radial-gradient(1px 1px at 10% 20%, rgba(255, 255, 255, 0.3), transparent),
        radial-gradient(1px 1px at 30% 60%, rgba(255, 255, 255, 0.2), transparent),
        radial-gradient(1px 1px at 50% 10%, rgba(255, 255, 255, 0.25), transparent),
        radial-gradient(1px 1px at 70% 40%, rgba(255, 255, 255, 0.15), transparent),
        radial-gradient(1px 1px at 85% 75%, rgba(255, 255, 255, 0.2), transparent),
        radial-gradient(1.5px 1.5px at 15% 80%, rgba(217, 70, 239, 0.4), transparent),
        radial-gradient(1.5px 1.5px at 60% 85%, rgba(129, 140, 248, 0.3), transparent),
        radial-gradient(1px 1px at 40% 35%, rgba(255, 255, 255, 0.2), transparent),
        radial-gradient(1px 1px at 90% 15%, rgba(255, 255, 255, 0.15), transparent),
        radial-gradient(1.5px 1.5px at 25% 45%, rgba(236, 72, 153, 0.3), transparent);
      animation: starTwinkle 8s ease-in-out infinite alternate;
    }

    @keyframes starTwinkle {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    /* ─── SHELL ─── */
    .shell {
      position: relative;
      z-index: 1;
      height: 100vh;
      display: grid;
      grid-template-columns: 80px 1fr;
      padding: 16px;
      gap: 16px;
    }

    /* ─── SERVER RAIL (floating) ─── */
    .sidebar {
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(1.2); -webkit-backdrop-filter: blur(20px) saturate(1.2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 16px 0;
      overflow-y: auto;
      scrollbar-width: none;
      position: relative;
    }
    .sidebar::-webkit-scrollbar { display: none; }

    /* Glowing edge */
    .sidebar::before {
      content: "";
      position: absolute;
      top: 10%; bottom: 10%; right: -1px;
      width: 1px;
      background: linear-gradient(180deg, transparent, rgba(217, 70, 239, 0.4), rgba(129, 140, 248, 0.3), transparent);
    }

    .server-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      min-height: min-content;
    }

    .server-item {
      position: relative;
      width: 50px !important; height: 50px !important;
      min-width: 50px !important; min-height: 50px !important;
      flex: 0 0 50px !important;
      border-radius: 16px;
      border: 1px solid rgba(217, 70, 239, 0.08);
      background: rgba(28, 16, 48, 0.5);
      color: var(--text);
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: visible;
      padding: 0;
    }
    .server-item:hover {
      border-color: rgba(217, 70, 239, 0.4);
      background: rgba(217, 70, 239, 0.08);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 24px rgba(217, 70, 239, 0.15);
    }
    .server-item.active {
      border-color: var(--primary);
      background: linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(129, 140, 248, 0.1));
      box-shadow:
        0 0 0 1px rgba(217, 70, 239, 0.2),
        0 6px 28px rgba(217, 70, 239, 0.18),
        0 0 40px rgba(217, 70, 239, 0.06);
    }

    .server-item-indicator {
      position: absolute;
      left: -12px; top: 50%;
      transform: translateY(-50%);
      width: 4px; height: 0;
      border-radius: 0 4px 4px 0;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      box-shadow: 0 0 10px var(--primary-glow);
      opacity: 0;
      transition: all 0.3s ease;
    }
    .server-item.active .server-item-indicator {
      opacity: 1; height: 28px;
    }

    .server-avatar {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    .server-fallback {
      display: grid; place-items: center;
      width: 100%; height: 100%;
      font-size: 12px; font-weight: 800;
      background: linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(129, 140, 248, 0.1));
      border-radius: inherit;
      color: var(--primary);
    }
    .server-status {
      position: absolute;
      right: -3px; bottom: -3px;
      width: 11px; height: 11px;
      border-radius: 999px;
      border: 2px solid rgba(8, 4, 16, 0.8);
      background: var(--success);
      box-shadow: 0 0 8px rgba(52, 211, 153, 0.5);
    }
    .server-status.offline { background: var(--muted); box-shadow: none; }

    /* ─── CONTENT ─── */
    .content {
      display: flex;
      flex-direction: column;
      min-width: 0;
      gap: 16px;
      overflow: hidden;
    }

    /* Top bar — floating island */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(1.2); -webkit-backdrop-filter: blur(20px) saturate(1.2);
      border: 1px solid var(--border);
      border-radius: 18px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    /* Gradient sweep across topbar */
    .topbar::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(217, 70, 239, 0.04), transparent 30%, transparent 70%, rgba(129, 140, 248, 0.04));
      pointer-events: none;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .brand {
      font-weight: 800;
      font-size: 17px;
      letter-spacing: 0.3px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .center-title {
      font-weight: 600;
      font-size: 13px;
      color: var(--muted);
    }

    .pill {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: rgba(28, 16, 48, 0.5);
      backdrop-filter: blur(8px);
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
    }

    /* Main container — floating island */
    .main-wrap {
      flex: 1;
      background: var(--panel);
      backdrop-filter: blur(20px) saturate(1.2); -webkit-backdrop-filter: blur(20px) saturate(1.2);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 20px;
      overflow-y: auto;
      position: relative;
      scrollbar-width: thin;
      scrollbar-color: rgba(217, 70, 239, 0.2) transparent;
    }
    .main-wrap::-webkit-scrollbar { width: 4px; }
    .main-wrap::-webkit-scrollbar-thumb { background: rgba(217, 70, 239, 0.2); border-radius: 2px; }

    /* ─── TABS ─── */
    .main-tabs {
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      border-radius: 14px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border);
      margin-bottom: 20px;
    }

    button {
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: 10px;
      padding: 8px 18px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    button:hover { color: var(--text); background: rgba(217, 70, 239, 0.06); }

    button.primary {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none; color: #fff;
      font-weight: 700;
      box-shadow: 0 2px 16px var(--primary-glow);
    }
    button.primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 24px var(--primary-glow), 0 0 40px rgba(217, 70, 239, 0.1);
    }
    button.danger {
      background: rgba(251, 113, 133, 0.12);
      border-color: rgba(251, 113, 133, 0.3);
      color: var(--danger);
    }

    .main-tab.active, .home-category-btn.active {
      background: linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(129, 140, 248, 0.1));
      border-color: rgba(217, 70, 239, 0.4);
      color: var(--primary);
      box-shadow: 0 0 14px rgba(217, 70, 239, 0.08);
    }

    /* ─── SECTION ─── */
    .section-title {
      font-size: 18px;
      font-weight: 800;
      margin: 10px 0 14px;
      letter-spacing: -0.3px;
      background: linear-gradient(135deg, var(--text), var(--primary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 14px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }

    .panel {
      background: rgba(20, 12, 36, 0.5);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    /* Cosmic glow on hover */
    .panel::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(217, 70, 239, 0.15), rgba(129, 140, 248, 0.1), transparent, transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
      pointer-events: none;
    }
    .panel:hover {
      transform: translateY(-4px);
      border-color: rgba(217, 70, 239, 0.25);
      box-shadow:
        0 10px 32px rgba(0, 0, 0, 0.3),
        0 0 24px rgba(217, 70, 239, 0.08),
        0 0 48px rgba(129, 140, 248, 0.04);
    }
    .panel:hover::before { opacity: 1; }

    .title {
      color: var(--primary);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .value {
      font-size: 28px;
      font-weight: 800;
      margin-top: 6px;
      color: #fff;
      text-shadow: 0 0 20px rgba(217, 70, 239, 0.3);
    }
    .subtitle {
      margin-top: 6px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }

    /* ─── HOME SECTIONS ─── */
    .home-categories {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .home-sections {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 7px); max-width: calc(50% - 7px); }
    .home-width-33 { flex-basis: calc(33.333% - 9.33px); max-width: calc(33.333% - 9.33px); }
    .home-width-20 { flex-basis: calc(20% - 11.2px); max-width: calc(20% - 11.2px); }

    /* ─── FORM ELEMENTS ─── */
    .home-fields, .plugin-fields { display: grid; gap: 12px; margin-top: 14px; }
    .home-field, .plugin-field { display: grid; gap: 6px; }
    .home-field label, .plugin-field > label {
      color: var(--muted);
      font-size: 12px; font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .home-input, .home-textarea, .home-select {
      width: 100%;
      border: 1px solid var(--border);
      background: rgba(0, 0, 0, 0.3);
      color: var(--text);
      border-radius: 12px;
      padding: 11px 16px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .home-input:focus, .home-textarea:focus, .home-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow), 0 0 20px rgba(217, 70, 239, 0.08);
    }
    .home-textarea { min-height: 90px; resize: vertical; }
    .home-checkbox { width: 18px; height: 18px; accent-color: var(--primary); }
    .home-field-row { display: flex; align-items: center; gap: 10px; }
    .home-message { margin-top: 6px; color: var(--muted); font-size: 12px; }

    .lookup-wrap { position: relative; }
    .lookup-results {
      position: absolute; left: 0; right: 0;
      top: calc(100% + 6px);
      z-index: 20;
      border: 1px solid var(--border);
      background: rgba(8, 4, 16, 0.96);
      backdrop-filter: blur(20px);
      border-radius: 12px;
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.5), 0 0 24px rgba(217, 70, 239, 0.06);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0;
      text-align: left; padding: 10px 16px;
      background: transparent; color: var(--text);
      font-size: 13px;
    }
    .lookup-item:hover { background: rgba(217, 70, 239, 0.08); }
    .lookup-selected { margin-top: 5px; font-size: 11px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }

    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border); border-radius: 12px;
      padding: 9px 14px; background: var(--panel-2);
      font-size: 13px;
    }
    .list-editor {
      border: 1px solid var(--border); border-radius: 14px;
      background: rgba(0, 0, 0, 0.2);
      padding: 12px; display: grid; gap: 8px;
    }
    .list-items { display: grid; gap: 6px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border); border-radius: 10px;
      padding: 8px 12px; background: rgba(20, 12, 36, 0.4);
      transition: border-color 0.2s ease;
    }
    .list-item:hover { border-color: rgba(217, 70, 239, 0.2); }
    .list-item.dragging { opacity: 0.5; }
    .drag-handle { color: var(--primary); user-select: none; font-size: 14px; }
    .list-input { width: 100%; border: none; outline: none; background: transparent; color: var(--text); font-size: 14px; font-family: inherit; }
    .list-add { justify-self: start; }
    .empty { color: var(--muted); font-size: 13px; padding: 8px 0; }
    .cursor-pointer { cursor: pointer; }

    @media (max-width: 900px) {
      .shell { grid-template-columns: 1fr; padding: 10px; gap: 10px; }
      .sidebar { display: none; }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px) scale(0.99); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .main-wrap { animation: fadeIn 0.4s ease-out; }

    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="shell">
    <aside class="sidebar">
      <div id="serverRail" class="server-rail"></div>
    </aside>

    <main class="content">
      <header class="topbar">
        <div class="topbar-left">
          <div class="brand">${safeName}</div>
          <span id="centerTitle" class="center-title">Nebula Interface</span>
        </div>
        <div id="userMeta" class="pill">Loading...</div>
      </header>

      <div class="main-wrap">
        <div class="main-tabs">
          <button id="tabHome" class="main-tab active cursor-pointer">Home</button>
          <button id="tabPlugins" class="main-tab cursor-pointer">Plugins</button>
        </div>

        <section id="homeArea">
          <div class="section-title">Command Center</div>
          <section id="homeCategories" class="home-categories"></section>
          <section id="homeSections" class="home-sections"></section>

          <section id="overviewArea">
            <div class="section-title">Stellar Metrics</div>
            <section id="overviewCards" class="grid cards"></section>
          </section>
        </section>

        <section id="pluginsArea" style="display:none;">
          <div class="section-title">Modules</div>
          <section id="plugins" class="grid"></section>
        </section>
      </div>
    </main>
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
