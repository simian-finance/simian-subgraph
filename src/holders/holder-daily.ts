import { ethereum } from "@graphprotocol/graph-ts"
import { Token } from "../types/schema"
import { HolderDailyData } from '../types/schema'

const ONE_DAY_SECONDS = 24 * 60 * 60

/* Records daily data for holders */
export function recordHolderDailyData(token: Token, block: ethereum.Block): HolderDailyData {
  let timestamp = (block.timestamp.toI32() / ONE_DAY_SECONDS)
  let id = timestamp.toString()
  let dailyData = HolderDailyData.load(id)

  // Create the daily data if it does not exist
  if (dailyData == null) {
    dailyData = new HolderDailyData(id)
    dailyData.timestamp = timestamp * ONE_DAY_SECONDS
    dailyData.blockNumber = block.number
    dailyData.startCount = token.totalHolders
    dailyData.minCount = token.totalHolders
    dailyData.peakCount = token.totalHolders
  }

  // If current holders is below previous min, update the min value
  if (token.totalHolders.lt(dailyData.minCount)) {
    dailyData.minCount = token.totalHolders
  }

  // If current holders is above previous peak, update the peak value
  if (token.totalHolders.gt(dailyData.peakCount)) {
    dailyData.peakCount = token.totalHolders
  }

  dailyData.save()
  return dailyData as HolderDailyData
}
