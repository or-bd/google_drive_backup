const fs = require('fs');
const moment = require('moment');
const archiver = require('archiver');

const archive = archiver('zip', { zlib: { level: 9 } });
const { DirectoriesBackup } = require('../config/settings.json');

const getZippedFolders = () => {
  console.log('- Start zipping folders....');
  const today = moment().format('DD_MM_YYYY');
  const zip = { name: `backup_${today}.zip` };
  zip.path = `${__dirname}/../${zip.name}`;

  const output = fs.createWriteStream(zip.name);
  archive.pipe(output);

  for (let i = 0; i < DirectoriesBackup.length; i++) {
    archive.directory(DirectoriesBackup[i]);
  }

  archive.finalize();

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log('- Folders zip file created successfully.');
      resolve(zip);
    });
    archive.on('error', (err) => {
      console.log(`- Failed to create folders zip file - ${err.message}`);
      reject(err);
    });
  });
};

module.exports = {
  getZippedFolders,
};
