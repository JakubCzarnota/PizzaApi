import express from 'express'
import config from './config.js'

const app = express()

app.listen(config.server.port, () => {
    console.log(`Listening on port ${config.server.port}`);
})
