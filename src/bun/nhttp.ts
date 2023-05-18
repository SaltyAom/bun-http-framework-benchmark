import { nhttp } from 'nhttp-land'

const app = nhttp()

app.get("/", () => "Hi")

app.post("/json", (rev) => rev.body)

app.get("/id/:id", (rev) => {
  rev.response.setHeader("x-powered-by", "benchmark");

  return `${rev.params.id} ${rev.query.name}`
})

app.listen(3000)
