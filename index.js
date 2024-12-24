/**
 * https://github.com/CECEthanClarke/shut-your-mouth-tg-app
 */
const process = require('node:process');
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const fs = require('fs');
const configDir = __dirname + '/config'
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir);
}

require('dotenv').config();

const tdl = require('tdl')
const { getTdjson } = require('prebuilt-tdlib')
tdl.configure({ tdjson: getTdjson() })

const config = {
  user_id: 0
}

const client = tdl.createClient({
  apiId: process.env.APP_ID,
  apiHash: process.env.APP_HASH,
  databaseDirectory: configDir + '/_td_database',
  filesDirectory: configDir + '/_td_files'
})
client.on('error', console.error)

function deleteMessage(chatId, messageId) {
  setTimeout(async () => {
    try {
      const result = await client.invoke({
        _: 'deleteMessages',
        chat_id: chatId,
        message_ids: [messageId],
        revoke: true
      })
      console.log('Message deleted:', result)
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
  }, (process.env.DELAY_DELETION_SECONDS || 0) * 1000);
}

async function handle(update) {
  if (update) {
    if (update._ == 'updateNewMessage') {
      const message = update.message;
      if (message) {
        const sender_id = message.sender_id;
        if (sender_id) {
          // Send messages in the group. Only messages you send can be truly deleted
          if (sender_id.user_id === config.user_id) {
            const chat_id = String(message.chat_id);
            if (!message.is_channel_post && chat_id.startsWith('-')) {
              // group message
              if (process.env.MODE === 'FULL_DELETE_MODE') {
                deleteMessage(message.chat_id, message.id);
              }
              else if (process.env.MODE === 'TEXT_ONLY_DELETE_MODE') {
                if (message.content) {
                  if (message.content._ === 'messageText') {
                    deleteMessage(message.chat_id, message.id);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

async function main() {
  await client.login()

  const me = await client.invoke({ _: 'getMe' })
  console.log('My user:', me)
  if (me) {
    if (me.id) {
      config.user_id = me.id;
    }
  }

  client
    .on('update', update => {
      handle(update);
    })
    .on('error', err => {
      console.error('Got error:', JSON.stringify(err, null, 2))
    })
    .on('destroy', () => {
      console.log('destroy event')
    })
}

main().catch(console.error)