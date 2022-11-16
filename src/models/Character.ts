import { addParents } from "@utils/databaseTools";
import { DataTypes, Model } from "sequelize";
import { IEpisode } from "./Episode";
import { ILocation } from "./Location";

interface ICharacterLocation{
  name: string
  url: string
}

export interface ICharacter {
  id: number
  name: string
  type: string
  status: string
  species: string
  gender: string
  image: string
  created: string
  origin?: number
  location?: number
  episodes?: number[]
}

export interface ICharacterSchema {
    id: number
    name: string
    type: string
    status: string
    species: string
    gender: string
    image: string
    created: string
    locationId: number
}

export class Character extends Model<ICharacterSchema> implements ICharacterSchema {
  public id!: number
  public name!: string
  public type!: string
  public status!: string
  public species!: string
  public gender!: string
  public image!: string
  public created!: string
  public locationId!: number
}

export function _Character(sequelize:any, parents?:{one:boolean,instance:any,as:string, foreignKey?:string}[]){
  // tslint:disable:object-literal-sort-keys
  Character.init(
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      species: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    },
    {
      sequelize,
      tableName: "Character",
      createdAt: false,
      updatedAt: false,
    }
  );
  // tslint:enable:object-literal-sort-keys
  if(parents){
    addParents(Character,parents)
  }
  return Character;
}