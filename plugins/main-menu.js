import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys'

const defaultMenu = {
  before: `
╭━━━〔 Simple-Bot 〕━━━◉
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

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Leer package.json para obtener datos adicionales (si se requiere)
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    
    // Obtener datos del usuario
    let { exp, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    
    // Datos de tiempo para el menú
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
      let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
      let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
      let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
      return [d, ' D ', h, ' H ', m, ' M '].map(v => v.toString().padStart(2, '0')).join('');
    }
    let muptime = clockString(_muptime)
    let totalreg = Object.keys(global.db.data.users).length

    // Imagen para el header
    const imageUrl = 'https://files.catbox.moe/2eg7ex.jpg';
    let media = await prepareWAMessageMedia(
      { image: { url: imageUrl } },
      { upload: conn.waUploadToServer }
    );

    // Sección con las 22 opciones de categoría (incluyendo LOGO)
let sections = [{
  title: "CATEGORIAS BY BRAYAN",
  rows: [
    { title: "𝗠𝗔𝗜𝗡",         description: "Ver comandos de MAIN",         id: `${_p}menuselect main` },
    { title: "𝗕𝗨𝗦𝗖𝗔𝗗𝗢𝗥𝗘𝗦",     description: "Ver comandos de BUSCADOR",     id: `${_p}menuselect buscador` },
    { title: "𝗝𝗨𝗘𝗚𝗢𝗦",          description: "Ver comandos de FUN",          id: `${_p}menuselect fun` },
    { title: "⚔ RPG",          description: "Ver comandos de RPG",          id: `${_p}menuselect rpg` },
    { title: "𝗥𝗘𝗚𝗥𝗜𝗦𝗧𝗥𝗢",     description: "Ver comandos de REGISTRO",     id: `${_p}menuselect rg` },
    { title: "𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗜𝗔",           description: "Ver comandos de XP",           id: `${_p}menuselect xp` },
    { title: "𝗦𝗧𝗜𝗞𝗘𝗥𝗦",      description: "Ver comandos de STICKER",      id: `${_p}menuselect sticker` },
    { title: "𝗔𝗡𝗜𝗠𝗘𝗦",        description: "Ver comandos de ANIME",        id: `${_p}menuselect anime` },
    { title: "𝗗𝗔𝗧𝗔𝗕𝗔𝗦𝗘",     description: "Ver comandos de DATABASE",     id: `${_p}menuselect database` },
    { title: " HERRAMIENTAS", description: "Ver comandos de HERRAMIENTAS", id: `${_p}menuselect herramientas` },
    { title: "𝗚𝗥𝗨𝗣𝗢𝗦",        description: "Ver comandos de GRUPO",        id: `${_p}menuselect grupo` },
    { title: "𝗢𝗡𝘅𝗢𝗙",       description: "Ver comandos de ON/OFF",       id: `${_p}menuselect nable` },
    { title: "𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦",    description: "Ver comandos de DESCARGAS",    id: `${_p}menuselect descargas` },
    { title: "𝗧𝗢𝗢𝗟𝗦",        description: "Ver comandos de TOOLS",        id: `${_p}menuselect tools` },
    { title: "𝗟𝗢𝗚𝗢",         description: "Crea un logo personalizado",   id: `${_p}menuselect logo` },
    { title: "𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗖𝗜𝗢𝗡",         description: "Ver comandos de INFO",         id: `${_p}menuselect info` },
    { title: "𝗡𝗦𝗙𝗪",         description: "Ver comandos de NSFW",         id: `${_p}menuselect nsfw` },
    { title: "𝗖𝗥𝗘𝗔𝗗𝗢𝗥",        description: "Ver comandos de OWNER",        id: `${_p}menuselect owner` },
    { title: "𝗠𝗢𝗗𝗦",         description: "Ver comandos de MODS",         id: `${_p}menuselect mods` },
    { title: "𝗔𝗨𝗗𝗜𝗢𝗦",        description: "Ver comandos de AUDIO",        id: `${_p}menuselect audio` },
    { title: "𝗜𝗔",           description: "Ver comandos de AI",           id: `${_p}menuselect ai` },
    { title: "𝗖𝗢𝗗𝗠",         description: "Ver comandos de CODM",         id: `${_p}menuselect codm` },
    { title: "𝗧𝗥𝗔𝗦𝗙𝗢𝗥𝗠𝗔𝗗𝗢𝗥", description: "Ver comandos de TRANSFORMADOR", id: `${_p}menuselect transformador` }
  ]
}];


    // Armado del cuerpo del mensaje interactivo
    let bodyText = "* 𝙏𝙐 𝙄𝙉𝙁𝙊 %name \n" +
                   "   *𝐸𝑋𝑃:* %exp\n" +
                   "   *𝑁𝐼𝑉𝐸𝐿:* %level\n" +
                   "   *𝑅𝐴𝑁𝐺𝑂:* %role\n\n" +
                   "*𝗘𝗟𝗜𝗝𝗘 𝗨𝗡𝗔 𝗖𝗔𝗧𝗘𝗚𝗢𝗥𝗜𝗔*\n" +
                   "𝗣𝗔𝗥𝗔 𝗩𝗘𝗥 𝗟𝗢𝗦 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦:";
    // Reemplazar los placeholders con la información real del usuario
    bodyText = bodyText.replace(/%name/g, name)
                       .replace(/%exp/g, exp)
                       .replace(/%level/g, level)
                       .replace(/%role/g, role);

    // Reemplazo en el texto before del defaultMenu
    let beforeText = defaultMenu.before.replace(/%name/g, name)
                                       .replace(/%muptime/g, muptime)
                                       .replace(/%totalreg/g, totalreg)
                                       .replace(/%exp/g, exp)
                                       .replace(/%level/g, level)
                                       .replace(/%role/g, role);

    const interactiveMessage = {
      header: {
        title: "",
        hasMediaAttachment: true,
        imageMessage: media.imageMessage
      },
      body: { 
        text: `${beforeText}\n\n${bodyText}`
      },
      footer: { text: "David Ryze/Brayan330" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "ELIJIR CATEGORIA",
              sections: sections
            })
          }
        ],
        messageParamsJson: ""
      }
    };

    let msgi = generateWAMessageFromContent(
      m.chat, 
      { viewOnceMessage: { message: { interactiveMessage } } }, 
      { userJid: conn.user.jid, quoted: m }
    );
    await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id });
    m.react('☑️');
    conn.reply(m.chat, '𝘔𝘌𝘕𝘜 𝘋𝘌 𝘊𝘈𝘛𝘌𝘎𝘖𝘙𝘐𝘈𝘚 𝘕𝘖 𝘖𝘓𝘝𝘐𝘋𝘌𝘚 𝘋𝘌 𝘚𝘌𝘎𝘜𝘐𝘙 𝘔𝘜𝘌𝘚𝘛𝘙𝘖 𝘊𝘏𝘈𝘕𝘌𝘓', m);
    m.react('✅️');
  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m);
    throw e;
  }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(allmenu|menu|help|menú|\?)$/i;
handler.register = true;

export default handler;

// Funciones auxiliares
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
