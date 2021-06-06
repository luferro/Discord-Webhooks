import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { urls } from '../server.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_XBOX_ID,
	process.env.WEBHOOK_XBOX_TOKEN
);

export const getXbox = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	const options = ['https://news.xbox.com/en-us/xbox-game-pass/', 'https://news.xbox.com/en-us/consoles/', 'https://majornelson.com/category/xbox-store/'];
	try {
		for (const option of options) {
			const res = await fetch(option);
			const body = await res.text();
			const $ = cheerio.load(body);

			const hasVideo = $('.archive-main .media .media-image').first().children().hasClass('video-wrapper');

			const title = $('.archive-main .media .media-body .feed__title a').first().text();
			const url = $('.archive-main .media .media-body .feed__title a').first().attr('href');
			const feedType = $('.archive-main .media .media-body .feed__type a').first().text();
			const feedTypeURL = $('.archive-main .media .media-body .feed__type a').first().attr('href');
			const video = hasVideo ? $('.archive-main .media .media-image .video-wrapper').first().attr('data-src') : null;
			const image = hasVideo ? $('.archive-main .media .media-image .video-wrapper img').first().attr('src') : $('.archive-main .media .media-image a img').first().attr('src');

			if(
				urls.includes(url) ||
				(option === options[0] && !title.toUpperCase().includes('XBOX GAME PASS'))
			) 
				return;

			if(video) {
				webhook.send({
					embeds: [
						new MessageEmbed()
							.setTitle(title)
							.setURL(url)
							.addField('**Category**', `[${feedType}](${feedTypeURL})`)
							.addField('**Youtube**', `[Here!](${video})`)
							.setImage(image)
							.setColor(random)
					],
				});
			}
			else {
				webhook.send({
					embeds: [
						new MessageEmbed()
							.setTitle(title)
							.setURL(url)
							.addField('**Category**', `[${feedType}](${feedTypeURL})`)
							.setImage(image)
							.setColor(random)
					],
				});
			}

			urls.push(url);	
		}
	} catch (error) {
		console.log(error);
	}
};