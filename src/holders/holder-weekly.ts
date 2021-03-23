import { ethereum } from "@graphprotocol/graph-ts"
import { Token } from "../types/schema"
import { HolderWeeklyData } from '../types/schema'

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

/* Records weekly data for holders */
export function recordHolderWeeklyData(token: Token, block: ethereum.Block): HolderWeeklyData {
  let timestamp = (block.timestamp.toI32() / ONE_WEEK_SECONDS)
  let id = timestamp.toString()
  let weeklyData = HolderWeeklyData.load(id)

  // Create the weekly data if it does not exist
  if (weeklyData == null) {
    weeklyData = new HolderWeeklyData(id)
    weeklyData.timestamp = timestamp * ONE_WEEK_SECONDS
    weeklyData.blockNumber = block.number
    weeklyData.startCount = token.totalHolders
    weeklyData.minCount = token.totalHolders
    weeklyData.peakCount = token.totalHolders
  }

  // If current holders is below previous min, update the min value
  if (token.totalHolders.lt(weeklyData.minCount)) {
    weeklyData.minCount = token.totalHolders
  }

  // If current holders is above previous peak, update the peak value
  if (token.totalHolders.gt(weeklyData.peakCount)) {
    weeklyData.peakCount = token.totalHolders
  }

  weeklyData.save()
  return weeklyData as HolderWeeklyData
}
