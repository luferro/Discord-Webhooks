import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_DEALS_ID,
	process.env.WEBHOOK_DEALS_TOKEN
);

export const getDeals = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	const res = await fetch('https://www.reddit.com/r/GameDeals/new.json');
	const deals = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
	if(!res.ok) return console.log(`getDeals: got a status code of ${res.status} - ${res.statusText}`);

	if(deals.data.children.length === 0) return;

	const title = deals.data.children[0].data.title;
	const url = deals.data.children[0].data.url;
	const thumbnail = deals.data.children[0].data.thumbnail;
	const image = thumbnail != 'default' && thumbnail != 'self' ? `https://i.redditmedia.com/${deals.data.children[0].data.preview.images[0].source.url.split('/')[3]}` : '';

	if(
		urls.includes(url) ||
		title.toUpperCase().includes('FREE') ||
		title.toUpperCase().includes('100%') ||
		title.toUpperCase().includes('[H]') ||
		title.toUpperCase().includes('[W]') ||
		title.match(/\[(.*?)\]/g).length === 0
	)
		return;

	webhook.send({
		embeds: [
			new MessageEmbed()
				.setTitle(title.length > 256 ? title.slice(0, 253) + '...' : title)
				.setURL(url)
				.setThumbnail(image)
				.setColor(random)
		]
	});

	urls.push(url);
};
