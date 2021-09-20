import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../erros/appError"
import SurveyUserRepository from "../repositories/surveyUserRepository";


class AnswerController {
    async execute(request: Request, response: Response) {
        const { value } = request.params
        const { u } = request.query;
        // receber os dados pela rota

        const surveysUsersRepository = await getCustomRepository(SurveyUserRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        })
        // procura da survey user

        if (!surveyUser) {
            throw new AppError("Survey User does not exist!")
            }
        
        // verificar os dados, tratamento de erros / links fakes
        
        surveyUser.value = Number(value)
        // alterar a survey colocando a nota

        surveysUsersRepository.save(surveyUser)
        // chamar o banco de dados

        return response.json(surveyUser)
        // retornar uma pag de resposta salva/json

    }
}

export default AnswerController