module.exports = {

name: "menu",
alias: ["panel","help"],

desc: "Show bot menu",

async execute(sock, msg) {

const from = msg.key.remoteJid;

const menu = `
╔═══〔 RAHL XMD 〕═══╗

👑 Owner: Rahl Tech
🤖 Bot: RAHL XMD
⚡ Version: 2.0

╔═══〔 COMMANDS 〕═══╗

.alive
.menu
.ping

╚═══════════════════╝
`;

await sock.sendMessage(from, { text: menu });

}

}
