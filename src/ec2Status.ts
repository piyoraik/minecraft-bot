import {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { CacheType, CommandInteraction } from 'discord.js'
import { setTimeout } from 'timers/promises'
import { ssmOperation } from './ssmOperation'
import { StatusCOMMAND } from './types/StatusCommand'

const provider = defaultProvider({})
const ec2Client = new EC2Client({
  region: 'ap-northeast-1',
  credentials: provider,
})
const INSTANCE_ID = process.env.INSTANCE_ID!

export const ec2Status = async (
  interaction: CommandInteraction<CacheType>,
  command: StatusCOMMAND
) => {
  if (command === 'START') {
    try {
      const data = await ec2Client.send(
        new StartInstancesCommand({ InstanceIds: [INSTANCE_ID] })
      )
      interaction.followUp({ content: 'Success' })
      return data
    } catch (err) {
      console.log(err)
      interaction.followUp({ content: 'Error' })
    }
  } else if (command === 'STOP') {
    try {
      const ssmCommand = await ssmOperation('STOP', interaction)
      if (ssmCommand === 0) throw Error('実行エラー')
      await setTimeout(30000)
      const data = await ec2Client.send(
        new StopInstancesCommand({ InstanceIds: [INSTANCE_ID] })
      )
      interaction.followUp({ content: 'Success' })
      return data
    } catch (err) {
      console.log(err)
      interaction.followUp({ content: 'Error' })
    }
  }
}
