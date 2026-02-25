import type { DashboardTemplateRenderContext } from "../../Types";
import { getClientScript } from "../scripts/client";

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function renderShadcnMagicLayout(context: DashboardTemplateRenderContext): string {
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
      --bg: ${design.bg ?? "#06070b"};
      --surface: ${design.surface ?? "rgba(10, 12, 18, 0.84)"};
      --card: ${design.card ?? "rgba(16, 20, 30, 0.82)"};
      --card-2: ${design.card2 ?? "rgba(23, 29, 42, 0.86)"};
      --text: ${design.text ?? "#f8fafc"};
      --muted: ${design.muted ?? "#94a3b8"};
      --primary: ${design.primary ?? "#c084fc"};
      --primary-glow: rgba(192, 132, 252, 0.3);
      --accent: ${design.accent ?? "#22d3ee"};
      --accent-glow: rgba(34, 211, 238, 0.25);
      --border: ${design.border ?? "rgba(148, 163, 184, 0.12)"};
      --radius-lg: ${design.radiusLg ?? "18px"};
      --radius-md: ${design.radiusMd ?? "12px"};
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html, body { min-height: 100vh; }

    body {
      font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
      color: var(--text);
      background:
        radial-gradient(ellipse at 8% 12%, rgba(192, 132, 252, 0.18), transparent 40%),
        radial-gradient(ellipse at 88% 6%, rgba(34, 211, 238, 0.14), transparent 40%),
        radial-gradient(ellipse at 70% 90%, rgba(244, 114, 182, 0.10), transparent 38%),
        var(--bg);
    }

    /* ─── ANIMATED DOT GRID ─── */
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background-image:
        radial-gradient(circle, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
      background-size: 20px 20px;
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 75%);
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.7), transparent 75%);
    }

    /* ─── GLOW ORB (decorative) ─── */
    body::after {
      content: "";
      position: fixed;
      top: -200px; right: -200px;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(192, 132, 252, 0.08), transparent 65%);
      pointer-events: none;
      z-index: 0;
    }

    .page {
      position: relative;
      z-index: 1;
      min-height: 100vh;
      width: 100%;
    }

    .shell {
      min-height: 100vh;
      width: 100%;
      overflow: hidden;
    }

    /* ─── TOP BAR ─── */
    .topbar {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      gap: 14px;
      align-items: center;
      padding: 0 20px;
      height: 56px;
      border-bottom: 1px solid var(--border);
      background: rgba(6, 8, 12, 0.72);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .brand {
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 0.3px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .center-title {
      border: 1px solid var(--border);
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(8px);
      border-radius: 999px;
      padding: 6px 16px;
      font-size: 12px;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.2px;
    }

    .pill {
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 600;
      color: var(--muted);
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(8px);
    }

    /* ─── SERVER STRIP ─── */
    .server-strip {
      padding: 14px 20px;
      border-bottom: 1px solid var(--border);
      background: rgba(6, 8, 14, 0.5);
      backdrop-filter: blur(12px);
    }

    .server-rail {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
    }
    .server-rail::-webkit-scrollbar { display: none; }

    .server-item {
      position: relative;
      min-width: 200px;
      height: 56px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6));
      backdrop-filter: blur(8px);
      color: var(--text);
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 56px 8px 52px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
    }

    .server-item::before {
      content: attr(title);
      display: block;
      max-width: 100%;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
      color: #e2e8f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .server-item:hover {
      transform: translateY(-2px);
      border-color: rgba(192, 132, 252, 0.5);
      box-shadow: 0 4px 16px rgba(192, 132, 252, 0.12);
    }

    .server-item.active {
      border-color: var(--accent);
      box-shadow:
        0 0 0 1px rgba(34, 211, 238, 0.2),
        0 8px 24px rgba(34, 211, 238, 0.12),
        inset 0 1px 0 rgba(34, 211, 238, 0.1);
      background: linear-gradient(180deg, rgba(34, 211, 238, 0.08), rgba(15, 23, 42, 0.7));
    }

    .server-item-indicator {
      position: absolute;
      left: 8px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 0;
      border-radius: 999px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .server-item.active .server-item-indicator {
      opacity: 1;
      height: 28px;
    }

    .server-avatar {
      position: absolute;
      left: 16px; top: 50%;
      transform: translateY(-50%);
      width: 26px; height: 26px;
      border-radius: 8px;
      object-fit: cover;
    }

    .server-fallback {
      position: absolute;
      left: 16px; top: 50%;
      transform: translateY(-50%);
      width: 26px; height: 26px;
      border-radius: 8px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, rgba(192, 132, 252, 0.2), rgba(34, 211, 238, 0.15));
      font-size: 10px;
      font-weight: 700;
    }

    .server-status {
      position: absolute;
      right: 14px; top: 50%;
      transform: translateY(-50%);
      width: 8px; height: 8px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
    }

    .server-status::after {
      position: absolute;
      right: 16px; top: 50%;
      transform: translateY(-50%);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.2px;
      white-space: nowrap;
    }

    .server-status.offline {
      background: #94a3b8;
      box-shadow: none;
    }
    .server-status.offline::after {
      content: "Invite Bot";
      color: #fda4af;
    }

    /* ─── CONTENT ─── */
    .content {
      padding: 20px;
      min-height: calc(100vh - 56px - 85px);
    }

    .container {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface);
      backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
      padding: 18px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
    }

    /* ─── TABS ─── */
    .main-tabs {
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.4);
      margin-bottom: 18px;
    }

    button {
      border: 1px solid transparent;
      background: transparent;
      color: var(--muted);
      border-radius: 999px;
      padding: 7px 16px;
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    button:hover { color: var(--text); background: rgba(255, 255, 255, 0.04); }

    button.primary {
      border: none;
      color: #0b0f1e;
      font-weight: 700;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      box-shadow: 0 2px 12px var(--primary-glow);
    }
    button.primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 20px var(--primary-glow);
    }

    button.danger {
      background: rgba(190, 24, 93, 0.15);
      border-color: rgba(244, 114, 182, 0.35);
      color: #f9a8d4;
    }
    button.danger:hover { background: rgba(190, 24, 93, 0.25); }

    .main-tab.active, .home-category-btn.active {
      background: linear-gradient(135deg, rgba(34, 211, 238, 0.15), rgba(192, 132, 252, 0.12));
      border-color: rgba(34, 211, 238, 0.5);
      color: var(--accent);
      box-shadow: 0 0 12px rgba(34, 211, 238, 0.1);
    }

    /* ─── SECTION ─── */
    .section-title {
      margin: 14px 0 10px;
      font-size: 15px;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.2px;
    }

    /* ─── GRID & CARDS ─── */
    .grid { display: grid; gap: 12px; }
    .cards { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }

    .panel {
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--card);
      backdrop-filter: blur(8px);
      padding: 16px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba(192, 132, 252, 0.03), rgba(34, 211, 238, 0.02));
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .panel:hover {
      transform: translateY(-3px);
      border-color: rgba(192, 132, 252, 0.25);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3), 0 0 20px rgba(192, 132, 252, 0.06);
    }
    .panel:hover::before { opacity: 1; }

    .title {
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .value {
      margin-top: 6px;
      font-size: 24px;
      font-weight: 800;
      background: linear-gradient(135deg, #f8fafc, var(--primary));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .subtitle {
      margin-top: 6px;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.5;
    }

    /* ─── HOME SECTIONS ─── */
    .home-categories,
    .home-sections {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }

    .home-section-panel { flex: 0 0 100%; max-width: 100%; }
    .home-width-50 { flex-basis: calc(50% - 5px); max-width: calc(50% - 5px); }
    .home-width-33 { flex-basis: calc(33.333% - 6.67px); max-width: calc(33.333% - 6.67px); }
    .home-width-20 { flex-basis: calc(20% - 8px); max-width: calc(20% - 8px); }

    /* ─── FIELDS ─── */
    .home-fields,
    .plugin-fields { display: grid; gap: 10px; margin-top: 10px; }
    .home-field,
    .plugin-field { display: grid; gap: 5px; }
    .home-field label,
    .plugin-field > label {
      color: var(--muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .home-input,
    .home-textarea,
    .home-select {
      width: 100%;
      border: 1px solid var(--border);
      background: var(--card-2);
      color: var(--text);
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .home-input:focus,
    .home-textarea:focus,
    .home-select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-glow), 0 0 16px rgba(192, 132, 252, 0.08);
    }

    .home-textarea { min-height: 80px; resize: vertical; }
    .home-checkbox { width: 17px; height: 17px; accent-color: var(--primary); }
    .home-field-row { display: flex; align-items: center; gap: 8px; }
    .home-message { margin-top: 6px; color: var(--muted); font-size: 12px; }

    /* ─── LOOKUP ─── */
    .lookup-wrap { position: relative; }
    .lookup-results {
      position: absolute; left: 0; right: 0;
      top: calc(100% + 6px);
      z-index: 20;
      border: 1px solid var(--border);
      background: rgba(10, 14, 22, 0.97);
      backdrop-filter: blur(16px);
      border-radius: 10px;
      max-height: 200px;
      overflow: auto;
      display: none;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(148, 163, 184, 0.06);
    }
    .lookup-item {
      width: 100%; border: none; border-radius: 0; text-align: left;
      padding: 9px 12px; background: transparent; color: var(--text);
      font-size: 13px;
    }
    .lookup-item:hover { background: rgba(192, 132, 252, 0.1); }
    .lookup-selected { margin-top: 5px; font-size: 11px; color: var(--muted); }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }

    /* ─── KV / LIST ─── */
    .kv-item {
      display: flex; justify-content: space-between;
      border: 1px solid var(--border); border-radius: 10px;
      padding: 9px 12px; background: var(--card-2);
      font-size: 13px;
    }

    .list-editor {
      border: 1px solid var(--border); border-radius: 10px;
      background: var(--card-2);
      padding: 10px; display: grid; gap: 8px;
    }
    .list-items { display: grid; gap: 6px; }
    .list-item {
      display: grid; grid-template-columns: auto 1fr auto;
      gap: 8px; align-items: center;
      border: 1px solid var(--border); border-radius: 8px;
      padding: 7px 10px;
      background: rgba(23, 29, 42, 0.7);
      transition: border-color 0.15s ease;
    }
    .list-item:hover { border-color: rgba(192, 132, 252, 0.25); }
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
      .topbar { grid-template-columns: 1fr auto; }
      .center-title { display: none; }
      .server-item { min-width: 170px; }
      .home-width-50, .home-width-33, .home-width-20 { flex-basis: 100%; max-width: 100%; }
    }
    @media (max-width: 640px) {
      .content { padding: 12px; }
      .container { padding: 14px; border-radius: 14px; }
      .server-item { min-width: 150px; height: 48px; }
    }

    /* ─── ANIMATIONS ─── */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .container { animation: fadeIn 0.3s ease-out; }

    /* Inject User Custom CSS Here */
    ${design.customCss ?? ""}
  </style>
</head>
<body>
  <div class="page">
    <div class="shell">
      <header class="topbar">
        <div class="brand">${safeName}</div>
        <div id="centerTitle" class="center-title">Workspace Hub</div>
        <div id="userMeta" class="pill">Loading...</div>
      </header>

      <section class="server-strip">
        <div id="serverRail" class="server-rail"></div>
      </section>

      <main class="content">
        <section class="container">
          <div class="main-tabs">
            <button id="tabHome" class="main-tab active cursor-pointer">Home</button>
            <button id="tabPlugins" class="main-tab cursor-pointer">Plugins</button>
          </div>

          <section id="homeArea">
            <div class="section-title">Dashboard Workspace</div>
            <section id="homeCategories" class="home-categories"></section>
            <section id="homeSections" class="home-sections"></section>

            <section id="overviewArea">
              <div class="section-title">Overview Metrics</div>
              <section id="overviewCards" class="grid cards"></section>
            </section>
          </section>

          <section id="pluginsArea" style="display:none;">
            <div class="section-title">Plugin Center</div>
            <section id="plugins" class="grid"></section>
          </section>
        </section>
      </main>
    </div>
  </div>

  <script>${clientScript}</script>
</body>
</html>`;
}
