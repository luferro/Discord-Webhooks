import { WebhookClient } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_MANGA_ID,
	process.env.WEBHOOK_MANGA_TOKEN
);

export const getManga = async () => {
	try {
		const res = await fetch('https://www.reddit.com/r/manga/search.json?q=flair_name%3A%22DISC%22&restrict_sr=1&sort=new');
		const manga = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
        if(!res.ok) return console.log(`${res.status} - ${manga}`);

		if(manga.data.children.length === 0) return;

        const title = manga.data.children[0].data.title.slice(0, 256);
        const titleFormatted = title.includes('[DISC]') ? title.replace('[DISC]', '').trim() : null;
        const url = manga.data.children[0].data.url;
		const isNSFW = manga.data.children[0].data.whitelist_status === 'promo_adult_nsfw' ? true : false;

        if(urls.includes(url) || url.includes('https://www.reddit.com/r/manga') || !titleFormatted) return;

		webhook.send(`**${isNSFW ? `[NSFW] ${titleFormatted}` : titleFormatted}**\n<${url.includes('/r/') ? `https://www.reddit.com${url}` : url}>`);

		urls.push(url);
	} catch (error) {
		console.log(error);
	}
};
