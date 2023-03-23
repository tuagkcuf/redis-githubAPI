import express from "express"
import fetch from "node-fetch"
import redis from "redis"

const PORT = process.env.PORT || 5000
const REDIS_PORT = process.env.REDIS_PORT || 6379

const client = redis.createClient(REDIS_PORT)

const app = express()

function setResponse(username, repos) {
    return `<h2>${username} has ${repos} Github repos</h2>`
}

async function getRepos(req, res, next) {
    try {
        console.log("fetching data...")
        const { username } = req.params
        const response = await fetch(`https://api.github.com/users/${username}`)
        const data = await response.json()
        const repos = data.public_repos

        client.setEx(username, 3600, repos)

        res.send(setResponse(username, repos))
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

function cache(req, res, next) {
    const { username } = req.params

    client.get(username, (error, data) => {
        if (error) throw error

        if (!data) {
            res.send(setResponse(username, data))
        } else {
            next()
        }
    })
}

app.get('/repos/:username', cache, getRepos) 

app.listen(PORT, () => console.log(`App listening on port: ${PORT}`))
