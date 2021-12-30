import express, { Request, Response } from 'express'
import { CacheType, Client, Intents, Interaction } from 'discord.js'
import { ec2Status } from './ec2Status'

const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
const app = express()
app.get('/', (req: Request, res: Response) => {
  res.send('Discord Bot')
})

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
      ec2Status(interaction, 'START')
    }
    if (interaction.commandName === 'kill') {
      await interaction.reply({
        content: 'EC2 Instance Shutdown...',
      })
      ec2Status(interaction, 'STOP')
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
