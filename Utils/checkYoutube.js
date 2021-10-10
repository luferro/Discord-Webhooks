import fetch from 'node-fetch';

const videos = [];

const fixYoutubeURL = (url) => {
    if(url.includes('embed')) return url.split('/')[4];
    return url.split('/')[3];
} 

const getChannelID = async(url) => {
    const newURL = fixYoutubeURL(url);
    const videoID = newURL.match(/([A-z0-9_.\-~]{11})/g);

    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoID[0]}&key=${process.env.YOUTUBE_API_KEY}`);
    const data = await res.json();

    return data.items[0].snippet.channelId;
}

export const getVideoID = url => {
    const newURL = fixYoutubeURL(url);
    const videoID = newURL.match(/([A-z0-9_.\-~]{11})/g);

    return videoID[0];
}

export const checkSubscribers = async(channel, type, url) => {
    const filteredVideos = videos.filter(item => item.url === url);
    if(filteredVideos.length > 0) return -1;
    
    const option = type === 'channel' || type === 'custom' ? 'id' : 'forUsername';
    const channelID = type === 'custom' ? await getChannelID(url) : channel;

    const res = await fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=statistics&${option}=${channelID}&key=${process.env.YOUTUBE_API_KEY}`);
    const data = await res.json();

    const subscriberCount = data.items && data.items.length > 0 ? parseInt(data.items[0].statistics.subscriberCount) : 0;
    const subscribers = !isNaN(subscriberCount) ? subscriberCount : 0;
    videos.push({ url, subscribers });

    return subscribers;
}