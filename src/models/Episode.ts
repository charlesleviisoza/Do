import { addParents } from "@utils/databaseTools";
import { DataTypes, Model } from "sequelize";

export interface IEpisode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

export interface IEpisodeSchema {
    id: number
    name: string
    air_date: string
    episode: string
    created: string
}

export class Episode extends Model<IEpisodeSchema> implements IEpisodeSchema {
  public id!: number
  public name!: string
  public air_date!: string
  public episode!: string
  public created!: string
}

export function _Episode(sequelize:any, parents?:{one:boolean,instance:any,as:string}[]){
  // tslint:disable:object-literal-sort-keys
  Episode.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      air_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      episode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "Episode",
      createdAt: false,
      updatedAt: false,
    }
  );
  // tslint:enable:object-literal-sort-keys
  if(parents){
    addParents(Episode,parents)
  }
  return Episode;
}