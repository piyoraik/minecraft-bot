const { Client, Intents } = require('discord.js')

const TOKEN = process.env.TOKEN
const SERVERID = process.env.SERVERID
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.once('ready', async () => {
  const data = [
    {
      name: 'start',
      description: 'Minecraftサーバーの起動',
      options: [],
    },
    {
      name: 'kill',
      description: 'Minecraftサーバーの停止',
      options: [],
    },
    {
      name: 'backup',
      description: 'Minecraftサーバーのバックアップ',
      options: [],
    },
    {
      name: 'test',
      description: 'test',
      options: [],
    },
  ]
  await client.application.commands.set(data, SERVERID)
  console.log('Ready!')
})

client.login(TOKEN)
