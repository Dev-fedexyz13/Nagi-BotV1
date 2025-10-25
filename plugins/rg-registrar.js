import { promises} from 'fs'
import { join} from 'path'
import fetch from 'node-fetch'
import { xpRange} from '../lib/levelling.js'
import { prepareWAMessageMedia, generateWAMessageFromContent} from '@whiskeysockets/baileys'

const defaultMenu = {
  before: `
╭━━━〔 Registro-Bot 〕━━━◉
┃┃ 🐲𝐇𝐎𝐋𝐀, %name 🐲•
┃╰──────────────
┃┃Cʀᴇᴀᴅᴏ: Brayan/David
┃┃Mᴏᴅᴏ: Público
┃┃Bᴀɪʟᴇʏs: Multi Device
┃┃Tɪᴇᴍᴘᴏ ᴀᴄᴛɪᴠᴏ: %muptime
┃┃Usᴜᴀʀɪᴏs: %totalreg
┃╰──────────────
╰━━━━━━━━━━━━━━◉`.trim(),
};

let handler = async (m, { conn, usedPrefix: _p, __dirname}) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}

    let { exp, level, role} = global.db.data.users[m.sender]
    let { min, xp, max} = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)

    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
}) * 1000
}

    let clockString = ms => {
      let d = isNaN(ms)? '--': Math.floor(ms / 86400000);
      let h = isNaN(ms)? '--': Math.floor(ms / 3600000) % 24;
      let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60;
      return [d, ' D ', h, ' H ', m, ' M '].map(v => v.toString().padStart(2, '0')).join('');
}

    let muptime = clockString(_muptime)
    let totalreg = Object.keys(global.db.data.users).length

    const imageUrl = 'https://files.catbox.moe/2eg7ex.jpg';
    let media = await prepareWAMessageMedia(
      { image: { url: imageUrl}},
      { upload: conn.waUploadToServer}
);

    // Sección con edades del 12 al 21
    const edades = Array.from({ length: 10}, (_, i) => 12 + i);
    const rows = edades.map(edad => ({
      title: `Edad: ${edad}`,
      description: `Registrar como ${name} con ${edad} años`,
      id: `${_p}reg ${name} ${edad}`
}));

    const sections = [{
      title: "Selecciona tu edad para registrarte",
      rows
}];

    let bodyText = `* 𝙏𝙐 𝙄𝙉𝙁𝙊 %name \n` +
                   `   *𝐸𝑋𝑃:* %exp\n` +
                   `   *𝑁𝐼𝑉𝐸𝐿:* %level\n` +
                   `   *𝑅𝐴𝑁𝐆𝑂:* %role\n\n` +
                   `*𝗘𝗟𝗜𝗝𝗘 𝗧𝗨 𝗘𝗗𝗔𝗗*\n` +
                   `𝗣𝗔𝗥𝗔 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗥 𝗘𝗟 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢:`;

    bodyText = bodyText.replace(/%name/g, name)
.replace(/%exp/g, exp)
.replace(/%level/g, level)
.replace(/%role/g, role);

    let beforeText = defaultMenu.before.replace(/%name/g, name)
.replace(/%muptime/g, muptime)
.replace(/%totalreg/g, totalreg)
.replace(/%exp/g, exp)
.replace(/%level/g, level)
.replace(/%role/g, role);

    const interactiveMessage = {
      header: {
        title: "Registro de Edad",
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
},
      body: {
        text: `${beforeText}\n\n${bodyText}`
},
      footer: { text: "David Ryze / Brayan330"},
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "Elige tu edad",
              sections
})
}
        ],
        messageParamsJson: ""
}
};

    let msgi = generateWAMessageFromContent(
      m.chat,
      { viewOnceMessage: { message: { interactiveMessage}}},
      { userJid: conn.user.jid, quoted: m}
);

    await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id});
    await m.react('✅');
    conn.reply(m.chat, '📋 Selecciona tu edad para completar el registro.', m);
} catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, hubo un error al generar el menú de registro.', m);
    throw e;
}
};

handler.help = ['reg'];
handler.tags = ['rg'];
handler.command = /^reg$/i;
handler.register = true;

export default handler;
