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

  <footer class="flex justify-between items-center text-xs my-8">
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
  :global(:root [data-theme='wintry']) {
    --theme-font-family-heading: system-ui;
    --theme-font-color-base: #000;
    background-image: radial-gradient(at 50% 0%, rgba(var(--color-secondary-500) / 0.18) 0px, transparent 75%),
      radial-gradient(at 100% 0%, rgba(var(--color-tertiary-500) / 0.18) 0px, transparent 50%);
  }
  :global(h2) {
    font-size: 2rem;
    margin: 2rem 0 1rem;
  }
  :global(h3) {
    font-size: 1.5rem;
    margin: 1.5rem 0 0.75rem;
  }
  :global(p) {
    margin: .5rem 0;
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
  :global(.accordion-panel > *) {
    margin-top: 0;
  }
  :global(.space-y-4 > :not([hidden]) ~ :not([hidden])) {
    margin-top: 0;
  }
</style>
