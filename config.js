import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

/*/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/*/

global.botNumber = '' //Ejemplo: 5491156178758
// Owner  y names bot
global.owner = [
// <-- Número @s.whatsapp.net -->
  ['5491156178758', 'ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ ࣪🍂', true], // Principal 
  ['5491124918653', '𝘿𝙚𝙫-𝙛𝙚𝙙𝙚𝙭𝙮𝙯 ☕', true], // Secundario 
  ['5491130964777', '𝐃𝐞𝐯-𝐟𝐞𝐝𝐞𝐱𝐲𝐳 🍃', true], // Terciario 
];


global.mods = []
global.suittag = ['5491156178758', '5491130964777', '5491124918653']
global.prems = ['5491156178758']

// Sistemas- y más

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.languaje = 'Español'
global.vs = '2.2.0'
global.nameqr = 'NagiBot-MD 🍂'
global.namebot = '☕ NagiBot-IA 🌿'
global.Nagisessions = 'NagiSessions'
global.jadi = 'NagiJadiBots' 
global.NagiJadibts = true

// Nombre bot - Y más

global.packsticker2 = `✧ 𝘿𝙚𝙫-𝙛𝙚𝙙𝙚𝙭𝙮𝙯 ✧`
global.packname = '𝑵𝒂𝒈𝒊𝑩𝒐𝒕 - 𝑰𝑨  🌿'
global.botname = '⚽ 🄽🄰🄶🄸🄱🄾🅃‐🄼🄳 🍂'
global.wm = 'Nagi-BotV1 🍃'
global.author = '© ᴍᴀᴅᴇ ʙʏ ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ'
global.dev = '⌬ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐃𝐞𝐯-𝐟𝐞𝐝𝐞𝐱𝐲𝐳 🌿'
global.textbot = '𝙉𝙖𝙜𝙞-𝘽𝙤𝙩 • 𝙈𝙖𝙙𝙚 𝙗𝙮 𝘿𝙚𝙫-𝙛𝙚𝙙𝙚𝙭𝙮𝙯 🍂'
global.etiqueta = 'ᴅᴇᴠ-ꜰᴇᴅᴇxʏᴢ'

// Money - banners

global.moneda = 'NagiCoins'
global.banner = 'https://files.catbox.moe/60z2ix.jpg'
global.avatar = 'https://files.catbox.moe/npum4p.jpg'

// Contacto  - y canales

global.gp1 = 'https://chat.whatsapp.com/BeFAyDGgDIR7e1kEkdFs8d?mode=wwt'
global.comunidad1 = 'https://chat.whatsapp.com/BeFAyDGgDIR7e1kEkdFs8d?mode=wwt'
global.channel = 'https://whatsapp.com/channel/0029Vb6jsun6buMJfw17lS1Y'
global.channel2 = 'https://whatsapp.com/channel/0029Vb6jsun6buMJfw17lS1Y'
global.md = 'https://github.com/dev-fedexyz13'
global.correo = 'fedelanyt20@gmail.com'
global.cn ='https://whatsapp.com/channel/0029Vb6jsun6buMJfw17lS1Y';

// catálogos- y channel id

global.catalogo = fs.readFileSync('./src/catalogo.jpg');

global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
...(false? { remoteJid: '5219992095479-1625305606@g.us'}: {})
},
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: packname, // Nombre del paquete o mensaje principal
      orderTitle: 'Bang',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
}
}
};

global.ch = {
  ch1: '120363405641626756@newsletter'
};

// y esto es el final xd

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
