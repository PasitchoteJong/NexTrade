import dotenv from "dotenv";
import app from "./app.js";
import shutdown from "./utils/shutdown.util.js";

dotenv.config()


const PORT = process.env.PORT || 8000;

process.on('SIGINT',()=>shutdown('SIGINT')); //Ctrl+C
process.on('SIGTERM',()=>shutdown('SIGTERM')); //kill command or Docker

process.on('uncaughtException',()=>shutdown('uncaughtException'))
process.on('uncaughtRejection',()=>shutdown('uncaughtRejection'))

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
