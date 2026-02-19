const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

// RAHL XMD OFFICIAL CONFIG

const defaultConfig = {
  SESSION_ID: "", // leave empty for pairing code login

  ALIVE_IMG: "https://files.catbox.moe/8c4k3h.jpg", // you can change later

  ALIVE_MSG: "*Hello 👋 RAHL XMD is Alive and Running 🤖🔥*",

  OPENAI_API_KEY: "",
  GEMINI_API_KEY: "",
  REMOVE_BG_API_KEY:"",
  WEATHER_API_KEY: "",

  BOT_OWNER: "254112399557", // ⚠️ CHANGE THIS TO YOUR NUMBER

  ownerNumber: ["254112399557"], // ⚠️ CHANGE THIS SAME NUMBER

  AUTO_STATUS_REACT: "true",
  AUTO_STATUS_REPLY: "true",
  AUTO_STATUS_SEEN: "true",

  MODE: "public", // public = everyone can use bot
};


// EXPORT SETTINGS

module.exports = {

  AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || defaultConfig.AUTO_STATUS_REACT,

  AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || defaultConfig.AUTO_STATUS_REPLY,

  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || defaultConfig.AUTO_STATUS_SEEN,

  SESSION_ID: process.env.SESSION_ID || defaultConfig.SESSION_ID,

  ALIVE_IMG: process.env.ALIVE_IMG || defaultConfig.ALIVE_IMG,

  ALIVE_MSG: process.env.ALIVE_MSG || defaultConfig.ALIVE_MSG,

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || defaultConfig.OPENAI_API_KEY,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || defaultConfig.GEMINI_API_KEY,

  REMOVE_BG_API_KEY: process.env.REMOVE_BG_API_KEY || defaultConfig.REMOVE_BG_API_KEY, 

  WEATHER_API_KEY: process.env.WEATHER_API_KEY || defaultConfig.WEATHER_API_KEY,

  BOT_OWNER: process.env.BOT_OWNER || defaultConfig.BOT_OWNER,

  ownerNumber: process.env.ownerNumber
    ? process.env.ownerNumber.split(",")
    : defaultConfig.ownerNumber,

  MODE: process.env.MODE || defaultConfig.MODE,

};
