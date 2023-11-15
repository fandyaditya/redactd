import { default as pangeaLib } from '$lib/server/pangea';
import type { ResponseObject } from 'pangea-node-sdk/dist/response';
import type { RequestHandler } from './$types';
import type { RequestEvent } from './$types';

export const GET = async ( { url } : RequestHandler ) => {
    const redactResult = await pangeaLib(url.searchParams.get('text'));
    return new Response(JSON.stringify(redactResult), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}     