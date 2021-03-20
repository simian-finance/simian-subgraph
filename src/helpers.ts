import {BigDecimal, BigInt} from "@graphprotocol/graph-ts";

const SIFI_DECIMAL_PLACES = BigDecimal.fromString("1000000000")

// Converts a uint256 token amount to a big decimal value
export function convertTokenToDecimal (weiAmount: BigInt) : BigDecimal {
  return weiAmount.toBigDecimal().div(SIFI_DECIMAL_PLACES)
}
