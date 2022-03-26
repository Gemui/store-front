import express, { Request, Response } from 'express'
import errorMiddleware from './middleware/error.middleware'
import routes from './routes/index'
const app: express.Application = express()
const address: string = "0.0.0.0:3000"

app.use(express.json())
 


app.use('/api', routes)


app.get('/', function (_: Request, res: Response) {
    res.json({'status' : 'success'});
})





app.use(errorMiddleware)


app.use((_: Request, res: Response) => {
    res.status(404).json({
      message:
        'Ohh you are lost, read the API documentation to find your way back home 😂',
    })
  })

  
app.listen(3000, function () {
    console.log(`starting app on: ${address}`)
})