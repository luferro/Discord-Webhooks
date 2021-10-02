import { checkReviews } from './checkReviews.js';
import { checkSource } from './checkSource.js';

let serverRestarted = true;

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

export const checkServer = async () => {
	if(serverRestarted) sources.forEach(item => checkSource(item.url, item.option));
	serverRestarted = false;
};
