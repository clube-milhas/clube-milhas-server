import {createSecretKey} from 'crypto'
import { jwtVerify } from 'jose'
import { NextFunction, Request, Response } from 'express'

import { getEnvironmentVariable } from '../utils/getEnvironmentVariable'
import { UnauthorizedError } from '../errors'

export const verifyAccessToken = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const INVALID_ACCESS_TOKEN = 'Token de acesso inválido.'

  const JWT_SECRET = getEnvironmentVariable('JWT_SECRET')
  const JWT_ISSUER = getEnvironmentVariable('JWT_ISSUER')
  const JWT_AUDIENCE = getEnvironmentVariable('JWT_AUDIENCE')

  const accessToken = req.headers.authorization?.split('Bearer ')[1]

  if (!accessToken) throw new UnauthorizedError(INVALID_ACCESS_TOKEN)

  const secretKey = createSecretKey(JWT_SECRET, 'utf8')

  try {
    const { payload } = await jwtVerify(accessToken, secretKey, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    })

    if (
      !('id' in payload) ||
      (typeof payload.id !== 'string')
    ) throw new UnauthorizedError(INVALID_ACCESS_TOKEN)

    next()
  } catch (error) {
    throw new UnauthorizedError(INVALID_ACCESS_TOKEN)
  }
}
