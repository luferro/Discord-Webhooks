import fetch from 'node-fetch';

const searchOpencritic = async(game) => {
    const res = await fetch(`https://api.opencritic.com/api/meta/search?criteria=${game}`);
    const data = await res.json();

    return { id: data[0].id, url: `https://opencritic.com/game/${data[0].id}/${game}` };
}

export const checkReviews = async() => {
    const res = await fetch('https://www.reddit.com/r/Games/search.json?q=flair_name%3A%22Review%20Thread%22&restrict_sr=1&sort=new');
    const games = res.headers.get('Content-Type')?.includes('application/json') ? await res.json() : await res.text();
    if(!res.ok) {
        console.log(`checkReviews ${res.status} - ${res.statusText}`);
        return { id: null, url: null };
    }

    if(games.data.children.length === 0) return { id: null, url: null };;

    const selftext = games.data.children[0]?.data.selftext.split('\n');
    const opencritic = selftext?.find(item => item.includes('https://opencritic.com/game/'));

    if(!opencritic) {
        const metacritic = selftext?.find(item => item.includes('https://www.metacritic.com/game/'));
        if(!metacritic) return { id: null, url: null };

        const game = metacritic.split('/')[5];
        const { id, url } = await searchOpencritic(game);

        return { id, url };
    }

    const url = opencritic.match(/(?<=\()(.*)(?=\))/g);
    const id = url[0].match(/\d+/g);

    return { id: id[0], url: url[0] };
}