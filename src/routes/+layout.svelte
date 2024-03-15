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
  <footer class="flex-center text-sm my-8">
    <a class="text-sub" href="/privacy">Privacy Policy</a>
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
    --theme-font-color-base: 0 0 0;
    --color-surface-900: 17 18 23;
    background-image: radial-gradient(at 50% 0%, rgba(var(--color-secondary-500) / 0.1) 0px, transparent 75%),
      radial-gradient(at 100% 0%, rgba(var(--color-tertiary-500) / 0.1) 0px, transparent 50%);
  }
  :global(:root) {
    --font-color-base-sub: rgba(0,0,0,0.6);
    --font-color-dark-sub: rgba(255,255,255,0.6);
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
    margin: 0.5rem 0;
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
  :global(.accordion-panel > *) {
    margin-top: 0;
  }
  :global(.space-y-4 > :not([hidden]) ~ :not([hidden])) {
    margin-top: 0;
  }

  :global(.flex-center) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  :global(.text-sub:not(:hover)) {
    color: var(--font-color-base-sub);
  }
  :global(.dark .text-sub:not(:hover)) {
    color: var(--font-color-dark-sub);
  }
</style>
