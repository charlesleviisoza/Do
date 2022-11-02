import { Model } from "sequelize";
import { Character } from "./Character";
import { Location } from "./Location";

export interface IModels {
    Location: typeof Location,
    Character: typeof Character
}