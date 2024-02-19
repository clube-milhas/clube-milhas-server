import { HttpStatusCode } from 'axios'
import { Request, Response } from 'express'

import userService from './services'
import { UserToBeCreated } from './interfaces'

const USER_SUCCESSFULLY_CREATED = 'Usuário criado com sucesso.'

const createOne = async (req: Request, res: Response): Promise<Response> => {
  const userToBeCreated: UserToBeCreated = {
    cpf: req.body.cpf,
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  }

  const userId = await userService.createOne(userToBeCreated)

  return res.status(HttpStatusCode.Created).json({ message: USER_SUCCESSFULLY_CREATED, userId })
}

export default { createOne }