const { bot } = require('../lib')

const TRIGGER_PATTERNS = [
  /first\s*\d+\s*(accounts?|people|persons|users|to\s*(drop|comment|reply))/i,
  /\d+\s*(naira|₦|k)?\s*(each\s*)?for\s*\d+\s*(people|persons|users)/i,
  /drop\s*(your|ur|ya)?\s*(aza|acc|acct|account|opay|palmpay|details)/i,
  /giveaway/i,
]
const ACCOUNT_MESSAGE = process.env.GIVEAWAY_ACCOUNT_MSG || ''
const COOLDOWN_MS = Number(process.env.GIVEAWAY_COOLDOWN_MIN || 30) * 60 * 1000

const lastTriggered = new Map()

bot({ on: 'text', fromMe: false, type: 'giveawayWatch' }, async (message) => {
  if (!ACCOUNT_MESSAGE || !message.isGroup || !message.text) return

  const hit = TRIGGER_PATTERNS.some((pattern) => pattern.test(message.text))
  if (!hit) return

  const last = lastTriggered.get(message.jid) || 0
  if (Date.now() - last < COOLDOWN_MS) return
  lastTriggered.set(message.jid, Date.now())

  return message.send(ACCOUNT_MESSAGE)
})
