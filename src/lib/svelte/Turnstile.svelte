<script lang="ts">
  import { onMount } from 'svelte'

  export let sitekey: string
  let display: 'flex' | 'hidden' = 'hidden'

  onMount(() => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    const originalFetch = window.fetch
    script.onload = () => {
      // Override the native fetch function
      window.fetch = async function (...args) {
        let response = await originalFetch(...args)
        // If the original request was challenged...
        if (response.headers.has('cf-mitigated') && response.headers.get('cf-mitigated') === 'challenge') {
          // The request has been challenged...
          display = 'flex'
          await new Promise((resolve, reject) => {
            // @ts-expect-error turnstile
            turnstile.render('#turnstile_widget', {
              sitekey,
              'error-callback': (e: any) => {
                display = 'hidden'
                reject(e)
              },
              callback: (token: any, preClearanceObtained: any) => {
                if (preClearanceObtained) {
                  // The visitor successfully solved the challenge on the page.
                  display = 'hidden'
                  resolve(undefined)
                } else {
                  reject(new Error('Unable to obtain pre-clearance'))
                }
              },
            })
          })
          // Replay the original fetch request, this time it will have the cf_clearance Cookie
          response = await originalFetch(...args)
        }
        return response
      }
    }
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    document.body.appendChild(script)
    // Clear fetch function
    return () => window.fetch = originalFetch
  })
</script>

<div class="fixed inset-0 z-10 bga justify-center items-center {display}">
  <div id="turnstile_widget"></div>
</div>

<style>
  .bga {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
