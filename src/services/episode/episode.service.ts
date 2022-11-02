import { IEnvironmentService } from "@config/env";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { STATUS } from "@enums/status.enum";
import { InternalServerError } from "@errors/internalServer.error";
import { IEpisode, IEpisodeSchema } from "@models/Episode";
import { IPersistanceService } from "@services/persistance";
import { inject } from "inversify";
import { IEpisodeService } from ".";

@provide(TYPE.IEpisodeService)
export class EpisodeService implements IEpisodeService{

    constructor(
        @inject(TYPE.IPersistanceService) private persistanceService: IPersistanceService,
        @inject(TYPE.IEnvironmentService) private environmentService: IEnvironmentService
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

    async getAllEpisodes(): Promise<IEpisode[]> {
        const episodes = await this.persistanceService.models.Episode.findAll({
            raw: true
        });
        return await Promise.all(episodes.map(async e => await this.transformEpisode(e)))
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
            include:{
                as: 'character',
                attributes: ['id'],
                model: this.persistanceService.models.Character
            },
            raw: true,
            where: {
                episodeId: episode.id
            }
        })
        const episodeResult: IEpisode = {
            air_date: episode.air_date,
            characters: characters.map(c=>`${this.environmentService.getVariables().hostname}/character/${(c as any)['character.id']}`),
            created: episode.created,
            episode: episode.episode,
            id: episode.id,
            name: episode.name,
            url: `${this.environmentService.getVariables().hostname}/episode/${episode.id}`
        }
        return episodeResult
    }

}