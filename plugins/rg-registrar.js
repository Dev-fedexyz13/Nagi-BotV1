import { promises} from 'fs'
import { join} from 'path'
import { xpRange} from '../lib/levelling.js'
import { prepareWAMessageMedia, generateWAMessageFromContent} from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix: _p, args, __dirname, command}) => {
  const nombre = args[0];
  const edadSeleccionada = parseInt(args[1]);
  const user = global.db.data.users[m.sender];

  if (command === 'unreg') {
    if (!user.name &&!user.edad) {
      return conn.reply(m.chat, '❌ No tienes ningún registro activo.', m);
}

    user.name = '';
    user.edad = null;
    user.fechaRegistro = '';

    await m.react('🗑️');
    return conn.reply(m.chat, '✅ Tu registro ha sido eliminado correctamente.', m);
}

  if (user.name && user.edad && command === 'reg') {
    return conn.reply(m.chat, '⚠️ Ya estás registrado. Usa `.unreg` si deseas eliminar tu registro.', m);
}

  if (nombre &&!isNaN(edadSeleccionada)) {
    const fecha = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires'});

    user.name = nombre;
    user.edad = edadSeleccionada;
    user.fechaRegistro = fecha;

    const mensaje = `
╭━━━〔 ✅ REGISTRO EXITOSO 〕━━━╮
┃
┃ 📛 *Nombre:* ${nombre}
┃ 🎂 *Edad:* ${edadSeleccionada} años
┃ 📅 *Fecha:* ${fecha}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    await m.react('🎉');
    return conn.reply(m.chat, mensaje, m);
}

  if (!nombre) {
    return conn.reply(m.chat, `🍃 Usa el comando así:\n${_p}reg <nombre>`, m);
}

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

  const imageUrl = 'https://cdn.yupra.my.id/yp/g88ak3pd.jpg';
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
    title: "🌿 Selecciona tu edad para registrarte",
    rows
}];

  const beforeText = `
╭━━━〔 🌿 REGISTRO DE USUARIO 〕━━━
┃
┃ 👤 *Nombre:* ${nombre}
┃ 📅 *Fecha:* ${new Date().toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires'})}
┃ 🕒 *Tiempo activo:* ${muptime}
┃ 👥 *Usuarios registrados:* ${totalreg}
┃
┃ 📌 Selecciona tu edad abajo para completar el registro.
╰━━━━━━━━━━━━━━━━━━━━━━━`.trim();

  // 📦 Construcción del mensaje interactivo
  const interactiveMessage = {
    header: {
      title: "Registro de Edad",
      hasMediaAttachment: true,
      imageMessage: media.imageMessage
},
    body: { text: beforeText},
    footer: { text: "> NagiBot-IA | Dev-fedexyz 🍃"},
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

  const msgi = generateWAMessageFromContent(
    m.chat,
    { viewOnceMessage: { message: { interactiveMessage}}},
    { userJid: conn.user.jid, quoted: m}
);

  await conn.relayMessage(m.chat, msgi.message, { messageId: msgi.key.id});
  await m.react('✅');
  conn.reply(m.chat, '🍃 *_Selecciona tu edad._*', m);
};

handler.help = ['reg <nombre>', 'unreg'];
handler.tags = ['rg'];
handler.command = ['reg', 'unreg'];
handler.register = true;

export default handler;
