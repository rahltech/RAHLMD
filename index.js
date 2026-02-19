// ============================
// RAHL XMD WITH WEB SERVER
// ============================

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const pino = require("pino");
const express = require("express");

// ============================
// EXPRESS SERVER
// ============================

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {

res.send("RAHL XMD BOT IS RUNNING");

});

app.listen(PORT, () => {

console.log("🌐 Server running on port " + PORT);

});

// ============================
// SETTINGS
// ============================

const SESSION_FOLDER = "./session";

const PREFIX = ".";

const PLUGIN_LIST_URL =
"https://raw.githubusercontent.com/rahltech/RAHL-XMD-REMOTE/main/plugins.json";

const PLUGIN_BASE_URL =
"https://raw.githubusercontent.com/rahltech/RAHL-XMD-REMOTE/main/plugins/";

// ============================

global.pluginHooks = [];

// ============================
// LOAD REMOTE PLUGINS
// ============================

async function loadRemotePlugins() {

console.log("Installing plugins...");

const pluginDir = "./plugins";

if (!fs.existsSync(pluginDir)) {

fs.mkdirSync(pluginDir);

}

const res = await axios.get(PLUGIN_LIST_URL);

for (const file of res.data) {

const filePath = path.join(pluginDir, file);

const response = await axios({

url: PLUGIN_BASE_URL + file,
method: "GET",
responseType: "stream"

});

const writer = fs.createWriteStream(filePath);

response.data.pipe(writer);

await new Promise((resolve) =>
writer.on("finish", resolve)
);

delete require.cache[
require.resolve(filePath)
];

const plugin = require(filePath);

global.pluginHooks.push(plugin);

console.log("Loaded:", file);

}

}

// ============================
// START BOT
// ============================

async function startBot() {

const { state, saveCreds } =
await useMultiFileAuthState(SESSION_FOLDER);

const { version } =
await fetchLatestBaileysVersion();

const sock = makeWASocket({

logger: pino({ level: "silent" }),

auth: state,

version

});

sock.ev.on("connection.update",

async ({ connection, lastDisconnect }) => {

if (connection === "close") {

startBot();

}

if (connection === "open") {

console.log("RAHL XMD Connected");

await loadRemotePlugins();

}

});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("messages.upsert",

async ({ messages }) => {

const msg = messages[0];

if (!msg.message) return;

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text;

if (!text) return;

if (!text.startsWith(PREFIX)) return;

const cmd = text.slice(1).split(" ")[0];

for (const plugin of global.pluginHooks) {

if (plugin.name === cmd) {

plugin.execute(sock, msg);

}

}

});

}

startBot();
