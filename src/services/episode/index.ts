import { STATUS } from "@enums/status.enum"
import { IEpisode, IEpisodeSchema } from "@models/Episode"
import { IPagination } from "@utils/schemas"

export interface IEpisodeFilters {
    name?: string
    episode?: string
}

export interface IEpisodeService {
    getAllEpisodes(filters?:IEpisodeFilters, pagination?: IPagination): Promise<{count: number, result: IEpisode[]}>
    getEpisode(episodeId: number): Promise<IEpisode | undefined>
    getEpisodes(episodeIds: number[]): Promise<IEpisode[]>
    createEpisode(episode: IEpisodeSchema): Promise<{id: number}>
    associateEpisodeCharacter(episodeId: number, characterId: number): Promise<{status: STATUS}>
    deleteEpisodes(episodeIds: number[]): Promise<{episodesDeleted: number}>
}