import { addParents } from "@utils/databaseTools";
import { DataTypes, Model } from "sequelize";

export interface IEpisodeCharacterSchema {
    episodeId: number
    characterId: number
}

export class EpisodeCharacter extends Model<IEpisodeCharacterSchema> implements IEpisodeCharacterSchema {
  public episodeId!: number
  public characterId!: number
}

export function _EpisodeCharacter(sequelize:any, parents?:{one:boolean,instance:any,as:string,foreignKey:string}[]){
  // tslint:disable:object-literal-sort-keys
  EpisodeCharacter.init(
    {
      episodeId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      characterId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
    },
    {
      sequelize,
      tableName: "EpisodeCharacter",
      createdAt: false,
      updatedAt: false,
    }
  );
  // tslint:enable:object-literal-sort-keys
  if(parents){
    addParents(EpisodeCharacter,parents)
  }
  return EpisodeCharacter;
}