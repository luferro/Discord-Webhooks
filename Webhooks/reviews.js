import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';
import { checkOpencritic } from '../Utils/checkOpencritic.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_REVIEWS_ID,
	process.env.WEBHOOK_REVIEWS_TOKEN
);

export const getReviews = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	try {
		const { opencritic_id, opencritic_url } = await checkOpencritic();

		const res = await fetch(`https://api.opencritic.com/api/game/${opencritic_id}`);
		const reviews = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
		if(!res.ok) return console.log(`${res.status} - ${reviews}`);;

		const title = reviews.name;
		const image = reviews.bannerScreenshot ? `https:${reviews.bannerScreenshot.fullRes}` : null;
		const url = opencritic_url;
		const releaseDate = reviews.firstReleaseDate.split('T')[0];
		const count = reviews.numReviews;
		const score = Math.round(reviews.topCriticScore);
		const tier = reviews.tier;
		const platforms = reviews.Platforms.map(platform => `> ${platform.name}`);

		if(urls.includes(url) || (!tier && score === -1)) return;

		webhook.send({
			embeds: [
				new MessageEmbed()
					.setTitle(`${title}`)
					.setURL(url)
					.addField('**Release date**', releaseDate)
					.addField('**Available on**', platforms.length > 0 ? platforms.join('\n') : 'N/A')
					.addField('**Tier**', tier ? tier : 'N/A', true)
					.addField('**Score**', score && score > 0 ? score : 'N/A', true)
					.addField('**Reviews count**', count ? count : 'N/A', true)					
					.setImage(image ? image : '')
					.setFooter('Powered by OpenCritic')
					.setColor(random)
			]
		});

		urls.push(url);
	} catch (error) {
		console.log(error);
	}
};