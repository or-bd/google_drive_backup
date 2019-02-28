# Google Drive API backup script

A tiny script that takes your important local folders, zipping them and upload the 
zipped file to your Google Drive folder. You can execute it as a scheduled task 
in your private machine for upload daily backups or manually on demand.

### Installation and usage

First you need to clone this project to your local machine:

``` 
$ git clone https://github.com/or-bd/google_drive_backup.git 
```

Then you need to install app dependencies from NPM:

``` 
$ cd google_drive_backup && npm i 
```

The next step is to enable the Drive API and to generate `credentials.json` file form 
[Google Drive API Quickstart](https://developers.google.com/drive/api/v3/quickstart/nodejs):

1. Make sure you're logged in to Google in your browser.
2. Click on the `ENABLE THE DRIVE API` button.
3. Approve and generate configurations.
4. Click on `DOWNLOAD CLIENT CONFIGURATION` and **save the file in the config folder in this project**.

**IMPORTANT**: DON'T CHANGE THE FILE NAME, IT SHOULD BE CALLED `credentials.json`.

### Personal settings 
In the config folder you'll also find the `settings.example.json` file, copy it and create a new 
file called `settings.json`, then update it according to your needs:

* `backupDays` - number of days to store backups in your google drive folder (old backups will be deleted).
* `directoryId` - the Google Drive folder id which will contain your backups, you can find the id in the folder URL.
* `DirectoriesBackup` - array of paths in your local machine that you want to zip and upload to your Google Drive folder.

### Execution

We're finally ready to upload your first backup! in the project folder run:

```
$ node backup.js
```

*NOTE: For the first execution you'll be asked by Google to let yourself permissions to manage 
your Drive from this app, at this point your CLI will print a google link, go and approve
yourself, then you'll get a short token, copy and paste it in your console.*

That's it! go to your Google Drive directory (the one you set as `directoryId` in your setting file)
and check if you have a new backup file called `backup_dd_mm_yyyy.zip` :)
