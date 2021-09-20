import { Router } from 'express'
import SurveyController from './controllers/surveyController';
import UserController from "./controllers/userController"
import SendMailController from "./controllers/sendMailController"
import AnswerController from './controllers/answerController';
import NpsController from './controllers/npsController';

const router = Router()

const userController = new UserController();
const surveyController = new SurveyController();
const sendMailController = new SendMailController()
const answerController = new AnswerController()
const npsController = new NpsController()

router.post("/users", userController.create)

router.post("/surveys", surveyController.create)
router.get("/surveys", surveyController.show)

router.post("/sendMail", sendMailController.execute)
router.post("/sendAllMail", sendMailController.executeAll)

router.get("/answers/:value", answerController.execute)

router.get("/nps/:survey_id", npsController.execute)

export default router