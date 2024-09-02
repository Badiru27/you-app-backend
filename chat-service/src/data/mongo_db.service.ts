import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoService {
  private readonly mongoClient: MongoClient;
  private readonly databaseName = '';

  constructor(private configService: ConfigService) {
    this.databaseName = this.configService.get('DATABASE_NAME');
    this.mongoClient = new MongoClient(this.configService.get('DATABASE_URL'));
    this.mongoClient
      .connect()
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async find(
    collectionName: string,
    query: any,
    limit?: number,
    skip?: number,
    projection?: any,
  ) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    const result =
      limit && skip
        ? await collection
            .find(query)
            .limit(limit)
            .skip(skip)
            .project(projection)
            .toArray()
        : await collection.find(query).project(projection).toArray();

    return result;
  }

  async count(collectionName: string, query: any) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.countDocuments(query);

    return result;
  }

  async create(collectionName: string, data: any) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(data);

    return result;
  }

  async update(collectionName: string, query: any, data: any) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.updateOne(query, { $set: data });

    return result;
  }

  async delete(collectionName: string, query: any) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    const result = await collection.deleteOne(query);

    return result;
  }

  async findOneAndUpdate(
    collectionName: string,
    query: any,
    update: any,
    options: any,
  ) {
    const database = this.mongoClient.db(this.databaseName);
    const collection = database.collection(collectionName);
    return collection.findOneAndUpdate(query, update, options);
  }
}
