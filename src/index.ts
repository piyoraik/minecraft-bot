import express from 'express'
import { CacheType, Client, Intents, Interaction } from 'discord.js'
import indexRouter from './router/index'
import {
  mcAddMod,
  mcModsLs,
  mcRestart,
  mcStart,
  mcStop,
} from './service/mcServerOperation'
import { ToEmptyString } from './common'

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
const app = express()
app.use('/', indexRouter)

discordClient.on(
  'interactionCreate',
  async (interaction: Interaction<CacheType>) => {
    if (!interaction.isCommand()) {
      return
    }
    // サーバー起動
    if (interaction.commandName === 'start') {
      await interaction.reply({
        content: 'EC2 Instance StartUp...',
      })
      const ec2StartMessage = await mcStart()
      await interaction.followUp({
        content: '```' + ec2StartMessage.output + '```',
      })
    }
    // サーバー停止
    if (interaction.commandName === 'kill') {
      await interaction.reply({
        content: 'EC2 Instance Shutdown...',
      })
      const ec2StopMessage = await mcStop()
      await interaction.followUp({
        content:
          'EC2 Instance Shutdown Success \n' + '```' + ec2StopMessage + '```',
      })
    }
    // サーバー再起動
    if (interaction.commandName === 'restart') {
      await interaction.reply({
        content: 'Minecraft Service Restarting...',
      })
      const mcServiceRestart = await mcRestart()
      await interaction.followUp({
        content: '```' + mcServiceRestart.output + '```',
      })
    }
    // Mod一覧
    if (interaction.commandName === 'modlist') {
      await interaction.reply({
        content: 'Show installed mods...',
      })
      interaction.channel?.sendTyping()
      const list = await mcModsLs()
      await interaction.followUp({
        content:
          '【OutPut】\n' +
          '```' +
          ToEmptyString(list.output) +
          '```\n' +
          '【Error】\n ' +
          '```' +
          ToEmptyString(list.error) +
          '```',
      })
    }
    // Mod追加
    if (interaction.commandName === 'addmod') {
      const modUrl = interaction.options.data[0].value
      if (typeof modUrl !== 'string') {
        await interaction.reply({
          content: '正しいURLを入力してください',
          ephemeral: true,
        })
      } else {
        await interaction.reply({
          content: `以下のURLのModをサーバーにダウンロードします。\n→　${modUrl}`,
        })
        interaction.channel?.sendTyping()
        const addMod = await mcAddMod(modUrl)
        await interaction.followUp({
          content:
            '【OutPut】\n' +
            '```' +
            ToEmptyString(addMod.output) +
            '```\n' +
            '【Error】\n ' +
            '```' +
            ToEmptyString(addMod.error) +
            '```',
        })
      }
    }
    // テストコマンド
    if (interaction.commandName === 'test') {
      await interaction.reply({
        content: 'うまぴょい！うまぴょい！',
        ephemeral: true,
      })
    }
  }
)
discordClient.login(process.env.TOKEN)

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Listening on port', port)
})
