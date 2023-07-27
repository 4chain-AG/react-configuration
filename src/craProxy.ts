const DEFAULT_CONFIG_FILE_PATH = 'env-config.json'

export const expressProxy = (express: any) => {
  return function (app: any) {
    app.use('/' + DEFAULT_CONFIG_FILE_PATH, express.static(DEFAULT_CONFIG_FILE_PATH))
  }
}
