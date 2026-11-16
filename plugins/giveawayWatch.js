const { bot } = require('../lib')

const TRIGGER_PATTERNS = [
  /give\s*away/,
  /\bdrop\b.{0,25}\b(aza|acc|acct|account|opay|palmpay|moniepoint|kuda|details|number)\b/,
  /\b(aza|acc|acct|account|opay|palmpay|details)\b.{0,25}\bdrop\b/,
  /\bfirst\s*\d+\s*(accounts?|people|persons|users|winners|to|who)\b/,
  /\d+\s*(naira|₦|k)\b.{0,30}\b(people|persons|users|winners|accounts?)\b/,
]

const ACCOUNT_MESSAGE = process.env.GIVEAWAY_ACCOUNT_MSG || ''
const COOLDOWN_MS = Number(process.env.GIVEAWAY_COOLDOWN_MIN || 30) * 60 * 1000
const lastTriggered = new Map()

bot({ on: 'text', fromMe: false, type: 'giveawayWatch' }, async (message) => {
  if (!ACCOUNT_MESSAGE || !message.isGroup || !message.text) return

  const text = message.text
    .normalize('NFKC')
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .toLowerCase()

  if (!TRIGGER_PATTERNS.some((p) => p.test(text))) return

  const last = lastTriggered.get(message.jid) || 0
  if (Date.now() - last < COOLDOWN_MS) {
    console.log('[giveaway] matched but skipped (cooldown)', message.jid)
    return
  }
  lastTriggered.set(message.jid, Date.now())
  console.log('[giveaway] matched, replying', message.jid)
  return message.send(ACCOUNT_MESSAGE)
})