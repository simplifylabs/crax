import { LocalStorage, LowSync } from "lowdb";

interface Data {
  locks: {
    [key: string]: Lock;
  };
}

export interface Lock {
  id: string;
  name: string;
  digits: number;
  codes: string[];
}

const defaultData: Data = {
  locks: {},
};

export default function read() {
  const adapter = new LocalStorage<Data>("crax");
  const db = new LowSync<Data>(adapter, defaultData);

  db.read();
  return db;
}
