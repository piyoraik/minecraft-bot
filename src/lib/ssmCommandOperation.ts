import {
  SSMClient,
  SendCommandCommand,
  GetCommandInvocationCommand,
} from '@aws-sdk/client-ssm'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { setTimeout } from 'timers/promises'
import { ssmCommandOperationRes } from '../types/ssmCommandOperationType'

const provider = defaultProvider({})
const INSTANCE_ID = process.env.INSTANCE_ID!

const ssmClient = new SSMClient({
  region: 'ap-northeast-1',
  credentials: provider,
})

export const ssmCommandOperation = async (
  command: string
): Promise<ssmCommandOperationRes> => {
  const runCommandInfo = new SendCommandCommand({
    DocumentName: 'AWS-RunShellScript',
    InstanceIds: [INSTANCE_ID],
    Parameters: {
      commands: [command],
    },
  })

  // EC2でコマンドを実行する
  const commandReqID = await ssmClient
    .send(runCommandInfo)
    .then((res) => {
      return res.Command?.CommandId
    })
    .catch((error) => {
      const { requestId, cfId, extendedRequestId } = error.$metadata
      console.log({ requestId, cfId, extendedRequestId })
    })

  if (commandReqID === void 0 || undefined) {
    return {
      status: 0,
      output: '-',
      error: 'EC2 is Not Running',
    }
  }

  await setTimeout(5000)

  // 実行結果を取得する
  const res = new GetCommandInvocationCommand({
    CommandId: commandReqID,
    InstanceId: INSTANCE_ID,
  })

  const commandResResult = await ssmClient.send(res)
  if (commandResResult.Status !== 'Failed') {
    return {
      status: 1,
      output: commandResResult.StandardOutputContent,
      error: commandResResult.StandardErrorContent,
    }
  } else {
    return {
      status: 0,
      output: commandResResult.StandardOutputContent,
      error: commandResResult.StandardErrorContent,
    }
  }
}
