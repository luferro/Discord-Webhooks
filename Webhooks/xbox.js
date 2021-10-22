import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { urls } from '../server.js';
import { getVideoID } from '../Utils/checkYoutube.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_XBOX_ID,
	process.env.WEBHOOK_XBOX_TOKEN
);

export const getXbox = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	const options = [
		{ name: 'gamepass', url: 'https://news.xbox.com/en-us/xbox-game-pass/' }, 
		{ name: 'consoles', url: 'https://news.xbox.com/en-us/consoles/'},
		{ name: 'deals', url: 'https://majornelson.com/category/xbox-store/'}
	];

	for(const option of options) {
		const res = await fetch(option.url);
		if(!res.ok) { 
			console.log(`getXbox: got a status code of ${res.status} - ${res.statusText}`);
			continue;
		}
		const body = await res.text();
		const $ = cheerio.load(body);

		const hasVideo = $('.archive-main .media .media-image').first().children().hasClass('video-wrapper');

		const title = $('.archive-main .media .media-body .feed__title a').first().text();
		const url = $('.archive-main .media .media-body .feed__title a').first().attr('href');
		const video = hasVideo ? $('.archive-main .media .media-image .video-wrapper').first().attr('data-src') : null;
		const image = hasVideo ? $('.archive-main .media .media-image .video-wrapper img').first().attr('src') : $('.archive-main .media .media-image a img').first().attr('src');

		const videoID = hasVideo ? getVideoID(video.split('?')[0]) : 'dQw4w9WgXcQ';
		const videoURL = `https://www.youtube.com/watch?v=${videoID}`;
		
		if(
			urls.includes(url) ||
			(option.name === 'gamepass' && !title.toUpperCase().includes('XBOX GAME PASS')) ||
			(option.name === 'deals' && !title.toUpperCase().includes('DEALS WITH GOLD'))
		) 
			continue;

		if(video) {
			webhook.send(`**${title}**\n${videoURL}`);
		}
		else {
			webhook.send({
				embeds: [
					option.name === 'gamepass' && title.toUpperCase().includes('COMING SOON') ?
						new MessageEmbed()
							.setTitle(title)
							.setURL(url)
							.setImage(image)
							.setColor(random)
						:
						new MessageEmbed()
							.setTitle(title)
							.setURL(url)
							.setThumbnail(image)
							.setColor(random)
				]
			});
		}

		urls.push(url);	
	}
};