import express from "express"

const PORT = process.env.PORT || 5000

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
        res.send(setResponse(username, repos))
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

app.get('/repos/:username', getRepos) 

app.listen(PORT, () => `App listening on port: ${PORT}`)
