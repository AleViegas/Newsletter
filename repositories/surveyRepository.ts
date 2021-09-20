import { EntityRepository, Repository } from "typeorm";
import Survey from "../models/survey";

@EntityRepository(Survey)
class SurveyRepository extends Repository<Survey> {
// aqui da para colocar funções personalizadas referente ao banco de dados
}

export default SurveyRepository