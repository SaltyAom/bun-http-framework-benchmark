import { nhttp } from 'nhttp-land'

const app = nhttp({
    flash: true
});

app.get("/", (rev) => "Hi")

app.get("/json", (rev) => rev.body)

app.get("/id/:id", (rev) => {
  rev.setHeader("x-powered-by", "benchmark");

  return `${rev.params.id} ${rev.query.name}`
});

app.listen(3000)