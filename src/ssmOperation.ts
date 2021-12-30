import {
  SSMClient,
  SendCommandCommand,
  ListCommandInvocationsCommand,
} from '@aws-sdk/client-ssm'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { CacheType, CommandInteraction } from 'discord.js'
import { setTimeout } from 'timers/promises'
import { StatusCOMMAND } from './types/StatusCommand'

const provider = defaultProvider({})
const INSTANCE_ID = process.env.INSTANCE_ID!

const ssmClient = new SSMClient({
  region: 'ap-northeast-1',
  credentials: provider,
})

export const ssmOperation = async (
  command: StatusCOMMAND,
  interaction: CommandInteraction<CacheType>
) => {
  let runCommand = process.env.START_COMMAND!
  if (command === 'STOP') {
    runCommand = process.env.STOP_COMMAND!
  }

  const runCommandInfo = new SendCommandCommand({
    DocumentName: 'AWS-RunShellScript',
    InstanceIds: [INSTANCE_ID],
    Parameters: {
      commands: [runCommand],
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

    await setTimeout(5000)

    // 実行結果を取得する
    const commandRes = new ListCommandInvocationsCommand({
      CommandId: commandReqID,
      InstanceId: INSTANCE_ID,
    })
    const commandResResult = await ssmClient.send(commandRes)
    interaction.followUp({
      content: `SSMInfo: ${commandResResult.CommandInvocations![0].Status}
      状態: ゲームデータを保存中
      実行ID: ${commandResResult.CommandInvocations![0].CommandId}`,
    })
    return 1
  } catch (err) {
    interaction.followUp({
      content: 'SSMInfo: 実行エラー',
    })
    return 0
  }
}
