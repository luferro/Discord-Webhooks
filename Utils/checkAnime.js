import fetch from 'node-fetch';

export const checkAnime = async(id) => {
    if(!id) return { episodesCount: 'N/A', score: 'N/A', image: 'N/A' }

    try {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id}`);
        const data = await res.json();

        const lastDotImage = data.image_url.lastIndexOf('.');
        const image = `${data.image_url.substring(0, lastDotImage)}l.${data.image_url.substring(lastDotImage + 1)}`

        return { episodesCount: data.episodes, score: data.score, image } 
    } catch (error) {
        console.error(error);
    }
}