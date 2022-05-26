const app = require('./app.js');
 // Handling uncaught Exception
 process.on("uncaughtException",(err) =>{
    console.log(`Error : ${err.message}`);
    console.log("shutting server down due to uncaughtException Error");
   
        process.exit(1);
   
});
const PORT = process.env.PORT || 5125;
const server = app.listen(PORT)
 // unhandled promise Rejection
 process.on("unhandledRejection",(err) =>{
    console.log(`Error : ${err.message}`);
    console.log("shutting server down due to unhandledRejection Error");
    server.close(()=>{
        process.exit(1);
    });
});