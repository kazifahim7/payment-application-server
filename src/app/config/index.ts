import dotenv from 'dotenv'
import path from 'path'


dotenv.config({path:path.join(process.cwd(),".env")})


export default {
    node_env: process.env.NODE_ENV,
    dataBase_url: process.env.DATABASE_URL,
    port: process.env.PORT,
    salt_round: process.env.SALT_ROUND,
    jwt_secret: process.env.JWT_SECRET

}

