import { ethereum } from "@graphprotocol/graph-ts/index"
import { getTokenInstance } from "./token"

import {
  recordHolderDailyData,
  recordHolderHourlyData,
  recordHolderMonthlyData,
  recordHolderWeeklyData
} from "./holders"

/* Performed on every block */
export function handleBlock(block: ethereum.Block): void {
  let token = getTokenInstance()

  // Record holder historic data
  recordHolderHourlyData(token, block)
  recordHolderDailyData(token, block)
  recordHolderWeeklyData(token, block)
  recordHolderMonthlyData(token, block)
}
