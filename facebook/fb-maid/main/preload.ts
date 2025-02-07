import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

const handler = {
  send(channel: string, value: unknown) {
    ipcRenderer.send(channel, value)
  },
  on(channel: string, callback: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  }
}

contextBridge.exposeInMainWorld('ipc', handler)

contextBridge.exposeInMainWorld('api', {
  unlikePage: (data) => ipcRenderer.invoke('unlike-page', data),
  fetchLikedPages: async () => {
    return await ipcRenderer.invoke('fetch-liked-pages'); // Returns the data directly
  }
  // setWindowIsReady: (isReady: boolean) => {
  //   ipcRenderer.send('window-is-ready', isReady)
  // },
  // onLauncherUrl: (callback) => {
  //   ipcRenderer.on('launcher-url', (_event, url: string) => {
  //     callback(url)
  //   })
  // },
})

export type IpcHandler = typeof handler
