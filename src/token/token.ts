import { Address } from '@graphprotocol/graph-ts'
import { Contract } from '../types/Contract/Contract'
import { Token } from '../types/schema'
import { convertTokenToDecimal } from "../helpers"
import { BURN_ADDRESS, CONTRACT_ADDRESS, DECIMAL_ZERO, INT_ZERO } from "../constants"

// Gets the singleton instance of the token entity
export function getTokenInstance(): Token {
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))
  let token = Token.load(CONTRACT_ADDRESS)

  // If the token instance does not exist, create it (lazy-loaded)
  if (token == null) {
    token = new Token(CONTRACT_ADDRESS)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()

    token.totalSupply = convertTokenToDecimal(contract.totalSupply())
    token.totalBurned = DECIMAL_ZERO
    token.remainingSupply = token.totalSupply

    token.totalHolders = INT_ZERO
    token.totalTransfers = INT_ZERO
    token.totalFees = DECIMAL_ZERO
    token.save()
  }

  return token as Token
}

// Updates the token's supply and burn amounts
export function updateTokenSupply(token: Token): void {
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))

  // Update the remaining supply
  token.totalSupply = convertTokenToDecimal(contract.totalSupply())
  token.totalBurned = convertTokenToDecimal(contract.balanceOf(Address.fromString(BURN_ADDRESS)))
  token.remainingSupply = token.totalSupply.minus(token.totalBurned)

  token.save()
}
