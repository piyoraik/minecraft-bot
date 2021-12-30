import {
  SSMClient,
  SendCommandCommand,
  ListCommandInvocationsCommand,
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

export const ssmCommandOperation = async (command: string) => {
  const runCommandInfo = new SendCommandCommand({
    DocumentName: 'AWS-RunShellScript',
    InstanceIds: [INSTANCE_ID],
    Parameters: {
      commands: [command],
    },
  })

  try {
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
      throw Error('error')
    }

    await setTimeout(3000)

    // 実行結果を取得する
    const commandRes = new ListCommandInvocationsCommand({
      CommandId: commandReqID,
      InstanceId: INSTANCE_ID,
    })
    const commandResResult = await ssmClient.send(commandRes)
    return {
      status: 1,
      content: `SSM_実行ID: ${
        commandResResult.CommandInvocations![0].CommandId
      }`,
    } as ssmCommandOperationRes
  } catch (err) {
    return {
      status: 0,
      content: 'SSM_SendCommand: 実行エラー',
    } as ssmCommandOperationRes
  }
}
