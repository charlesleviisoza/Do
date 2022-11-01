import { addParents } from "@utils/databaseTools";
import { DataTypes, Model } from "sequelize";

export interface ILocation {
    id: number
    name: string
    type: string
    dimension: string
    created: string
    url?: string
    residents?: string
}

export class Location extends Model<ILocation> implements ILocation {
    public id!: number
    public name!: string
    public type!: string
    public dimension!: string
    public created!: string
  }

  export function _Location(sequelize:any, parents?:{one:boolean,instance:any,as:string}[]): new () => Location{
    // tslint:disable:object-literal-sort-keys
    Location.init(
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
        dimension: {
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
        tableName: "Location",
        createdAt: false,
        updatedAt: false,
      }
    );
    // tslint:enable:object-literal-sort-keys
    if(parents){
      addParents(Location,parents)
    }
    return Location;
  }