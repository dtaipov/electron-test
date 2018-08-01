const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow;
let firstWindow;
let secondWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({pathname: path.join(__dirname, 'mainWindow.html'), protocol: 'file:', slashes: true}));

  mainWindow.on('close', () => {
    app.quit();
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  firstWindow = new BrowserWindow({title: "First window", width: 300, height: 200});
  firstWindow.loadURL(url.format({pathname: path.join(__dirname, 'addWindow.html'), protocol: 'file:', slashes: true}));

  firstWindow.on('close', () => {
    firstWindow = null;
  });

  secondWindow = new BrowserWindow({title: "Second window", width: 300, height: 200});
  secondWindow.loadURL(url.format({pathname: path.join(__dirname, 'addWindow.html'), protocol: 'file:', slashes: true}));

  secondWindow.on('close', () => {
    secondWindow = null;
  });
});

/*const createSubWindow = (windowInstance, title) => {
  windowInstance = new BrowserWindow({title, width: 300, height: 200});
  windowInstance.loadURL(url.format({pathname: path.join(__dirname, 'addWindow.html'), protocol: 'file:', slashes: true}));

  windowInstance.on('close', () => {
    windowInstance = null;
  });
};*/


ipcMain.on('text:to_sub_window', (e, item) => {
  console.log("Main e.sender: ", e);
  // mainWindow.webContents.send('item:add', item);
  firstWindow.webContents.send('text:to_sub_window', item);
  secondWindow.webContents.send('text:to_sub_window', item);
  //firstWindow.close();
});

/*ipcMain.on('text:reply_to_first_window', (e, item) => {
  mainWindow.webContents.send('item:add', item);
  firstWindow.webContents.send('text:reply_to_first_window', item);
});*/

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      /*{
        label: 'Add item',
        click() {
          createAddWindow();
        }
      },*/
      {
        label: 'Clear Items',
        click() {
          mainWindow.webContents.send('item:clear');
        }
      },
      {label: 'Quit',
        accelerator: 'Ctrl+Q',
        click() {app.quit()}}
      ]
  }];


if (process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push(
    {
      label: 'Developer tools',
      submenu: [
        {
          label: "Toggle DevTools",
          accelerator: 'Ctrl+I',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        }, {role: 'reload'}
        ]
    });
}