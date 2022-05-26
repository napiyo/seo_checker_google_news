const cheerio = require('cheerio');

module.exports = function parseResults(results,domain) {
   
    const $ = cheerio.load(results, { xmlMode: true });
    let trimmedDomain = trimDomain(domain);
    let articles = $('item');
    for(let i=0;i<articles.length;i++){

        let sourceUrl = $(articles[i]).find('source').attr('url');
        sourceUrl = trimDomain(sourceUrl);
        if(sourceUrl === trimmedDomain){
         
            return true;
        }
        
    }
    return false;
};
function trimDomain(domain){
   
    let domaintrimed = domain.trim();
    if(domaintrimed.endsWith('/')){
        domaintrimed = domaintrimed.slice(0,-1);
    }
    if(domaintrimed.startsWith("https://")){
        domaintrimed=domaintrimed.slice(8)
    }
    if(domaintrimed.startsWith("http://")){
        domaintrimed=domaintrimed.slice(7)
    }
    if(domaintrimed.startsWith("www.")){
        domaintrimed = domaintrimed.slice(4)
    }
    

    return domaintrimed;
}