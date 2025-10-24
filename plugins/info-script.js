const handler = async (m, { conn}) => {
  const caption = `🌿 *Información del Proyecto*\n\nEste bot está basado en *NagiBotV1*, un sistema modular y personalizable para WhatsApp.\n\n🔧 Puedes ver el código, reportar errores o contribuir directamente desde GitHub.`;

  const contactCard = {
    key: {
      participants: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      fromMe: false,
      id: 'Info'
},
    message: {
      contactMessage: {
        displayName: 'Dev-fedexyz',
        vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:NagiBot\nTEL;type=CELL:5491130964777\nEND:VCARD'
}
},
    participant: '0@s.whatsapp.net'
};

  const buttons = [
    {
      name: "cta_url",
      buttonParamsJson: JSON.stringify({
        display_text: "🍃 Ver Repositorio",
        url: "https://github.com/Dev-fedexyz13/Nagi-BotV1.git",
        merchant_url: "https://github.com/Dev-fedexyz13/Nagi-BotV1.git"
})
},
    {
      name: "cta_url",
      buttonParamsJson: JSON.stringify({
        display_text: "🐞 Reportar Error",
        url: "https://wa.me/5491130964777",
        merchant_url: "https://wa.me/5491130964777"
})
},
    {
      name: "cta_url",
      buttonParamsJson: JSON.stringify({
        display_text: "🍒 Canal Oficial",
        url: "https://whatsapp.com/channel/0029Vb6jsun6buMJfw17lS1Y",
        merchant_url: "https://whatsapp.com/channel/0029Vb6jsun6buMJfw17lS1Y"
})
}
  ];

  await conn.sendMessage(
    m.chat,
    {
      image: { url: "https://kirito.my/media/images/33437668_k.jpg"},
      caption,
      title: "⚽ Nagi-BotV1",
      footer: "© 2024 – Proyecto Nagi-BotV1",
      interactiveButtons: buttons,
      hasMediaAttachment: true
},
    { quoted: contactCard}
);
};

handler.help = ["script"];
handler.tags = ["info"];
handler.command = ["script", "sc"];

export default handler;
