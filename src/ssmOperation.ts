import {
  SSMClient,
  SendCommandCommand,
  ListCommandInvocationsCommand,
} from '@aws-sdk/client-ssm'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { setTimeout } from 'timers/promises'

const provider = defaultProvider({})
const INSTANCE_ID = process.env.INSTANCE_ID!
const COMMAND = process.env.COMMAND!

const ssmClient = new SSMClient({
  region: 'ap-northeast-1',
  credentials: provider,
})

export const ssmOperation = async () => {
  const command = new SendCommandCommand({
    DocumentName: 'AWS-RunShellScript',
    InstanceIds: [INSTANCE_ID],
    Parameters: {
      commands: [COMMAND],
    },
  })

  try {
    // EC2でコマンドを実行する
    const commandReqID = await ssmClient
      .send(command)
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

    await setTimeout(5000)

    // 実行結果を取得する
    const commandRes = new ListCommandInvocationsCommand({
      CommandId: commandReqID,
      InstanceId: INSTANCE_ID,
    })
    const commandResResult = await ssmClient.send(commandRes)
    console.log('================')
    console.log(commandResResult)
    console.log('================')
  } catch (err) {
    console.log('実行エラー')
  }
}

ssmOperation()
