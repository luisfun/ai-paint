<script lang="ts">
  import { site } from '$lib/config'
  export let title: string = site.title
  export let description: string = site.description
  //export let image: string = site.image
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <!--
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={site.url} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="website" />
  -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content={site.author} />
  <meta name="theme-color" media="(prefers-color-scheme: light)" content={site.color.light} />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content={site.color.dark} />
  <meta name="msapplication-TileColor" content={site.color.tile} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <!--
  <link rel="icon" type="image/svg+xml" href={site.icon.svg} />
  -->
  <link rel="apple-touch-icon" sizes={site.icon.apple.sizes} href={site.icon.apple.png} />
</svelte:head>
