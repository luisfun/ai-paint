// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env?: {
        AuthKV: KVNamespace
        TURNSTILE_SECRET: string
        AI_GATEWAY_ENDPOINT: string
        WORKERS_AI_API_TOKEN: string
      }
    }
  }
}

export {}
