import { Client, QueryResult } from 'pg';
import { PG_CLIENT_CONFIG } from '../shared/variables';

export const DBClient = {
  isConnected: false,

  _client: new Client(PG_CLIENT_CONFIG),

  async connect() {
    if (!this.isConnected) {
      await this._client.connect();
      this.isConnected = true;
    }
  },

  async query(query: string, values: any[]): Promise<QueryResult> {
    if (!this.isConnected) {
      throw 'Database is not connected yet. Please, establish connection before querying data';
    }
    return this._client.query(query, values);
  },

  async end() {
    if (this.isConnected) {
      await this._client.end();
      this.isConnected = false;
    }
  },
};
