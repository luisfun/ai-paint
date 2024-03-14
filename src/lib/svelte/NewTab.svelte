<script lang="ts">
  export let color: 'inherit' | undefined = undefined
  export let href: string
  export let label: string
  export let display: 'block' | undefined = undefined
</script>

<a
  class="h-full {display ? "block" : ""} {color ? 'text-inherit' : ''} {display ? 'unset' : ''}"
  {href}
  aria-label={label}
  rel="noreferrer noopener"
  target="_blank"
>
  <slot />
</a>
