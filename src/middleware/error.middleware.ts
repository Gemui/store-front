import { Response, Request } from 'express'
import Error from '../interfaces/error.interface'

const errorMiddleware = (
  error: Error,
  _: Request,
  res: Response
  // next: NextFunction
): void => {
  const status = error.status || 500
  const message = error.message || 'Whoops!! something went wrong'
  res.status(status).json({ status, message })
}

export default errorMiddleware
