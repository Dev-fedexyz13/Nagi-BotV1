let handler = async (m, { conn, args, usedPrefix}) => {
  const nombre = args[0];
  if (!nombre) {
    return conn.reply(m.chat, `📌 Usa el comando así:\n${usedPrefix}reg fede`, m);
}

  const imageUrl = 'https://dev-fedeexyz.vercel.app/media/9a58sk.jpg';
  const media = await prepareWAMessageMedia(
    { image: { url: imageUrl}},
    { upload: conn.waUploadToServer}
);

  // Botones de edad del 12 al 21
  const edades = Array.from({ length: 10}, (_, i) => 12 + i);
  const rows = edades.map(edad => ({
    title: `Edad: ${edad}`,
    description: `Registrar como ${nombre} con ${edad} años`,
    id: `${usedPrefix}reg ${nombre} ${edad}`
}));

  const sections = [{
    title: "Selecciona tu edad",
    rows
}];

  const bodyText = `🌿 *Registro para:* ${nombre}\n\nSelecciona tu edad para completar el registro.`;

  const interactiveMessage = {
    header: {
      title: "Registro de Edad",
      hasMediaAttachment: true,
      imageMessage: media.imageMessage
},
    body: { text: bodyText},
    footer: { text: "NagiBot Registro"},
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

  const msg = generateWAMessageFromContent(
    m.chat,
    { viewOnceMessage: { message: { interactiveMessage}}},
    { userJid: conn.user.jid, quoted: m}
);

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});
  await m.react('✅');
};

handler.help = ['reg <nombre>'];
handler.tags = ['rg'];
handler.command = /^reg$/i;
handler.register = true;

export default handler;
