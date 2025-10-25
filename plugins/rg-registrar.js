import { promises} from 'fs'
import { join} from 'path'
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

let handler = async (m, { conn, usedPrefix: _p, args, __dirname}) => {
  const nombre = args[0];
  const edadSeleccionada = parseInt(args[1]);

  // Si ya se envió nombre y edad, registrar directamente
  if (nombre &&!isNaN(edadSeleccionada)) {
    const fecha = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires'});

    let user = global.db.data.users[m.sender];
    user.name = nombre;
    user.edad = edadSeleccionada;
    user.fechaRegistro = fecha;

    const mensaje = `
✅ *Registro exitoso*

📛 *Nombre:* ${nombre}
🎂 *Edad:* ${edadSeleccionada} años
📅 *Fecha:* ${fecha}
`.trim();

    await m.react('🎉');
    return conn.reply(m.chat, mensaje, m);
}

  // Si solo se envió el nombre, mostrar menú de edades
  if (!nombre) {
    return conn.reply(m.chat, `📌 Usa el comando así:\n${_p}reg <nombre>`, m);
}

  let { exp, level, role} = global.db.data.users[m.sender];
  let { min, xp, max} = xpRange(level, global.multiplier);
  let name = await conn.getName(m.sender);

  let _uptime = process.uptime() * 1000;
  let _muptime;
  if (process.send) {
    process.send('uptime');
    _muptime = await new Promise(resolve => {
      process.once('message', resolve);
      setTimeout(resolve, 1000);
}) * 1000;
}

  let clockString = ms => {
    let d = isNaN(ms)? '--': Math.floor(ms / 86400000);
    let h = isNaN(ms)? '--': Math.floor(ms / 3600000) % 24;
    let m = isNaN(ms)? '--': Math.floor(ms / 60000) % 60;
    return [d, ' D ', h, ' H ', m, ' M '].map(v => v.toString().padStart(2, '0')).join('');
};

  let muptime = clockString(_muptime);
  let totalreg = Object.keys(global.db.data.users).length;

  const imageUrl = 'https://files.catbox.moe/2eg7ex.jpg';
  let media = await prepareWAMessageMedia(
    { image: { url: imageUrl}},
    { upload: conn.waUploadToServer}
);

  const edades = Array.from({ length: 10}, (_, i) => 12 + i);
  const rows = edades.map(edad => ({
    title: `Edad: ${edad}`,
    description: `Registrar como ${nombre} con ${edad} años`,
    id: `${_p}reg ${nombre} ${edad}`
}));

  const sections = [{
    title: "Selecciona tu edad para registrarte",
    rows
}];

  let bodyText = `* 𝙏𝙐 𝙄𝙉𝙁𝙊 %name \n` +
                 `   *𝐸𝑋𝑃:* %exp\n` +
                 `   *𝑁𝐼𝑉𝐸𝐿:* %level\n` +
                 `   *𝑅𝐴𝑁𝐆𝑂:* %role\n\n` +
                 `*𝗘𝗟𝗜𝗝𝗘 𝗧𝗨 𝗘𝗗𝗔𝗗*\n𝗣𝗔𝗥𝗔 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔𝗥 𝗘𝗟 𝗥𝗘𝗚𝗜𝗦𝗧𝗥𝗢:`;

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
 body: { text: `${beforeText}\n\n${bodyText}`},
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
};

handler.help = ['reg <nombre>'];
handler.tags = ['rg'];
handler.command = /^reg$/i;
handler.register = true;

export default handler;
