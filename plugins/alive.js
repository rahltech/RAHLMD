module.exports = {

name: "alive",

async execute(sock, msg) {

await sock.sendMessage(msg.key.remoteJid, {

text: "RAHL XMD is alive and running 🔥"

});

}

}
