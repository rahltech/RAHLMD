const axios = require("axios");

module.exports = async function loadRemote(sock){

const pluginListURL =
"https://raw.githubusercontent.com/rahltech/RAHL-XMD-REMOTE/main/plugins.json";

const res = await axios.get(pluginListURL);

const plugins = res.data.plugins;

for(const plugin of plugins){

const code = await axios.get(plugin.url);

const moduleWrapper = {};

eval("moduleWrapper.exports = " + code.data);

const cmd = moduleWrapper.exports;

sock.ev.on("messages.upsert", async ({ messages })=>{

const msg = messages[0];

if(!msg.message) return;

const text =
msg.message.conversation ||
msg.message.extendedTextMessage?.text;

if(!text) return;

if(text === "." + cmd.name){

cmd.execute(sock,msg);

}

});

}

console.log("RAHL XMD Remote Plugins Loaded");

                                      }
