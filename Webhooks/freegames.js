import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_FREE_ID,
	process.env.WEBHOOK_FREE_TOKEN
);

export const getFreeGames = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	const res = await fetch('https://www.reddit.com/r/GameDealsFree/new.json');
	const games = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
	if(!res.ok) return console.log(`getFreeGames: got a status code of ${res.status} - ${res.statusText}`);

	if(games.data.children.length === 0) return;

	const title = games.data.children[0].data.title;
	const url = games.data.children[0].data.url;	
	const thumbnail = games.data.children[0].data.thumbnail;
	const image = thumbnail != 'default' && thumbnail != 'self'? `https://i.redditmedia.com/${games.data.children[0].data.preview.images[0].source.url.split('/')[3]}` : '';

	if(urls.includes(url)) return;

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
