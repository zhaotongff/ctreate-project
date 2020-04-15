import mockInit from './mock/index.js'

function getPublicPath() {
  // 非本地环境返回 /public/
  if (process.env.NODE_ENV !== 'development') {
    return '/public/'
  }

  return '/'
}

function getSourceMap() {
  // 非线上环境开启 sourceMap
  return !!process.env.SOURCE_MAP
}

export const publicPath = getPublicPath()
export const productionSourceMap = getSourceMap()
export const devServer = {
  before(app) {
    mockInit(app)
  },
  port: 8080,
  proxy: Object.assign({
    '/api': {
      target: 'http://ds-dev.bdms.netease.com'
    }
  })
}
export const pwa = {
  serviceWorker: false
}
export const css = {
  loaderOptions: {
    less: {
      modifyVars: {
        'primary-color': '#0073fb',
        'link-color': '#3274e6',
        'border-radius-base': '2px',
        'success-color': '#33cc99',
        'error-color': '#e65c5c',
        'warning-color': '#f3b230',
        'disabled-color': '#999',
        'font-family':
          "'Helvetica Neue', Helvetica, Arial, 'Hiragino Sans GB', 'PingFang SC', 'Microsoft YaHei', tahoma, simsun, '宋体' "
      },
      javascriptEnabled: true
    }
  },
  sourceMap: getSourceMap()
}
export const pluginOptions = {
  mock: { entry: './mock/index.js' }
}
export function configureWebpack(config) {
  if (process.env.NODE_ENV !== 'production') {
    config.devtool = 'eval-source-map'
    config.output.devtoolModuleFilenameTemplate = info =>
      info.resourcePath.match(/\.vue$/) && !info.identifier.match(/type=script/)
        ? `webpack-generated:///${info.resourcePath}?${info.hash}`
        : `webpack-UserCode:///${info.resourcePath}`
    config.output.devtoolFallbackModuleFilenameTemplate = 'webpack:///[resource-path]?[hash]'
  }
}
export function chainWebpack(config) {
  // 开发阶段关闭 ts 检查
  config.plugin('fork-ts-checker').tap(args => {
    return [{ ...args[0], reportFiles: ['src/**/!(*.spec).{ts,tsx}'] }]
  })
}
export const lintOnSave = false
