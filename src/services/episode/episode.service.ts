import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { STATUS } from "@enums/status.enum";
import { InternalServerError } from "@errors/internalServer.error";
import { IEpisode, IEpisodeSchema } from "@models/Episode";
import { IPersistanceService } from "@services/persistance";
import { IPagination } from "@utils/schemas";
import { inject } from "inversify";
import { IEpisodeFilters, IEpisodeService } from ".";

@provide(TYPE.IEpisodeService)
export class EpisodeService implements IEpisodeService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService
    ){}

    async associateEpisodeCharacter(episodeId: number, characterId: number): Promise<{ status: STATUS }> {
        try{
            await this.persistanceService.models.EpisodeCharacter.create({
                characterId,
                episodeId
            })
            return {
                status: STATUS.SUCCESS
            }
        }catch(err: any){
            throw new InternalServerError('Error creating the association')
        }
    }

    async getEpisode(episodeId: number): Promise<IEpisode | undefined> {
        const episode = await this.persistanceService.models.Episode.findOne({
            raw: true,
            where: {
                id: episodeId
            }
        })
        return episode ? await this.transformEpisode(episode) : undefined
    }

    async getEpisodes(episodeIds: number[]): Promise<IEpisode[]> {
        const episodes = await this.persistanceService.models.Episode.findAll({
            raw: true,
            where: {
                id: episodeIds
            }
        })
        return await Promise.all(episodes.map(async e => await this.transformEpisode(e)))
    }

    async getAllEpisodes(filters?:IEpisodeFilters, pagination?: IPagination): Promise<{count: number, result: IEpisode[]}> {
        const episodes = await this.persistanceService.models.Episode.findAndCountAll({
            raw: true,
            ...(filters && {
                where: {
                    ...filters
                }
            }),
            ...(pagination && {
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            })
        });
        return {
            count: episodes.count,
            result: await Promise.all(episodes.rows.map(async e => this.transformEpisode(e)))
        }
    }

    async createEpisode(episode: IEpisodeSchema){
        try{
            episode.created = (new Date()).toISOString()
            const newEpisode = await this.persistanceService.models.Episode.create(episode)
            return {
                id: newEpisode.id
            }
        }catch(err: any){
            throw new InternalServerError('Error creating the entity')
        }
    }

    transformEpisode = async (episode: IEpisodeSchema): Promise<IEpisode> => {
        const characters = await this.persistanceService.models.EpisodeCharacter.findAll({
            raw: true,
            where: {
                episodeId: episode.id
            }
        })
        const episodeResult: IEpisode = {
            air_date: episode.air_date,
            characters: characters.map(c=>c.characterId),
            created: episode.created,
            episode: episode.episode,
            id: episode.id,
            name: episode.name
        }
        return episodeResult
    }

}