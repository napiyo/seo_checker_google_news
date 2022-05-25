const ErrorHandler = require('./utils/errorHandler')
const googleNews = require('google-news-rss')
const catchAsyncError = require('./middlewares/catchAsyncError');
exports.checkIndex = catchAsyncError(async(req,res,next)=>{

  
    
    const domain = req.params.domain;
    if(!domain){
        return next(new ErrorHandler("domain can not be empty",404))
    }
    const articles = await googleNews.search({ q: domain });
        let indexed = false;
    if(articles[0]){
         indexed = articles[0].source.url.toLowerCase().includes(domain.toLowerCase());
        }
        
    res.status(200).json({
        success:true,
        domain,
        indexed
    })
})