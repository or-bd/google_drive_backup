const Zip = require('./src/Zip');
const GoogleAuth = require('./src/GoolgeDriveAuth');
const GoogleActions = require('./src/GoogleDriveActions');

const backup = async () => {
  const googleClient = await GoogleAuth.getClient();
  const zip = await Zip.getZippedFolders();
  const uploaded = await GoogleActions.upload(googleClient, zip);

  if (uploaded && uploaded.id) {
    const backups = await GoogleActions.getAll(googleClient);
    const oldBackups = GoogleActions.findOldBackups(backups);
    GoogleActions.remove(googleClient, oldBackups);
    return zip.name;
  }

  throw `Failed to upload '${zip.name}'`;
};

backup()
  .then((zipName) => {
    console.log(`'${zipName}' uploaded successfully!`);
  })
  .catch((e) => {
    throw e;
  });
