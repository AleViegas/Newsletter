import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import SurveyUserRepository from "../repositories/surveyUserRepository";

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params
        // recebe uma survey
        const surveysUsersRepository = getCustomRepository(SurveyUserRepository)

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()),
        })

        const detractors = surveysUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6 
        ).length;

        const passive = surveysUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8 
        ).length;
    
        const promoters = surveysUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10 
        ).length;

        const totalAnswers = surveysUsers.length
        // pega todas as notas - dentro de array depois .length

        const nps = Number(
            ( ( (promoters - detractors) / totalAnswers ) * 100 ).toFixed(2)
        )
        // calculo

        return response.json({
            detractors,
            passive,
            promoters,
            totalAnswers,
            nps
        })
        // retorna resposta
    }
}

export default NpsController