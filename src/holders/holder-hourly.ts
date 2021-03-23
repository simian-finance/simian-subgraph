import { ethereum } from "@graphprotocol/graph-ts"
import { Token } from "../types/schema"
import { HolderHourlyData } from '../types/schema'

const ONE_HOUR_SECONDS = 60 * 60

/* Records hourly data for holders */
export function recordHolderHourlyData(token: Token, block: ethereum.Block): HolderHourlyData {
  let timestamp = (block.timestamp.toI32() / ONE_HOUR_SECONDS)
  let id = timestamp.toString()
  let hourlyData = HolderHourlyData.load(id)

  // Create the hourly data if it does not exist
  if (hourlyData == null) {
    hourlyData = new HolderHourlyData(id)
    hourlyData.timestamp = timestamp * ONE_HOUR_SECONDS
    hourlyData.blockNumber = block.number
    hourlyData.startCount = token.totalHolders
    hourlyData.minCount = token.totalHolders
    hourlyData.peakCount = token.totalHolders
  }

  // If current holders is below previous min, update the min value
  if (token.totalHolders.lt(hourlyData.minCount)) {
    hourlyData.minCount = token.totalHolders
  }

  // If current holders is above previous peak, update the peak value
  if (token.totalHolders.gt(hourlyData.peakCount)) {
    hourlyData.peakCount = token.totalHolders
  }

  hourlyData.save()
  return hourlyData as HolderHourlyData
}
