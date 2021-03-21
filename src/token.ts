import { Address } from '@graphprotocol/graph-ts'
import { SimianToken } from './types/SimianToken/SimianToken'
import { Token } from './types/schema'
import { CONTRACT_ADDRESS } from "./constants"

// Gets the singleton instance of the token entity
export function getTokenInstance() : Token {
  let contract = SimianToken.bind(Address.fromString(CONTRACT_ADDRESS))
  let token = Token.load(CONTRACT_ADDRESS)

  // If the token instance does not exist, create it (lazy-loaded)
  if (token == null) {
    token = new Token(CONTRACT_ADDRESS)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()

    token.save()
  }

  return token as Token
}
