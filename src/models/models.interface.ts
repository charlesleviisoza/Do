import { Model } from "sequelize";
import { Character } from "./Character";
import { Episode } from "./Episode";
import { EpisodeCharacter } from "./EpisodeCharacter";
import { Location } from "./Location";

export interface IModels {
    Location: typeof Location,
    Character: typeof Character,
    Episode: typeof Episode,
    EpisodeCharacter: typeof EpisodeCharacter
}