import { Buchta } from "buchta";

const app = new Buchta();

app.get("/", (_req, res) => {
    res.send("hi");
});

app.get("/id/:id/", (req, res) => {
    res.send(`${req.params.get("id")} ${req.query.get("name")}`);
    res.setHeader("x-powered-by", "benchmark");
})

app.post("/json/", async (req, res) => {
    res.sendJson(await req.json());
});

app.run();
