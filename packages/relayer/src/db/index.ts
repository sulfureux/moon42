import { MongoClient } from "mongodb";
import { MONGODB_URL } from "../config";

export const client = new MongoClient(MONGODB_URL);
