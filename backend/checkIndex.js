const ErrorHandler = require('./utils/errorHandler')
const googleNews = require('./google-news-rss/index')
const catchAsyncError = require('./middlewares/catchAsyncError');
exports.checkIndex = catchAsyncError(async(req,res,next)=>{

  
    
    const {domain} = req.query;
    
    if(!domain){
        return next(new ErrorHandler("domain can not be empty",404))
    }
    const indexed = await googleNews(req.query);
        
    res.status(200).json({
        success:true,
        domain,
        indexed
    })
})