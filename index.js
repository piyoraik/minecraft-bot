import express from 'express'
import { Client, Intents } from 'discord.js'
import {
  EC2Client,
  StartInstancesCommand,
  StopInstancesCommand,
} from '@aws-sdk/client-ec2'
import { defaultProvider } from '@aws-sdk/credential-provider-node'

const TOKEN = process.env.TOKEN
const INSTANCE_ID = process.env.INSTANCE_ID
const discordClient = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})
const provider = defaultProvider({})
const ec2Client = new EC2Client({
  region: 'ap-northeast-1',
  credentials: provider,
})

const app = express()
app.get('/', (req, res) => {
  res.send('Discord Bot')
})

discordClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }
  if (interaction.commandName === 'start') {
    await interaction.reply({
      content: 'EC2 Instance StartUp...',
    })
    run(interaction, 'START')
  }
  if (interaction.commandName === 'kill') {
    await interaction.reply({
      content: 'EC2 Instance Shutdown...',
    })
    run(interaction, 'STOP')
  }
})
discordClient.login(TOKEN)

const run = async (interaction, command) => {
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

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Listening on port', port)
})
