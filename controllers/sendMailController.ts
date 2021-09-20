import { Request, Response } from "express";
import { getCustomRepository, SimpleConsoleLogger } from "typeorm";
import { resolve } from "path"
import { AppError } from "../erros/appError"

import SurveyRepository from "../repositories/surveyRepository";
import SurveyUserRepository from "../repositories/surveyUserRepository";
import UserRepository from "../repositories/userRepository";

import SendMailService from "../services/sendMailService";
import sendMailService from "../services/sendMailService";



class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)

        const user = await userRepository.findOne({email})
        const survey = await surveyRepository.findOne({id: survey_id})
        const surveyUserAlreadyExists = await surveyUserRepository.findOne({
            where: { user_id: user.id, value: null },
            relations: ["user", "survey"]
        })

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")
        // o que vai ser enviado - html

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (!user) {
            throw new AppError("User does not exist!")
            }
        

        if (!survey) {
            throw new AppError("Survey does not exist!")
        }

        if (surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await sendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        // foi verificado todos os dados requisitados

        const surveyUser = await surveyUserRepository.create({
            user_id: user.id,
            survey_id,
        })
        
        await surveyUserRepository.save(surveyUser)
        // foi salvo os dados na tabela
        variables.id = surveyUser.id
        

        await SendMailService.execute(email, survey.title, variables, npsPath)
        // enviar os emails
        
        return response.json(surveyUser)
    }
    async executeAll(request: Request, response: Response) {
        const { survey_id } = request.body

        const userRepository = getCustomRepository(UserRepository)
        const surveyRepository = getCustomRepository(SurveyRepository)
        const surveyUserRepository = getCustomRepository(SurveyUserRepository)
        
        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")
        // o que vai ser enviado - html

        const survey = await surveyRepository.findOne( survey_id )
        
        if (!survey) {
                throw new AppError("Survey does not exist!")
            }
        
        const allUsers = await userRepository.find() 

        // console.log qnts pessoas faltam responder ,length

        allUsers.map(async (user) => {
            const { name, email } = user
            // dos 3 casos de usuarios temos: usuario sem cadastro, usuario com resposta e sem resposta
            // dois casos tem resultado o outro nao


           // primeira opção, fazer nada e ver o que da, essa vai dar ruim
           // segunda opção, surveyUserAlreadyExist sem value e depois filtrar dentro do map com if value === <<<<<<<<<<<<<
           // const surveysUsersAlreadyExist, if (surveysUsersAlreadyExist.value === null) : padrao ? return

           const surveyUserAlreadyExists = await surveyUserRepository.findOne({
           where: {user_id: user.id, survey_id, value: null}
})


        const variables = {
                name,
                title: survey.title,
                description: survey.description,
                id: "", // esse é o surveyUser
                link: process.env.URL_MAIL
          }

           if (surveyUserAlreadyExists) {
               if (surveyUserAlreadyExists.value === null) {
                   variables.id = surveyUserAlreadyExists.id
                   await sendMailService.execute(email, survey.title, variables, npsPath) // padrao
                   return
               }
               else {
                   return 
               } 
            return
}

            const surveyUser = surveyUserRepository.create({
                user_id: user.id,
                survey_id,
            })

            await surveyUserRepository.save(surveyUser)
            // foi salvo os dados na tabela

            variables.id = surveyUser.id
            console.log("survey abaixo")
            console.log(surveyUser)

            await SendMailService.execute(email, survey.title, variables, npsPath)
            // enviar os emails

        })
        
        // foi verificado todos os dados requisitados

        console.log("n")
        console.log()

        return response.json(allUsers)
    }
}

export default SendMailController