import { BigInt, BigDecimal } from "@graphprotocol/graph-ts"

// Address constants
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const BURN_ADDRESS = '0x000000000000000000000000000000000000dead'
export const CONTRACT_ADDRESS = '0x4afb0aac9b862946837b2444566b8a914d6d0d97'

// Number of decimals used in the Simian Token contract
export let TOKEN_DECIMALS = BigInt.fromI32(9)

// Zero and one constants as bigint/bigdecimal
export let INT_ZERO = BigInt.fromI32(0)
export let INT_ONE = BigInt.fromI32(1)
export let DECIMAL_ZERO = BigDecimal.fromString('0')
export let DECIMAL_ONE = BigDecimal.fromString('1')
