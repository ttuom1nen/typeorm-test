import * as express from "express";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

// create and setup express app
const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));

// register routes
app.get("/users", async function (req: Request, res: Response) {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
});

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(User).findOneBy({
    id: parseInt(req.params.id),
  });

  return res.send(results);
});

app.post("/users", async function (req: Request, res: Response) {
  const user = await AppDataSource.getRepository(User).create(req.body);
  const results = await AppDataSource.getRepository(User).save(user);

  return res.send(results);
});

app.put("/users/:id", async function (req: Request, res: Response) {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(User).merge(user, req.body);
  const results = await AppDataSource.getRepository(User).save(user);

  return res.send(results);
});

app.delete("/users/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(User).delete(req.params.id);

  return res.send(results);
});

// start express server
app.listen(3000);
