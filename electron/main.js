import { app, BrowserWindow, dialog, shell } from 'electron'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

function createWindow () {
  const win = new BrowserWindow({
    width:  1280,
    height: 800,
    minWidth:  900,
    minHeight: 600,
    title: 'ControllerMeta',
    icon: join(__dirname, '../src/assets/images/ControllerMeta.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration:  false,
    },
  })

  const indexPath = join(__dirname, '../dist/index.html')
  if (!existsSync(indexPath)) {
    dialog.showErrorBox(
      'ControllerMeta — Build not found',
      `Could not find dist/index.html.\nRun "npm run build" first.`
    )
    app.quit()
    return
  }

  win.loadFile(indexPath)

  // Open external links in the system browser, not in the app window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

