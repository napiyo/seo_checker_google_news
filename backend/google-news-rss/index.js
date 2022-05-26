const axios = require('axios');
const getLocalCodes = require('./utils/getLocaleCodes');
const parseResults = require('./utils/parseResults');


async function search({
    domain,
    country,
    language,
    cc = 'us',
    lc = 'en',
} = {}) {
    const localeCodes = getLocalCodes({ country, language, cc, lc });
    const response = await axios.get(
        `https://news.google.com/rss/search?q=${domain}&hl=${localeCodes.lc}&gl=${localeCodes.cc}&ceid=${localeCodes.lc}:${localeCodes.cc}`,
        // {
        //     params: {
        //         p:domain,
        //         hl: localeCodes.lc,
        //         gl: localeCodes.cc,
        //         ceid: `${localeCodes.lc}:${localeCodes.cc}`,
        //     }
        // }
    );
   
    
    return parseResults(response.data,domain);
};
module.exports = search;
