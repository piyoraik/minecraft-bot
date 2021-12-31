import { ec2Status } from '../lib/ec2StatusOperation'
import { ssmCommandOperation } from '../lib/ssmCommandOperation'
import { setTimeout } from 'timers/promises'

export const mcStart = async () => {
  try {
    const ec2Res = await ec2Status('START')
    if (ec2Res === 0) throw Error('EC2: StartUp Error')
    return 'EC2: StartUp Success'
  } catch (err: unknown) {
    if (err instanceof Error) {
      return err.message
    } else {
      return 'Unexpected Error'
    }
  }
}

export const mcStop = async () => {
  try {
    const commandRes = await ssmCommandOperation(process.env.STOP_COMMAND!)
    await setTimeout(60000)
    if (commandRes.status === 0) throw Error(commandRes.content)
    const ec2Res = await ec2Status('STOP')
    if (ec2Res === 0) throw Error('EC2: Shutdown Error')
    return commandRes.content
  } catch (err: unknown) {
    if (err instanceof Error) {
      return err.message
    } else {
      return 'Unexpected Error'
    }
  }
}

export const mcBackup = async () => {
  try {
    const commandRes = await ssmCommandOperation(
      'sh /etc/minecraft_server/backup'
    )
    await setTimeout(50000)
    if (commandRes.status === 0) throw Error(commandRes.content)
    return commandRes.content
  } catch (err) {
    if (err instanceof Error) {
      return err.message
    } else {
      return 'Unexpected Error'
    }
  }
}
