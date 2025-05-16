/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

const CACHE = `gtw-cache-${version}`;

const ASSETS = [
    ...build, // the app itself
    ...files  // everything in `static`
];


self.addEventListener('install', (event) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
    event.waitUntil(self.clients.claim());

    /*if (navigator.serviceWorker) {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage("serviceWorkerActivation");
        }
        if (navigator.serviceWorker.onmessage)
            MessageEvent

            navigator.serviceWorker.onmessage(() => {

            });
    }*/

    //location.reload();
});

//self.addEventListener('')

self.addEventListener('onmessage', (event) => {
    if (event.data == "swReload") {
        event.waitUntil(self.registration.unregister());
        event.waitUntil((async () => { (await self.clients.matchAll()).forEach((client) => { client.naviagte(client.url); }) }))
    }
})

self.addEventListener('fetch', (event) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            const response = await cache.match(url.pathname);

            if (response) {
                return response;
            }
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await fetch(event.request);

            // if we're offline, fetch can return a value that is not a Response
            // instead of throwing - and we can't pass this non-Response to respondWith
            if (!(response instanceof Response)) {
                throw new Error('invalid response from fetch');
            }

            let newHeaders = new Headers(response.headers);
            newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
            newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");
            newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

            let newResponse = new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers: newHeaders,
            });

            if (response.status === 200) {
                cache.put(event.request, newResponse.clone());
            }

            return newResponse;
        } catch (err) {
            const response = await cache.match(event.request);

            if (response) {
                return response;
            }

            // if there's no cache, then just error out
            // as there is nothing we can do to respond to this request
            throw err;
        }
    }

    event.respondWith(respond());
});