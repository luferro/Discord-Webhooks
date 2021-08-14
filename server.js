import 'dotenv/config.js';
import verifyServer from './verifyServer.js';
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

export const urls = [];

setInterval(() => {
	verifyServer();
}, 1000 * 60);

setInterval(() => {
	getNews();
	getDeals();
	getReviews();
	getFreeGames();
	getXbox();
	getPlaystation();
	getNintendo();
	getAnime();
	getManga();
	getMemes();
}, 1000 * 60 * 5);