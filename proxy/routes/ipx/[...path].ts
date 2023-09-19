import { createIPX, createIPXMiddleware } from 'ipx'

const tmdb = process.env.IMAGE_URL_TMDB || ''
const youtube = process.env.IMAGE_URL_YOUTUBE || ''
const publicApp = process.env.IMAGE_URL_APP || ''

const ipx = createIPX({
  maxAge: 3600,
  alias: {
    '/tmdb': tmdb,
    '/youtube': youtube,
    '/public': publicApp,
  },
  domains: [
    new URL(tmdb).host,
    new URL(youtube).host,
    new URL(publicApp).host,
  ],
})

const ipxMiddleware = createIPXMiddleware(ipx)
const ipxHandler = fromNodeMiddleware(ipxMiddleware)

export default eventHandler((event) => {
  event.node.req.url = `/${event.context.params!.path}`
  return ipxHandler(event)
})
