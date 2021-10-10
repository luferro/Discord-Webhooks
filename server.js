import 'dotenv/config';
import { getReviews } from './Webhooks/reviews.js';
import { getDeals } from './Webhooks/deals.js';
import { getFreeGames } from './Webhooks/freegames.js';
import { getNews } from './Webhooks/news.js';
import { getXbox } from './Webhooks/xbox.js';
import { getPlaystation } from './Webhooks/playstation.js';
import { getNintendo } from './Webhooks/nintendo.js';
import { getAnime } from './Webhooks/anime.js';
import { getManga } from './Webhooks/manga.js';
import { getMemes } from './Webhooks/memes.js';
import { checkServer } from './Utils/checkServer.js';

export const urls = [];

setInterval(async() => { 
	await checkServer().catch(console.log);
}, 1000 * 60);
	
setInterval(async() => {
	try {
		await getNews();
		await getDeals();
		await getReviews();
		await getFreeGames();
		await getXbox();
		await getPlaystation();
		await getNintendo();
		await getAnime();
		await getManga();
		await getMemes();
	} catch (error) {
		console.log(error);
	}
}, 1000 * 60 * 5);