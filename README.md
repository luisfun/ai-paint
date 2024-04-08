# AI Paint [![license](https://img.shields.io/github/license/luisfun/ai-paint)](https://github.com/LuisFun/ai-paint/blob/main/LICENSE)

[👉 Web Site](https://ai-paint.luis.fun)

## Fork, Clone, Install, Dev

[Fork and Clone](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)

```sh
cd ai-paint
npm i
npm run dev
```

> [!IMPORTANT]
> Edit the following file: `src\lib\config.ts`

## Create Pages

[Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/git-integration/)

Add Environment variables.  
[`Workers & Pages`](https://dash.cloudflare.com/?to=/:account/workers-and-pages) > `ai-paint` > `Settings` > `Environment variables`

```
AI_GATEWAY_ENDPOINT = ...
WORKERS_AI_API_TOKEN = ... // secret
TURNSTILE_SECRET = ... // secret
```

## Setup AI Gateway

[Creat AI Gateway](https://developers.cloudflare.com/ai-gateway/get-started/creating-gateway/)

Get API Endpoint  
[`AI Gateway`](https://dash.cloudflare.com/?to=/:ai/ai-gateway/settings) > `AI Paint API Endpoint` > Select `Workers AI`

Set Caching and Rate-limiting  
[`AI Gateway`](https://dash.cloudflare.com/?to=/:ai/ai-gateway/settings)

[Creat API Token](https://dash.cloudflare.com/profile/api-tokens)  
Select template `Workers AI`

## Setup Turnstile

[Key issuance and WAF setup](https://blog.cloudflare.com/integrating-turnstile-with-the-cloudflare-waf-to-challenge-fetch-requests)

Use the Access policy to restrict access to development previews.  
[`Workers & Pages`](https://dash.cloudflare.com/?to=/:account/workers-and-pages) > `ai-paint` > `Manage` > `Access policy` > `Enable access policy`

Redirect access to ai-paint.pages.dev using Bulk Redirects.  
[`Bulk Redirects`](https://dash.cloudflare.com/?to=/:account/bulk-redirects) > ...
