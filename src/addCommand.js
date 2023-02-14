const { Client, Intents } = require('discord.js')

const TOKEN = process.env.TOKEN
const SERVERID = process.env.SERVER_ID
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
      name: 'modlist',
      description: '導入済みのModの表示',
      options: [],
    },
    {
      name: 'addmod',
      description: '新規でModを導入する',
      options: [
        {
          type: 'STRING',
          name: 'mod_url',
          description: 'jarファイルのURLを指定する',
          required: true,
        },
      ],
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
