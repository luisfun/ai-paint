<script lang="ts">
  import { site } from '$lib/config'
  export let title: string = site.title
  export let description: string = site.description
  export let image: string = site.image
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={site.url} />
  <meta property="og:image" content={image} />
  <meta property="og:type" content="website" />
  <meta property="og:image:alt" content={description} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:creator" content={site.author} />
  <meta name="theme-color" media="(prefers-color-scheme: light)" content={site.colorLight} />
  <meta name="theme-color" media="(prefers-color-scheme: dark)" content={site.colorDark} />
  <meta name="msapplication-TileColor" content={site.tileColor} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <link rel="icon" href={site.icon} />
  <link rel="apple-touch-icon" sizes={site.apple.sizes} href={site.apple.icon} />
</svelte:head>
