const fs = require('fs');
const moment = require('moment');
const { google } = require('googleapis');
const { directoryId, backupDays } = require('../config/settings.json');

const getAll = (auth) => {
  const service = google.drive('v3');
  const options = {
    auth,
    includeRemoved: false,
    spaces: 'drive',
    fileId: directoryId,
    fields: 'nextPageToken, files(id, name, parents, mimeType, modifiedTime)',
    q: `'${directoryId}' in parents`,
  };

  return new Promise((resolve, reject) => {
    service.files.list(options, (err, response) => {
      if (err) {
        return reject(`GoogleDrive 'getAll' failed: ${err.message}`);
      }
      resolve(response.data.files);
    });
  });
};

const upload = (auth, zip) => {
  const service = google.drive({ version: 'v3', auth });
  const options = {
    resource: {
      name: zip.name,
      mimeType: 'application/zip',
      parents: [directoryId],
    },
    media: {
      mimeType: 'application/zip',
      body: fs.createReadStream(zip.path),
    },
  };

  return new Promise((resolve, reject) => {
    service.files.create(options, (err, response) => {
      if (err) {
        return reject(`GoogleDrive 'upload' failed: ${err.message}`);
      }
      fs.unlink(zip.path);
      resolve(response.data);
    });
  });
};

const findOldBackups = (backups) => {
  const old = [];
  const filesCount = backups.length;
  const oldBackupDate = moment().subtract(backupDays, 'days').toDate();

  for (let i = 0; i < filesCount; i++) {
    const currBackupCreation = new Date(backups[i].modifiedTime);

    if (oldBackupDate > currBackupCreation) {
      old.push(backups[i].id);
    }
  }
  return old;
};

const remove = (auth, backups) => {
  const service = google.drive({ version: 'v3', auth });

  for (let i = 0; i < backups.length; i++) {
    service.files.delete({ fileId: backups[i] });
  }
};

module.exports = {
  getAll,
  upload,
  remove,
  findOldBackups,
};
