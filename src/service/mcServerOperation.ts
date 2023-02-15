import { ec2Status } from '../lib/ec2StatusOperation'
import { ssmCommandOperation } from '../lib/ssmCommandOperation'
import { setTimeout } from 'timers/promises'

export const mcStart = async () => {
  const ec2Res = await ec2Status('START')
  if (ec2Res === 0) throw Error('EC2: StartUp Error')
  const commandRes = await ssmCommandOperation(
    'systemctl status minecraft.service'
  )
  await setTimeout(10000)
  return commandRes
}

export const mcStop = async () => {
  const commandRes = await ssmCommandOperation(
    'systemctl stop minecraft.service'
  )
  await setTimeout(60000)
  const systemctlCommandRes = await ssmCommandOperation(
    'systemctl status minecraft.service'
  )
  await setTimeout(3000)
  if (commandRes.status === 0) throw Error(commandRes.output)
  const ec2Res = await ec2Status('STOP')
  if (ec2Res === 0) throw Error('EC2: Shutdown Error')
  return systemctlCommandRes.output
}

export const mcRestart = async () => {
  await ssmCommandOperation('systemctl restart minecraft.service')
  await setTimeout(30000)
  const statusCommandRes = await ssmCommandOperation(
    'systemctl status minecraft.service'
  )
  await setTimeout(10000)
  return statusCommandRes
}

export const mcModsLs = async () => {
  const commandRes = await ssmCommandOperation(
    'su - ec2-user -c "ls -1 ~/minecraft/mods"'
  )
  await setTimeout(10000)
  return commandRes
}

export const mcAddMod = async (mod_url: string) => {
  const fileName = mod_url.match('.+/(.+?)([?#;].*)?$')![1]
  const commandRes = await ssmCommandOperation(
    `su - ec2-user -c "wget -P ~/minecraft/mods ${mod_url} | aws s3 cp ~/minecraft/mods/${fileName} s3://fcoding"`
  )
  await setTimeout(10000)
  return commandRes
}
