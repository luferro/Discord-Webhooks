import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_NINTENDO_ID,
	process.env.WEBHOOK_NINTENDO_TOKEN
);

export const getNintendo = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	try {
		const res = await fetch('https://www.reddit.com/r/NintendoSwitch/search.json?q=flair_name%3A%22News%22&restrict_sr=1&sort=new');
		const articles = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
		if(!res.ok) return console.log(`${res.status} - ${articles}`);

		if(articles.data.children.length === 0) return;

		const title = articles.data.children[0].data.title.slice(0, 256);
		const url = articles.data.children[0].data.url;
		const hasMedia = articles.data.children[0].data.secure_media;

		if(urls.includes(url) || url.includes('https://www.reddit.com/r/NintendoSwitch')) return;

		if(hasMedia) {
			webhook.send(`**${title}**\n${url}`);
		} 
		else {
			webhook.send({
				embeds: [
					new MessageEmbed()
						.setTitle(title)
						.setURL(url.includes('/r/') ? `https://www.reddit.com${url}` : url)
						.setColor(random)
				]
			});
		}

		urls.push(url);
	} catch (error) {
		console.log(error);
	}
};
