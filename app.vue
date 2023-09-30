<script setup>
import '@unocss/reset/tailwind.css'

const { public:{ prodUrl } } = useRuntimeConfig()
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  charset: 'utf-8',
  title: 'ShowSphere',
  titleTemplate: title => title !== 'ShowSphere' ? `${title} · ShowSphere` : title,
  meta: [
    { name: 'description', content: 'Watch movies, anime, tv shows, ad free' },
    { property: 'og:image', content: `${prodUrl}/ShowSphere-logos.jpeg` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@gotham.sh' },
    { name: 'twitter:creator', content: '@gotham.sh' },
  ],
  link: [
    {
      rel: 'icon', type: 'image/png', href: '/favicon.png',
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NavBar lg:order-first />
  <!-- grid="~ lt-lg:rows-[1fr_max-content] lg:cols-[max-content_1fr]" -->
  <div
    h-full w-full font-sans
    of-auto view-transition-app transition duration-0
  >
    <div id="app-scroller" of-x-hidden of-y-auto relative>
      <NuxtPage />
    </div>
    <IframeModal />
    <PhotoModal />
  </div>
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
  background: #111;
  color: white;
  color-scheme: dark;
}
</style>
