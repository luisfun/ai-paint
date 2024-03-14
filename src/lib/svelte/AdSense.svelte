<script lang="ts">
  import { onMount } from 'svelte'
  import { adsense } from '$lib/config'

  export let enabled = false

  let scriptTag: HTMLScriptElement

  $: if (enabled && scriptTag) scriptTag.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

  onMount(() => {
    // @ts-expect-error 他の書き方がわからない
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  })
</script>

<svelte:head>
  <script data-ad-client="ca-pub-{adsense.client}" async bind:this={scriptTag}></script>
</svelte:head>

<div class="my-8 mx-auto">
  <!-- display-bottom -->
  <ins
    class="adsbygoogle"
    style="display:block"
    data-ad-client="ca-pub-{adsense.client}"
    data-ad-slot={adsense.slot}
    data-ad-format="auto"
    data-full-width-responsive="true"
  ></ins>
</div>
