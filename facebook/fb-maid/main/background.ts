import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
const axios = require('axios').default;
import { createWindow } from './helpers'

const ACCESS_TOKEN = "EACApFx8kikQBO4wmnebN1zjkIxnDxtfIGGgyncxyZCZBY9r7ar6bDPVx52gieib6owhbNmbzZAS2UrDYA8OmMBZBJ9pusK42ZAhDHHrxw0UlO29stpNSzHHt4tu5JJIk6Hs1gc2eglvT9ZCol4SXUeEltUPSnqSW9zPtgoQ1TQTdoIkDr8SbwoTgqrH7j3MN4FIJWi863RuZB3FDd3Wbq2R5h9II1Fp12YMTefUv0zLzGIAy56GW3AKLLS38HrHiGh9ZBwZDZD";
const FB_API_URL = `https://graph.facebook.com/v22.0/me/likes?fields=name,category,link,picture{url}&limit=10&access_token=${ACCESS_TOKEN}`;


const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})

// Fetch Liked Pages API Handler
ipcMain.handle("fetch-liked-pages", async (): Promise<Record<string, any[]>> => {
    try {
      console.log("Yo What's going on?!"); 
      let pagesByCategory: Record<string, any[]> = {};
        let nextUrl: string | null = FB_API_URL;

        while (nextUrl) {
            const response = await axios.get(nextUrl);
            const data = response.data;

            if (data.data) {
                data.data.forEach((page: any) => {
                    const category = page.category || "Unknown";
                    if (!pagesByCategory[category]) {
                        pagesByCategory[category] = [];
                    }
                    console.log(page);
                    pagesByCategory[category].push({
                        name: page.name,
                        link: page.link,
                        id: page.id,
                        pictureUrl: page.picture.data.url
                    });
                });
            }
            nextUrl = data.paging?.next || null;
        }

        return pagesByCategory;
    } catch (error) {
        console.error("Error fetching Facebook pages:", error);
        return {};
    }
});

ipcMain.handle('unlike-page', async (event, pageId) => {
    try {
        const unlikeUrl = `https://graph.facebook.com/v18.0/${pageId}/likes?access_token=${ACCESS_TOKEN}`;
        await axios.delete(unlikeUrl);
        return { success: true, message: "Page unliked successfully" };
    } catch (error) {
        console.error("Error unliking Facebook page:", error);
        return { success: false, message: "Failed to unlike page" };
    }
});
