import { Server } from "hyper-express"
const app = new Server()

app.get("/", (req, res) => {
	res.send("Hi")
})

app.get("/id/:id", (req, res) => {
    res.header("x-powered-by", "benchmark")

	res.send(`${req.path_parameters.id} ${req.query_parameters.name}`)
})

app.post("/json", async (req, res) => {
    res.type('json')
	res.send(JSON.stringify(await req.json()))
})

app.listen(8080)
