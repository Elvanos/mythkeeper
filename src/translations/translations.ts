export default {
  globals: {
    licenseStatuses: {
      allowed: "Allowed",
      notAllowed: "Forbidden",
      notSpecified: "Not specified"
    },
    statusStatuses: {
      hasConfig: "Has config",
      noConfig: "No config"
    }
  },
  moduleTemplate: {
    awn: {
      checkMKFoldersWarning: (path) => {
        return /*html*/`
        Profile not found - reseted to "Default".
        <br>
        Wondedraft INI reseted to default as well.
        <br>
         <br>
        Attempted to load directory:
        <br>
        <b>${path}</b>
        `
      },
      updateProfileIniWDWarning: /*html*/`
        <strong>Mythkeeper could not load the Wonderdraft configuration file (config.ini):</strong>
        <br>
        1. Please check settings if the Wonderdraft user folder path is set properly.
        <br>
        2. If your path is set properly, then please check if the config file exists in the directory.
        <br>
        3. If it doesn't, start Wonderdraft once to generate it.`,
      updateProfileIniWDSuccess: (path) => {
        return `
        Profile successfully set.
        <br>
        Currently used directory:
        <br>
        <b>${path}</b>`
      }
    }
  },
  installer: {
    taskTexts: {
      asset: "Installing asset",
      theme: "Installing theme",
      brush: "Installing brush"
    },
    awn: {
      success: {
        assetInstalled: (assetTitle) => { return `Asset <b>${assetTitle}</b> has been successfully installed.` },
        brushInstalled: (assetTitle) => { return `Brush <b>${assetTitle}</b> has been successfully installed.` },
        themeInstalled: (assetTitle) => { return `Theme <b>${assetTitle}</b> has been successfully installed.` }
      }
    }
  },
  assetMiniature: {
    placeholders: {
      folderSize: "Calculating...",
      assetVersion: "N/A"
    },
    actions: {
      backupAsset: "Backup asset",
      deleteAsset: "Delete asset",
      deleteAssetBackup: "Delete backup of the asset",
      filterByAuthor: "Filter by author & distributor:",
      filterByCommercialUse: "Filter by commercial use:",
      filterByDistributor: "Filter by author & distributor:",
      filterByLicense: "Filter by license:",
      filterByTag: "Filter by tag:",
      openGallery: "Open asset showcase gallery.",
      restoreAssetBackup: "Restore asset from a backup"
    },
    titles: {
      author: "Author:",
      authorAndDistributor: "Author & Distributor:",
      commercialUseTitle: "Commercial use:",
      description: "Description:",
      distributor: "Distributor:",
      license: "License & Use:",
      tags: "Tags:"
    },
    smallIconActions: {
      commentary: "Read the commentary containing important details on the license:",
      commercialURL: "Obtain proper commercial use license at following address:",
      donateUrlAuthor: "Consider donating to the author at following address:",
      donateUrlDistributor: "Consider donating to the distributor at following address:",
      licenseOffline: "Read license offline by opening a following file:",
      licenseOnline: "Read license online at following address:",
      "licenseUnknown:": "Try looking up the following license on Google:",
      openUrlAuthor: "Visit author's website:",
      openUrlDistributor: "Visit distributor's website:",
      sendEmailAuthor: "Send the author an email to:",
      sendEmailDistributor: "Send the distributor an email to:"
    },
    overlayTexts: {
      deleteAsset: {
        title: "Delete asset: ",
        contents: `
          <b>You are about to delete and asset that isn't backup up!</b>
          <br>
          <br>
          <b>How do you wish to proceed?</b>`,
        actions: {
          close: "Close",
          backupAndDelete: "Backup & Delete",
          delete: "Delete"
        }
      },
      backupAsset: {
        title: "Backup asset: ",
        contents: (currentVersion, backupVersion) => {
          return `
          <b>The asset seems to be backup up already.</b>
          <br>
          <br>
          Active asset version: <b>${currentVersion}</b>
          <br>
          Backup asset version: <b>${backupVersion}</b>
          <br>
          <br>
          <br>
          <b>Proceed?</b>`},
        actions: {
          close: "Close",
          overwrite: "Overwrite old version",
        }
      },
      deleteBackupAsset: {
        title: "Delete backup of asset: ",
        contents: `
          Mythkeeper is about to delete a backup of an asset.
          <br>
          The asset will still be recoverable by using the "Restore a previously deleted asset" in the top bar.
          <br>
          Unless "Safe Delete" is disabled in the settings.
          <br>        
          <br>
          <b>Proceed with deletion?</b>`,
        actions: {
          close: "Close",
          deleteBackup: "Delete backup"
        }
      }
    },
    taskTexts: {
      deleteAsset: "Deleting",
      deleteBackupAsset: "Deleting backup",
      restoreBackupAsset: "Restoring",
      backupAsset: "Backing up",

    },
    awn: {
      success: {
        assetDeleteBackup: (assetTitle) => { return `Backup of asset <b>${assetTitle}</b> has been successfully deleted.` },
        assetRecover: (assetTitle) => { return `Asset <b>${(assetTitle)}</b> has been successfully recovered.` },
        assetBackup: (assetTitle) => { return `Asset <b>${assetTitle}</b> has been successfully backed up.` },
        assetDelete: (assetTitle) => { return `Asset <b>${assetTitle}</b> has been successfully deleted.` },
      }
    }
  }
}
