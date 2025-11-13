import { lesan, MongoClient } from "@deps";
import {
	categories,
	cities,
	city_zones,
	comments,
	events,
	files,
	places,
	provinces,
	tags,
	users,
	virtualTours,
} from "@model";
import { functionsSetup } from "./src/mod.ts";

const MONGO_URI = Deno.env.get("MONGO_URI") || "mongodb://127.0.0.1:27017/";

export const coreApp = lesan();
const client = await new MongoClient(MONGO_URI).connect();
const db = client.db("yademan");
coreApp.odm.setDb(db);

export const user = users();
export const file = files();
export const province = provinces();
export const city = cities();
export const city_zone = city_zones();
export const place = places();
export const comment = comments();
export const tag = tags();
export const category = categories();
export const virtual_tour = virtualTours();
export const event = events();

export const { setAct, setService, getAtcsWithServices } = coreApp.acts;

export const { selectStruct, getSchemas } = coreApp.schemas;

functionsSetup();

coreApp.runServer({
	port: 1405,
	typeGeneration: true,
	playground: true,
	staticPath: ["/uploads"],
	cors: [
		"http://localhost:3000",
		"http://localhost:3005",
		"http://194.5.192.166:3005",
		"http://localhost:4000",
	],
});
