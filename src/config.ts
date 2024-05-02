import dotenv from "dotenv"

dotenv.config()

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost"
const SERVER_PORT = process.env.SERVER_PORT || 1337

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
}

const MYSQL_HOST = process.env.MYSQL_HOST || "localhost"
const MYSQL_DATABASE = process.env.DATABASE || "pizza-api"
const MYSQL_USER = process.env.MYSQL_USER || "root"
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || "root"

const MYSQL = {
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD
}

const config = {
    server: SERVER,
    mysql: MYSQL
}

export default config