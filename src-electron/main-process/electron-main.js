import { app, BrowserWindow, nativeTheme, Menu, ipcMain} from 'electron'

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('showDirectoryGetter', async (event,arg) => {
	event.returnValue = await invokeDirectoryGetter();
})

function invokeDirectoryGetter () {
	return new Promise((resolve, reject) => {
		const { dialog } = require('electron')
		resolve(dialog.showOpenDialog({ properties: ['openDirectory','createDirectory','promptToCreate'] }))
	})
}

ipcMain.on('showSelectEmptyOnlyMSG', async (event,arg) => {
	event.returnValue = await invokeOKError(arg);
})

function invokeOKError (msg) {
	return new Promise((resolve, reject) => {
		const { dialog } = require('electron')
		const options = {
			type: 'error',
			buttons: ['Ok'],
			defaultId: 0,
			title: 'Error',
			message: msg,
		};
		resolve(dialog.showMessageBox(null,options))
	})
}

Menu.setApplicationMenu(null)
