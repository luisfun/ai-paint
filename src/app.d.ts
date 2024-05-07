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
        ACCOUNT_ID: string
        TURNSTILE_SECRET: string
        WORKERS_AI_API_TOKEN: string
      }
    }
  }
}

export {}
