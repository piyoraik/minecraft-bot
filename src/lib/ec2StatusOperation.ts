import {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { StatusCOMMAND } from '../types/StatusCommand'

const provider = defaultProvider({})
const ec2Client = new EC2Client({
  region: 'ap-northeast-1',
  credentials: provider,
})
const INSTANCE_ID = process.env.INSTANCE_ID!

export const ec2Status = async (command: StatusCOMMAND) => {
  if (command === 'START') {
    try {
      await ec2Client.send(
        new StartInstancesCommand({ InstanceIds: [INSTANCE_ID] })
      )
      return 1
    } catch (err) {
      console.log(err)
      return 0
    }
  } else {
    try {
      await ec2Client.send(
        new StopInstancesCommand({ InstanceIds: [INSTANCE_ID] })
      )
      return 1
    } catch (err) {
      console.log(err)
      return 0
    }
  }
}
