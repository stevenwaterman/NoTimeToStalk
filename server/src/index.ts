import express, { Request, Response } from "express";
import * as process from "process";
import * as mysql from "mysql";
import { MysqlError } from "mysql";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

export type ENV = {
  SERVER_PORT: number;
  DB_URL: string;
  DB_PASS: string;
  ADMIN_PASS: string;
}

type ExploreCharacters = "red" | "yellow" | "pink" | "green" | "blue" | "black" | "host" | "dog";
type Locations = "kitchen" | "dining" | "atrium" | "porch" | "garden" | "study" | "lounge" | "landing" | "bathroom" | "masterBedroom" | "secondBedroom" | "secretPassage" | "balcony";
type Weapon = "nothing" | "knife" | "herbs" | "candlestick" | "letterOpener" | "ratPoison" | "spade" | "poison" | "sword" | "doll" | "drugs" | "scythe" | "umbrella" | "dogTreat" | "lute";
type Buffs = {
  wet: boolean;
  injured: boolean;
  muddy: boolean;
  pretty: boolean;
  painty: boolean;
}

type CharacterTimelineStep = {
  location: Locations;
  action: string;
  weapon: Weapon;
  buffs: Buffs;
  suspicious: boolean;
}
type CharacterTimeline = Record<number, CharacterTimelineStep>;

type FetchedState = {
  character: ExploreCharacters;
  backstories: Partial<Record<ExploreCharacters, number>>;
  alibis: Partial<Record<ExploreCharacters, string>>;
  timeline: Partial<Record<ExploreCharacters, CharacterTimeline>>;
}

type GameTableRow = {
  id: string;
  exploreCharacter: ExploreCharacters;
  playerName: string;
  backstory: 1 | 2 | 3;
  alibi: string;
  accused: ExploreCharacters;
  accusedReason: string;
  timeline: string;
  killerId: string | null;
  created: Date;
}

async function start() {
  const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_URL,
    user: "root",
    password: process.env.MYSQL_ROOT_PASSWORD,
  });

  async function query(query: string, args: any[] = []): Promise<any> {
    return new Promise<{ error: null, results: any } | { error: MysqlError }>((success, failure) => {
      db.query(query, args, (error, results) => {
        if (error) failure(error)
        else success(results)
      });
    })
  }

  await bootstrapDatabase(query);

  const app = express();
  app.use(express.json())
  app.use(cors())

  const portString = process.env.SERVER_PORT;
  if (portString === undefined) throw new Error("Port missing");
  const port = parseInt(portString);

  app.listen(port, () => {
    console.log("Started server");
  });

  let nextId: string = uuidv4();

  app.get("/nextId", async (req: Request, res: Response<string>) => {
    if (req.query.pass !== process.env.ADMIN_PASS) {
      res.sendStatus(403);
    }

    res.status(200);
    res.send(nextId);
  });

  app.get("/game", async (req: Request, res: Response<FetchedState>) => {
    if (req.query.id !== nextId) {
      res.sendStatus(403);
    }

    query(`SELECT * FROM players WHERE killerId IS NULL`)
      .then((results: GameTableRow[]) => {
        const exploreCharacters: ExploreCharacters[] = [
          "host",
          "dog",
          "red",
          "yellow",
          "pink",
          "green",
          "blue",
          "black"
        ];

        const existingCharacters = results.map(row => row.exploreCharacter);
        const remainingCharacter = exploreCharacters.filter(character => !existingCharacters.includes(character))[0];

        const output: FetchedState = {
          character: remainingCharacter,
          backstories: {},
          timeline: {},
          alibis: {}
        }

        results.forEach(row => {
          output.backstories[row.exploreCharacter] = row.backstory;
          output.timeline[row.exploreCharacter] = JSON.parse(row.timeline);
          output.alibis[row.exploreCharacter] = row.alibi;
        })

        res.status(200);
        res.send(output);
      })
  });

  app.get("/alive", async (req: Request, res: Response<{
    name: string;
    killed?: {
      time: Date;
      character: ExploreCharacters;
      reason: string;
      name: string;
    }
  }>) => {
    const me = await query(`SELECT * FROM players WHERE id = ?`, [req.query.id]).then((results: GameTableRow[]) => {
      if (!results.length) return undefined;
      return results[0];
    });

    if (me === undefined) {
      res.sendStatus(404);
    } else if (me.killerId === null) {
      res.status(200);
      res.send({ name: me.playerName })
    } else {
      const killer = await query(`SELECT * FROM players WHERE id = ?`, [me.killerId])
        .then((results: GameTableRow[]) => results[0]);
      res.status(200);
      res.send({
        name: me.playerName,
        killed: {
          time: killer.created,
          character: killer.exploreCharacter,
          reason: killer.accusedReason,
          name: killer.playerName
        }
      })
    }
  });

  app.post("/game", async (req: Request, res) => {
    const { password, name, character, backstory, alibi, accused, accusedReason, timeline }: {
      password: string;
      name: string;
      character: ExploreCharacters;
      backstory: 1 | 2 | 3;
      alibi: string;
      accused: ExploreCharacters;
      accusedReason: string;
      timeline: CharacterTimeline
    } = req.body;

    if (password !== nextId) {
      res.sendStatus(403);
      return;
    }

    nextId = uuidv4();

    console.log("update query running");
    await query(`UPDATE players SET killerId = ? WHERE exploreCharacter = ? AND killerId IS NULL;`, [password, accused]);

    console.log("insert query running");
    await query(
      `INSERT INTO players (id, exploreCharacter, playerName, backstory, alibi, accused, accusedReason, timeline) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [password, character, name, backstory, alibi, accused, accusedReason, JSON.stringify(timeline)]);
    console.log("query complete")

    res.sendStatus(200);
  });
}

async function bootstrapDatabase(query: (query: string, args?: any[]) => Promise<any>) {
  await query(`CREATE DATABASE IF NOT EXISTS game;`)

  await query(`USE game;`)

  await query(`
      CREATE TABLE IF NOT EXISTS players (
        id VARCHAR(255) NOT NULL PRIMARY KEY,
        exploreCharacter VARCHAR(255) NOT NULL,
        playerName VARCHAR(255) NOT NULL,
        backstory INT NOT NULL,
        alibi TEXT NOT NULL,
        accused VARCHAR(255) NOT NULL,
        accusedReason TEXT NOT NULL,
        timeline MEDIUMTEXT NOT NULL,
        killerId VARCHAR(255) NULL,
        created timestamp default now()
      );
    `)
}

start();
