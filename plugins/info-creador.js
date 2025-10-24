let handler = async (m, { conn}) => {
  const vcard1 = `BEGIN:VCARD
VERSION:3.0
FN:ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ 🌿
ORG:ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ 🍃
TITLE:Metatron Executioner of Michael
EMAIL;type=INTERNET:brayanfree881@gmail.com
TEL;type=CELL;waid=5491156178758:+5491156178658
ADR;type=WORK:;;2-chōme-7-5 Fuchūchō;marck;Osaka;594-0071;Japan
URL;type=WORK:https://www.tiktok.com/@fantom_uwu_330
X-WA-BIZ-NAME:𝑴𝒂𝒓𝒄𝒌 𝑼𝒘𝒖
X-WA-BIZ-DESCRIPTION:𝑵𝒂𝒈𝒊-𝑩𝒐𝒕 𝐛𝐲 𝑫𝒆𝒗-𝒉𝒂𝒔𝒉𝒊𝒓𝒂𝒎𝒂
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`;

  const vcard2 = `BEGIN:VCARD
VERSION:3.0
FN:ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ 🌿
ORG:ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ 🍒
TITLE:Dev & Co-Founder of Nagi-Bot
EMAIL;type=INTERNET:hashirama.dev@gmail.com
TEL;type=CELL;waid=5491124918653:+5491124918653
ADR;type=WORK:;;Tokyo-to;HashiDev;Tokyo;100-0001;Japan
URL;type=WORK:https://github.com/hashirama-dev
X-WA-BIZ-NAME:𝑯𝒂𝒔𝒉𝒊𝒓𝒂𝒎𝒂 𝑫𝒆𝒗
X-WA-BIZ-DESCRIPTION:𝑵𝒂𝒈𝒊-𝑩𝒐𝒕 𝐛𝐲 𝑯𝒂𝒔𝒉𝒊𝒓𝒂𝒎𝒂
X-WA-BIZ-HOURS:Mo-Su 00:00-23:59
END:VCARD`;

  const qkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
},
    message: {
      contactMessage: {
        displayName: "𝑵𝒂𝒈𝒊-𝑩𝒐𝒕 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐬 🌿",
        vcard: vcard1
}
}
};

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: '𝑵𝒂𝒈𝒊-𝑩𝒐𝒕 𝐂𝐫𝐞𝐚𝐭𝐨𝐫𝐬 🍃',
      contacts: [
        { vcard: vcard1},
        { vcard: vcard2}
      ]
},
    contextInfo: {
      externalAdReply: {
        title: 'Copyright © 2022 - 2025 Nagi-Bot',
        body: 'Contacta directamente por WhatsApp',
        thumbnailUrl: 'https://cdn.yupra.my.id/yp/dpi4ktu8.jpg',
        mediaType: 1,
        renderLargerThumbnail: true
}
}
}, { quoted: qkontak});
};

handler.help = ['owner'];
handler.tags = ['info'];
handler.command = ['owner', 'creador', 'donar'];

export default handler;
