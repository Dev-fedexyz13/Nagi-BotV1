import { tmpdir} from 'os';
import { join} from 'path';
import { readdirSync, statSync, unlinkSync, existsSync} from 'fs';

const handler = async (m, { conn, __dirname}) => {
  const tmpPaths = [tmpdir(), join(__dirname, '../tmp')];
  const deletedFiles = [];

  for (const dir of tmpPaths) {
    if (!existsSync(dir)) continue;

    const files = readdirSync(dir);
    for (const file of files) {
      const fullPath = join(dir, file);
      try {
        const stats = statSync(fullPath);
        if (stats.isFile()) {
          unlinkSync(fullPath);
          deletedFiles.push(file);
}
} catch (err) {
        console.error(`🍂 Error al eliminar ${file}:`, err);
}
}
}

  const emoji = '🍃';
  const message = deletedFiles.length
? `${emoji} Se eliminaron ${deletedFiles.length} archivos temporales.\n🌿 Limpieza completada.`
: `🍂 No se encontraron archivos para eliminar.`;

  conn.reply(m.chat, message, m);
};

handler.help = ['cleartmp'];
handler.tags = ['owner'];
handler.command = ['cleartmp', 'borrartmp', 'vaciartmp'];
handler.rowner = true;

export default handler;
