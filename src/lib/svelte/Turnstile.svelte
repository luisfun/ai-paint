<script lang="ts">
  import { onMount } from 'svelte'
  import { turnstileSiteKey } from '$lib/config'

  export let widgetID: string = 'turnstile_widget'
  let display: 'block' | 'hidden' = 'hidden'

  onMount(async () => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.onload = () => {
      const originalFetch = window.fetch
      // Override the native fetch function
      window.fetch = async function (...args) {
        let response = await originalFetch(...args)
        // If the original request was challenged...
        if (response.headers.has('cf-mitigated') && response.headers.get('cf-mitigated') === 'challenge') {
          // The request has been challenged...
          display = 'block'
          await new Promise((resolve, reject) => {
            // @ts-expect-error turnstile
            turnstile.render('#turnstile_widget', {
              sitekey: turnstileSiteKey,
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
  })
</script>

<div class="fixed inset-0 bg-[rgba(0, 0, 0, 0.7)] z-10 {display}">
  <div class="flex flex-nowrap items-center justify-center" id={widgetID}></div>
</div>
