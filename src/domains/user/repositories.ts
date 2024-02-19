import prismaClient from '../../database/connection'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { User } from '@prisma/client'

import { BadRequestError, DatabaseError } from '../../errors'
import { status } from '../../enums/statusEnum'
import { UserLoggedIn, UserToBeCreated } from './interfaces'

const createOne = async (userToBeCreated: UserToBeCreated): Promise<Pick<User, 'id'>> => {
  try {
    const user = await prismaClient.user.create({
      data: { ...userToBeCreated, statusId: status.ACTIVE },
      select: {
        id: true,
      }
    })
  
    return user
  } catch (error) {
    if (
      (error instanceof PrismaClientKnownRequestError) &&
      (error.code === 'P2002')
    ) throw new BadRequestError('CPF ou e-mail já cadastrado.')

    throw new DatabaseError(error)
  }

}

const findOneByCpf = async (cpf: string): Promise<UserLoggedIn | null> => {
  const user = await prismaClient.user.findUnique({
    where: { cpf, statusId: status.ACTIVE },
    select: {
      id: true,
      name: true,
      password: true,
      roleId: true
    }
  })

  return user
}

export default { createOne, findOneByCpf }
