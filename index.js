const { Client, Authenticator } = require("minecraft-launcher-core");
const launcher = new Client();
const { app, BrowserWindow, Menu, ipcMain } = require("electron");

let win;
function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });
    win.loadFile("index.html");

    Menu.setApplicationMenu(null);

    win.on("closed", () => {
        win = null;
    });

    ipcMain.on("start", (event, arg) => {
        let username = arg;
        console.log("Starting Minecraft for " + username);
        let opts = {
            clientPackage: null,
            authorization: Authenticator.getAuth(username),
            root: "./minecraft",
            version: {
                number: "1.16",
                type: "release",
            },
            memory: {
                max: "6G",
                min: "4G",
            },
        };

        launcher.launch(opts);

        launcher.on("data", (e) => {
            win.webContents.send("data", e);
            if (e.includes("Render thread/INFO")) {
                win.hide(); // Oyun açılınca pencereyi gizler
            }
        });
    });
}

app.on("ready", createWindow);
