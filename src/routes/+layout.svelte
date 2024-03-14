<script lang="ts">
  import '../app.postcss'
  import { LightSwitch } from '@skeletonlabs/skeleton'
  import NewTab from '$lib/svelte/NewTab.svelte'
  import Svg from '$lib/svelte/Svg.svelte'
  import Head from './Head.svelte'
</script>

<Head />
<div class="m-auto px-4 max-w-screen-lg">
  <header class="flex justify-between items-center my-4">
    <a class="text-inherit w-6 h-6" aria-label="Top Page" href="/">
      <Svg icon="paint" />
    </a>
    <LightSwitch />
  </header>
  <main class="flex-1 my-4">
    <slot />
  </main>

  <footer class="flex justify-between items-center text-xs my-4">
    <a class="text-inherit" href="/privacy">Privacy Policy</a>
    <NewTab color="inherit" href="https://github.com/LuisFun/ai-paint" label="Github">
      <div class="w-4 h-4">
        <Svg icon="github" />
      </div>
    </NewTab>
  </footer>
</div>

<style>
  :global(html) {
    font-size: medium;
  }
  @media screen and (min-width: 896px) {
    :global(html) {
      font-size: large;
    }
  }
  :global(a) {
    color: #4693ff;
    text-decoration: none;
    transition: color 150ms ease;
  }
  :global(a:hover) {
    color: rgb(249 115 22);
    text-decoration: underline;
  }
  :global(.flex-center) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
