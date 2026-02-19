// ============================
// RAHL XMD MAIN INDEX FILE
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

// ============================
// SETTINGS
// ============================

const SESSION_FOLDER = "./session";
const PREFIX = ".";

// your remote repo
const PLUGIN_LIST_URL =
"https://raw.githubusercontent.com/rahltech/RAHL-XMD-REMOTE/main/plugins.json";

const PLUGIN_BASE_URL =
"https://raw.githubusercontent.com/rahltech/RAHL-XMD-REMOTE/main/plugins/";

// ============================
// GLOBAL PLUGIN STORAGE
// ============================

global.pluginHooks = [];

// ============================
// LOAD REMOTE PLUGINS
// ============================

async function loadRemotePlugins() {

console.log("🔧 Installing RAHL XMD Plugins...");

const pluginDir = "./plugins";

if (!fs.existsSync(pluginDir)) {

fs.mkdirSync(pluginDir);

}

try {

const res = await axios.get(PLUGIN_LIST_URL);

const plugins = res.data;

for (const file of plugins) {

const fileUrl = PLUGIN_BASE_URL + file;

const filePath = path.join(pluginDir, file);

const response = await axios({

url: fileUrl,
method: "GET",
responseType: "stream"

});

const writer = fs.createWriteStream(filePath);

response.data.pipe(writer);

await new Promise((resolve, reject) => {

writer.on("finish", resolve);

writer.on("error", reject);

});

delete require.cache[require.resolve(filePath)];

const plugin = require(filePath);

global.pluginHooks.push(plugin);

console.log("✅ Loaded:", file);

}

console.log("🚀 All plugins ready");

}
catch(e){

console.log("Plugin Error:", e.message);

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

// ============================
// CONNECTION EVENTS
// ============================

sock.ev.on("connection.update",
async (update) => {

const { connection, lastDisconnect } = update;

if (connection === "close") {

const reason =
lastDisconnect?.error?.output?.statusCode;

if (reason !== DisconnectReason.loggedOut) {

startBot();

}

}

if (connection === "open") {

console.log("✅ RAHL XMD Connected");

await loadRemotePlugins();

}

});

// ============================
// SAVE SESSION
// ============================

sock.ev.on("creds.update", saveCreds);

// ============================
// MESSAGE HANDLER
// ============================

sock.ev.on("messages.upsert",

async ({ messages }) => {

const msg = messages[0];

if (!msg.message) return;

const text =

msg.message.conversation ||

msg.message.extendedTextMessage?.text;

if (!text) return;

if (!text.startsWith(PREFIX)) return;

const command =
text.slice(1).split(" ")[0];

for (const plugin of global.pluginHooks) {

if (plugin.name === command) {

plugin.execute(sock, msg);

}

}

});

}

// ============================
// START
// ============================

startBot();
