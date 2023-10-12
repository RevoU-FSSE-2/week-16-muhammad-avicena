import { MongoClient } from "mongodb";

const connectToDb = async () => {
  try {
    const client = await new MongoClient(process.env.DB_DEV as any).connect();
    const db = client.db(process.env.DB_NAME);
    return db;
  } catch (error) {
    console.log(error);
  }
};

export default connectToDb;
