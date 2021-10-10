import { WebhookClient, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { urls } from '../server.js';
import { checkSize } from '../Utils/checkSize.js';

const webhook = new WebhookClient(
	process.env.WEBHOOK_MEMES_ID,
	process.env.WEBHOOK_MEMES_TOKEN
);

export const getMemes = async () => {    
    const subreddits = ['memes', 'dankmemes', 'ProgrammerHumor'];

    for(const subreddit of subreddits) {
        const random = Math.floor(Math.random() * 16777215).toString(16);

        const res = await fetch(`https://www.reddit.com/r/${subreddit}.json`);
        const memes = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
        if(!res.ok) {
            console.log(`getMemes: got a status code of ${res.status} - ${res.statusText}`);
            continue;
        }

        if(memes.data.children.length === 0) continue;

        const sortedMemes = memes.data.children.sort((a, b) => b.data.created_utc - a.data.created_utc);

        const index = sortedMemes.findIndex(item => !item.data.stickied && !item.data.is_video && !item.data.removed_by_category);
        if(index === -1) continue;

        const title = sortedMemes[index].data.title.slice(0, 256);
        const url = sortedMemes[index].data.url;
        const permalink = sortedMemes[index].data.permalink;

        if(urls.includes(url)) continue;

        const resourceSizeMB = await checkSize(url);
        if(resourceSizeMB >= 50) continue;

        if(url.includes('gif') || url.includes('gifv') || url.includes('mp4')) {
            webhook.send(`**[${title}](<https://www.reddit.com${permalink}>)**\n${url}`);
        }
        else {
            webhook.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(title)
                        .setURL(`https://www.reddit.com${permalink}`)
                        .setImage(url)
                        .setColor(random)
                ]
            });
        }

        urls.push(url);
    }
};
