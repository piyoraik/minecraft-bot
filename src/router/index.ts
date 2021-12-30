import { Router, Request, Response } from 'express'
import { mcStart, mcStop } from '../service/mcServerOperation'

const indexRouter = Router()

indexRouter.get('/', (req: Request, res: Response) => {
  res.send('Discord Bot')
})

indexRouter.get('/start', async (req: Request, res: Response) => {
  res.send('Minecraft Server Start')
  await mcStart()
})

indexRouter.get('/kill', async (req: Request, res: Response) => {
  res.send('Minecraft Server Stop')
  await mcStop()
})

export = indexRouter
