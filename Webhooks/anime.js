import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';
import { checkAnime } from '../Utils/checkAnime.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_ANIME_ID,
	process.env.WEBHOOK_ANIME_TOKEN
);

const animeAggregators = [
	{ name: 'MyAnimeList', url: '//myanimelist.net/anime/' }, 
	{ name: 'AniList', url: '//anilist.co/anime/' }, 
	{ name: 'Anime-Planet', url: '//www.anime-planet.com/anime/' }
];

const animeStreams = [
	{ name: 'Crunchyroll', url: '//www.crunchyroll.com/' },
	{ name: 'Crunchyroll', url: '//crunchyroll.com/' },
	{ name: 'AnimeLab', url: '//www.animelab.com/shows/' },
	{ name: 'Funimation', url: '//www.funimation.com/shows/' },
	{ name: 'VRV', url: '//vrv.co/series/' },
	{ name: 'HIDIVE', url: '//www.hidive.com/tv/' },
	{ name: 'Netflix', url: '//www.netflix.com/title/' },
]

export const getAnime = async () => {
	const random = Math.floor(Math.random() * 16777215).toString(16);

	try {
		const res = await fetch('https://www.reddit.com/r/anime/search.json?q=flair_name%3A%22Episode%22&restrict_sr=1&sort=new');
		const anime = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
        if(!res.ok) return console.log(`${res.status} - ${res.statusText}`);

		if(anime.data.children.length === 0) return;

        const title = anime.data.children[0].data.title.slice(0, 256);
        const url = anime.data.children[0].data.url;
        const selftext = anime.data.children[0].data.selftext.split('\n');

		const animeStreamsInfo = animeStreams.map(item => ({
			name: item.name,
			url: selftext.find(nestedItem => nestedItem.includes(item.url))?.match(/(?<=\()(.*)(?=\))/g)[0]
		})).filter(item => item.url !== undefined);
		const animeStreamsFormatted = animeStreamsInfo.map(item => `> **[${item.name}](${item.url})**`);

		const animeAggregatorsInfo = animeAggregators.map(item => ({
			name: item.name,
			url: selftext.find(nestedItem => nestedItem.includes(item.url))?.match(/(?<=\()(.*)(?=\))/g)[0]
		})).filter(item => item.url !== undefined);
		const animeInfoFormatted = animeAggregatorsInfo.map(item => `> **[${item.name}](${item.url})**`);

        if(urls.includes(url)) return;
		
		const anime_id = animeAggregatorsInfo.filter(item => item.url.includes(animeAggregators[0].url))[0]?.url.match(/\d+/g)[0];
        const { episodesCount, score, image } = await checkAnime(anime_id);

		webhook.send({
			embeds: [
				new MessageEmbed()
					.setTitle(title.replace(/Discussion|discussion/, '').trim())
                    .addField('**Streams**', animeStreamsFormatted.length > 0 ? animeStreamsFormatted.join('\n') : 'N/A')
                    .addField('**Anime Information**', animeInfoFormatted.length > 0 ? animeInfoFormatted.join('\n') : 'N/A')
                    .addField('**Total episodes**', episodesCount ? episodesCount : 'N/A', true)
					.addField('**Score**', score ? score : 'N/A', true)
					.setURL(url)
                    .setThumbnail(image)
					.setColor(random)
			]
		});

		urls.push(url);
	} catch (error) {
		console.log(error);
	}
};
