import fetch from 'node-fetch';

export const checkOpencritic = async() => {
    try {
        const res = await fetch('https://www.reddit.com/r/Games/search.json?q=flair_name%3A%22Review%20Thread%22&restrict_sr=1&sort=new');
        const game = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
        if(!res.ok) return console.log(`${res.status} - ${review}`);

        const selftext = game.data.children[0].data.selftext.split('\n');
        const opencritic = selftext.find(item => item.includes('https://opencritic.com/game/'));
        const opencritic_url = opencritic.match(/(?<=\()(.*)(?=\))/g);
        const game_id = opencritic_url[0].match(/\d+/g);

        return { opencritic_id: game_id[0], opencritic_url: opencritic_url[0] }
    } catch (error) {
        console.log(error);
    }
}