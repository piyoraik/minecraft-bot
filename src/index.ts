import express from 'express'
import { CacheType, Client, Intents, Interaction } from 'discord.js'
import indexRouter from './router/index'
import { mcStart, mcStop } from './service/mcServerOperation'

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
    if (interaction.commandName === 'start') {
      await interaction.reply({
        content: 'EC2 Instance StartUp...',
      })
      const ec2StartMessage = await mcStart()
      await interaction.followUp({
        content: ec2StartMessage,
      })
    }
    if (interaction.commandName === 'kill') {
      await interaction.reply({
        content: 'EC2 Instance Shutdown...',
      })
      const ec2StopMessage = await mcStop()
      await interaction.followUp({
        content: `EC2 Instance Shutdown Success 
        ${ec2StopMessage}`,
      })
    }
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
