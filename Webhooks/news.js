import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';
import { checkSubscribers } from '../Utils/checkSubscribers.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_NEWS_ID,
	process.env.WEBHOOK_NEWS_TOKEN
);

export const getNews = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	try {
		const res = await fetch('https://www.reddit.com/r/Games/new.json');
		const articles = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
		if(!res.ok) return console.log(`${res.status} - ${articles}`);

		if(articles.data.children.length === 0) return;

		const title = articles.data.children[0].data.title.slice(0, 256);
		const url = articles.data.children[0].data.url;
		const hasMedia = articles.data.children[0].data.secure_media;
		const channelType = hasMedia && (hasMedia.oembed.author_url?.includes('channel') ? 'channel' : hasMedia.oembed.author_url.includes('user') ? 'user' : 'custom');
		const channel = hasMedia && hasMedia.oembed.author_url?.split(`/${channelType}/`)[1];

		const subscribers = hasMedia && hasMedia.type === 'youtube.com' ? await checkSubscribers(channel, channelType, url) : null;

		if(
			urls.includes(url) ||
			title.toUpperCase().includes('REVIEW') ||
			url.includes('https://www.reddit.com/r/Games') ||
			(typeof subscribers === 'number' && subscribers < 50000)
		)
			return;

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
