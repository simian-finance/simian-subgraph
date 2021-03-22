import { ethereum } from "@graphprotocol/graph-ts"
import { Token } from "../types/schema"
import { HolderMonthlyData } from '../types/schema'

const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60

/* Records monthly data for holders */
export function recordHolderMonthlyData(token: Token, block: ethereum.Block): HolderMonthlyData {
  let timestamp = (block.timestamp.toI32() / ONE_MONTH_SECONDS)
  let id = timestamp.toString()
  let monthlyData = HolderMonthlyData.load(id)

  // Create the monthly data if it does not exist
  if (monthlyData == null) {
    monthlyData = new HolderMonthlyData(id)
    monthlyData.timestamp = timestamp * ONE_MONTH_SECONDS
    monthlyData.startBlockNumber = block.number
    monthlyData.startCount = token.totalHolders
    monthlyData.minCount = token.totalHolders
    monthlyData.peakCount = token.totalHolders
  }

  // If current holders is below previous min, update the min value
  if (token.totalHolders.lt(monthlyData.minCount)) {
    monthlyData.minCount = token.totalHolders
  }

  // If current holders is above previous peak, update the peak value
  if (token.totalHolders.gt(monthlyData.peakCount)) {
    monthlyData.peakCount = token.totalHolders
  }

  monthlyData.endCount = token.totalHolders
  monthlyData.save()

  return monthlyData as HolderMonthlyData
}
