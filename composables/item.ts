import { useSingleton } from './utils'
import type { Image, Media, Video } from '~/types'

export function getTrailer(item: Media) {
  const trailer = item.videos?.results?.find(video => video.type === 'Trailer')
  return getVideoLink(trailer)
}

export function getVideoServer(item: Media, type: string) {
  return `/embed/${type}/${item?.id ? item.id : item.external_ids?.imdb_id}`
}

export function getVideoServer2(item: Media) {
  return `/directstream.php?video_id=${item.id}&tmdb=1`
}

export function getVideoLink(item?: Video): string | null {
  if (!item?.key)
    return null
  return `https://www.youtube.com/embed/${item.key}?rel=0&showinfo=0&autoplay=0`
}

const [
  provideIframeModal,
  useIframeModal,
] = useSingleton<({ link, isSandbox }: { link: Video | string | null; isSandbox: boolean }) => void>()

const [
  provideImageModal,
  useImageModal,
] = useSingleton<(photos: Image[], index: number) => void>()

export {
  useIframeModal,
  provideIframeModal,
  useImageModal,
  provideImageModal,
}
