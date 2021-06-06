import fetch from 'node-fetch';

export const checkSize = async(resource) => {
    try {
        const res = await fetch(resource);
        const bytes = res.headers.get('content-length')
        const megabytes = (bytes / (1024 * 1024)).toFixed(2);

        return parseFloat(megabytes);
    } catch (error) {
        console.log(error);
    }
}