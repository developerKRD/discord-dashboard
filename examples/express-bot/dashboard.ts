import type { Express } from "express";
import type { Client } from "discord.js";
import { createExpressAdapter } from "../../src";
import type { BotConfig } from "./types";
import type { DemoStateStore } from "./state-store";

export function createBotDashboard(options: { app: Express; config: BotConfig; store: DemoStateStore; client: Client; commandCount: number }) {
  const { app, config, store, client, commandCount } = options;

  return createExpressAdapter({
    app,
    basePath: config.dashboardBasePath,
    dashboardName: config.dashboardName,
    uiTemplate: "nebula",
    uiTheme: "default",
    botToken: config.botToken,
    client,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    sessionSecret: config.sessionSecret,
    ownerIds: config.ownerIds,
    botInvitePermissions: "8",
    botInviteScopes: ["bot", "applications.commands"],

    getOverviewCards: async (context) => {
      const state = await store.read();
      return [
        {
          id: "who",
          title: "Authenticated As",
          value: context.user.global_name || context.user.username,
          subtitle: context.user.id,
        },
        {
          id: "commands",
          title: "Slash Commands",
          value: String(commandCount),
          subtitle: config.devGuildId ? "Guild scoped registration" : "Global registration",
        },
        {
          id: "events",
          title: "Tracked Guilds",
          value: String(Object.keys(state.guilds).length),
          subtitle: "Persisted in live JSON state",
        },
        {
          id: "saves",
          title: "JSON Saves",
          value: String(state.meta.saveCount),
          subtitle: state.meta.lastAction,
        },
      ];
    },

    home: {
      getCategories: async (context) => {
        if (context.selectedGuildId) {
          return [
            { id: "overview", label: "Overview", scope: "guild" },
            { id: "guild", label: "Guild Config", scope: "guild" },
            { id: "guild-flex", label: "Guild Flex", scope: "guild" },
            { id: "setup", label: "Setup", scope: "setup" },
          ];
        }

        return [
          { id: "overview", label: "Overview", scope: "user" },
          { id: "profile", label: "Profile", scope: "user" },
          { id: "profile-flex", label: "Profile Flex", scope: "user" },
          { id: "setup", label: "Setup", scope: "setup" },
        ];
      },

      getSections: async (context) => {
        const state = await store.read();
        const userState = await store.getUserState(context.user.id);
        const guildState = context.selectedGuildId ? await store.getGuildState(context.selectedGuildId) : null;

        const setupSection = {
          id: "live-json-state",
          title: "Live JSON State",
          description: "All dashboard saves and bot events persist to one JSON file.",
          width: 50 as const,
          scope: "setup" as const,
          categoryId: "setup",
          fields: [
            { id: "file", label: "State File", type: "text" as const, value: store.filePath, readOnly: true },
            { id: "lastAction", label: "Last Action", type: "text" as const, value: state.meta.lastAction, readOnly: true },
            { id: "lastUpdatedBy", label: "Last Updated By", type: "text" as const, value: state.meta.lastUpdatedBy, readOnly: true },
            { id: "lastUpdatedAt", label: "Last Updated At", type: "text" as const, value: state.meta.lastUpdatedAt, readOnly: true },
          ],
        };

        if (!context.selectedGuildId) {
          return [
            {
              id: "user-overview",
              title: "User Overview",
              description: "Live user profile data loaded from JSON.",
              width: 50 as const,
              scope: "user" as const,
              categoryId: "overview",
              fields: [
                { id: "bioLive", label: "Profile Bio", type: "textarea" as const, value: userState.profileBio || "(empty)", readOnly: true },
                { id: "petsLive", label: "Pets Enabled", type: "boolean" as const, value: userState.petsEnabled, readOnly: true },
                { id: "petNameLive", label: "Favorite Pet", type: "text" as const, value: userState.favoritePetName, readOnly: true },
                { id: "petNotifyLive", label: "Pet Notifications", type: "boolean" as const, value: userState.petNotifications, readOnly: true },
              ],
            },
            {
              id: "user-profile",
              title: "Edit User Profile",
              description: "Save values and watch JSON + cards update in real time.",
              width: 50 as const,
              scope: "user" as const,
              categoryId: "profile",
              fields: [
                { id: "profileBio", label: "Profile Bio", type: "textarea" as const, value: userState.profileBio },
                { id: "petsEnabled", label: "Enable Pets", type: "boolean" as const, value: userState.petsEnabled },
                { id: "favoritePetName", label: "Favorite Pet", type: "text" as const, value: userState.favoritePetName },
                { id: "petNotifications", label: "Pet Notifications", type: "boolean" as const, value: userState.petNotifications },
              ],
              actions: [{ id: "saveUserProfile", label: "Save Profile", variant: "primary" as const, collectFields: true }],
            },
            {
              id: "profile-flex",
              title: "Profile (Flex API)",
              categoryId: "profile-flex",
              scope: "user" as const,
              width: 50 as const,
              description: `Loaded dynamically for ${context.user.username}`,
              fields: [
                { id: "flexBio", label: "Bio", type: "textarea" as const, value: userState.profileBio },
                { id: "flexPetName", label: "Favorite Pet", type: "text" as const, value: userState.favoritePetName },
                { id: "flexPetNotifications", label: "Pet Notifications", type: "boolean" as const, value: userState.petNotifications },
              ],
              actions: [{ id: "saveFlexProfile", label: "Save Flex", variant: "primary" as const, collectFields: true }],
            },
            setupSection,
          ];
        }

        return [
          {
            id: "guild-overview",
            title: "Guild Overview",
            description: "Current guild values from JSON-backed storage.",
            width: 50 as const,
            scope: "guild" as const,
            categoryId: "overview",
            fields: [
              { id: "prefixView", label: "Prefix", type: "text" as const, value: guildState?.prefix ?? "!", readOnly: true },
              { id: "modView", label: "Moderation", type: "boolean" as const, value: guildState?.moderationEnabled ?? true, readOnly: true },
              { id: "eventView", label: "Last Event", type: "text" as const, value: guildState?.lastEvent ?? "none", readOnly: true },
              { id: "cmdView", label: "Last Command At", type: "text" as const, value: guildState?.lastCommandAt ?? "never", readOnly: true },
            ],
          },
          {
            id: "guild-settings",
            title: "Guild Settings",
            description: "These settings are shared with command/event handlers.",
            width: 50 as const,
            scope: "guild" as const,
            categoryId: "guild",
            fields: [
              { id: "prefix", label: "Prefix", type: "text" as const, value: guildState?.prefix ?? "!" },
              { id: "moderationEnabled", label: "Moderation Enabled", type: "boolean" as const, value: guildState?.moderationEnabled ?? true },
              { id: "logChannelId", label: "Log Channel ID", type: "text" as const, value: guildState?.logChannelId ?? "" },
              { id: "welcomeChannelId", label: "Welcome Channel ID", type: "text" as const, value: guildState?.welcomeChannelId ?? "" },
              { id: "pollMessage", label: "Poll Message", type: "textarea" as const, value: guildState?.pollMessage ?? "" },
              { id: "pollButtons", label: "Poll Buttons", type: "string-list" as const, value: guildState?.pollButtons ?? ["✅ Yes", "❌ No"] },
            ],
            actions: [{ id: "saveGuildSettings", label: "Save Guild Settings", variant: "primary" as const, collectFields: true }],
          },
          {
            id: "guild-flex",
            title: "Guild (Flex API)",
            categoryId: "guild-flex",
            scope: "guild" as const,
            width: 50 as const,
            description: `Loaded dynamically for guild ${context.selectedGuildId}`,
            fields: [
              { id: "flexGuildPrefix", label: "Prefix", type: "text" as const, value: guildState?.prefix ?? "!" },
              { id: "flexGuildLog", label: "Log Channel ID", type: "text" as const, value: guildState?.logChannelId ?? "" },
              { id: "flexGuildWelcome", label: "Welcome Channel ID", type: "text" as const, value: guildState?.welcomeChannelId ?? "" },
              { id: "flexGuildModeration", label: "Moderation Enabled", type: "boolean" as const, value: guildState?.moderationEnabled ?? true },
            ],
            actions: [{ id: "saveFlexGuild", label: "Save Flex Config", variant: "primary" as const, collectFields: true }],
          },
          setupSection,
        ];
      },

      actions: {
        saveUserProfile: async (context, payload) => {
          await store.update("dashboard:saveUserProfile", context.user.username, (state) => {
            const current = state.users[context.user.id] ?? {
              profileBio: "",
              petsEnabled: true,
              favoritePetName: "Luna",
              petNotifications: true,
            };
            state.users[context.user.id] = {
              ...current,
              profileBio: String(payload.values.profileBio ?? ""),
              petsEnabled: Boolean(payload.values.petsEnabled),
              favoritePetName: String(payload.values.favoritePetName ?? "Luna"),
              petNotifications: Boolean(payload.values.petNotifications),
              updatedAt: new Date().toISOString(),
            };
          });
          return { ok: true, message: "User profile saved to JSON", refresh: true };
        },

        saveFlexProfile: async (context, payload) => {
          await store.update("dashboard:onSave:profile-flex", context.user.username, (state) => {
            const current = state.users[context.user.id] ?? {
              profileBio: "",
              petsEnabled: true,
              favoritePetName: "Luna",
              petNotifications: true,
            };
            state.users[context.user.id] = {
              ...current,
              profileBio: String(payload.values.flexBio ?? ""),
              favoritePetName: String(payload.values.flexPetName ?? "Luna"),
              petNotifications: Boolean(payload.values.flexPetNotifications),
              updatedAt: new Date().toISOString(),
            };
          });
          return { ok: true, message: "Saved via Flex Profile Action", refresh: true };
        },

        saveGuildSettings: async (context, payload) => {
          if (!context.selectedGuildId) return { ok: false, message: "Select a guild first" };

          await store.update("dashboard:saveGuildSettings", context.user.username, (state) => {
            const current = state.guilds[context.selectedGuildId!] ?? {
              prefix: "!",
              moderationEnabled: true,
              logChannelId: "",
              welcomeChannelId: "",
              pollButtons: ["✅ Yes", "❌ No"],
              pollMessage: "What should we do for the next event?",
            };
            const buttons = Array.isArray(payload.values.pollButtons) ? payload.values.pollButtons.map(String).filter((i) => i.length > 0) : current.pollButtons;

            state.guilds[context.selectedGuildId!] = {
              ...current,
              prefix: String(payload.values.prefix ?? "!"),
              moderationEnabled: Boolean(payload.values.moderationEnabled),
              logChannelId: String(payload.values.logChannelId ?? ""),
              welcomeChannelId: String(payload.values.welcomeChannelId ?? ""),
              pollMessage: String(payload.values.pollMessage ?? current.pollMessage),
              pollButtons: buttons.length > 0 ? buttons : ["✅ Yes", "❌ No"],
              updatedAt: new Date().toISOString(),
            };
          });
          return { ok: true, message: "Guild settings saved to JSON", refresh: true };
        },

        saveFlexGuild: async (context, payload) => {
          if (!context.selectedGuildId) return { ok: false, message: "Select a guild first" };

          await store.update("dashboard:onsave:guild-flex", context.user.username, (state) => {
            const current = state.guilds[context.selectedGuildId!] ?? {
              prefix: "!",
              moderationEnabled: true,
              logChannelId: "",
              welcomeChannelId: "",
              pollButtons: ["✅ Yes", "❌ No"],
              pollMessage: "What should we do?",
            };
            state.guilds[context.selectedGuildId!] = {
              ...current,
              prefix: String(payload.values.flexGuildPrefix ?? current.prefix),
              logChannelId: String(payload.values.flexGuildLog ?? current.logChannelId),
              welcomeChannelId: String(payload.values.flexGuildWelcome ?? current.welcomeChannelId),
              moderationEnabled: Boolean(payload.values.flexGuildModeration),
              updatedAt: new Date().toISOString(),
            };
          });
          return { ok: true, message: "Saved via Flex Guild Action", refresh: true };
        },
      },
    },

    plugins: [
      {
        id: "runtime",
        name: "Runtime",
        description: "Bot runtime and process diagnostics",
        getPanels: async (context) => [
          {
            id: "runtime-status",
            title: "Runtime Status",
            fields: [
              { id: "botUser", label: "Bot User", type: "text", value: client.user?.tag ?? "Not logged in", readOnly: true },
              { id: "guildCache", label: "Guild Cache", type: "number", value: client.guilds.cache.size, readOnly: true },
              { id: "uptime", label: "Node Uptime", type: "text", value: `${Math.floor(process.uptime())}s`, readOnly: true },
              { id: "memory", label: "Memory RSS", type: "text", value: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`, readOnly: true },
            ],
            actions: [{ id: "refreshRuntime", label: "Refresh", variant: "primary", collectFields: false }],
          },
        ],
        actions: {
          refreshRuntime: async (context, body) => {
            return { ok: true, message: "Runtime data refreshed!", refresh: true };
          },
        },
      },
    ],
  });
}
