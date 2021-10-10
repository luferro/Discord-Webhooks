import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { urls } from '../server.js';
import { checkReviews } from './checkReviews.js';

let serverRestarted = true;

export const checkServer = async () => {
	const { id } = await checkReviews();

	const sources = [
		{ option: 'News', url: 'https://www.reddit.com/r/Games/new.json' },
		{ option: 'Reviews', url: `https://api.opencritic.com/api/game/${id}` },
		{ option: 'Deals', url: 'https://www.reddit.com/r/GameDeals/new.json' },
		{ option: 'FreeGames', url: 'https://www.reddit.com/r/GameDealsFree/new.json' },
		{ option: 'Xbox', url: 'https://news.xbox.com/en-us/xbox-game-pass/' },
		{ option: 'Xbox', url: 'https://news.xbox.com/en-us/consoles/' },
		{ option: 'Xbox', url: 'https://majornelson.com/category/xbox-store/' },
		{ option: 'Playstation', url: 'https://www.reddit.com/r/PS5/search.json?q=flair_name%3A%22Articles%20%26%20Blogs%22%20OR%20flair_name%3A%22%3Aps%3A%20Official%22&restrict_sr=1&sort=new' },
		{ option: 'Nintendo', url: 'https://www.reddit.com/r/NintendoSwitch/search.json?q=flair_name%3A%22News%22&restrict_sr=1&sort=new' },
		{ option: 'Anime', url: 'https://www.reddit.com/r/anime/search.json?q=flair_name%3A%22Episode%22&restrict_sr=1&sort=new' },
		{ option: 'Manga', url: 'https://www.reddit.com/r/manga/search.json?q=flair_name%3A%22DISC%22&restrict_sr=1&sort=new' },
		{ option: 'Memes', url: 'https://www.reddit.com/r/memes.json' },
		{ option: 'Memes', url: 'https://www.reddit.com/r/dankmemes.json' },
		{ option: 'Memes', url: 'https://www.reddit.com/r/ProgrammerHumor.json' }
	];

	if(serverRestarted) {
		for(const source of sources) {
			await checkSource(source.url, source.option);
		}
	}

	serverRestarted = false;
};

const checkSource = async(url, option) => {
	const res = await fetch(url);
	const data = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
	if(!res.ok) console.log(`${option}: ${res.status} - ${data}`);

	switch (res.ok && option) {
		case 'News':
		case 'Deals':
		case 'FreeGames':
		case 'Playstation':
		case 'Nintendo':
		case 'Anime':
		case 'Manga': 
			urls.push(data.data.children[0].data.url);
			break;
		case 'Reviews': {
			const { url } = await checkReviews();
			urls.push(url);
			break;
		}
		case 'Xbox': {
			const $ = cheerio.load(data);
			urls.push($('.archive-main .media .media-body .feed__title a').first().attr('href'));
			break;
		}
		case 'Memes': {
			const sortedMemes = data.data.children.sort((a, b) => b.data.created_utc - a.data.created_utc);

			const index = sortedMemes.findIndex(item => !item.data.stickied && !item.data.is_video && !item.data.removed_by_category);
			if(index === -1) return;

			const url = sortedMemes[index].data.url;

			urls.push(url);
			break;
		}
		default:
			break;
	}
}
