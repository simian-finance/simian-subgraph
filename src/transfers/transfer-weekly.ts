import { Transfer } from "../types/schema"
import { TransferWeeklyData } from '../types/schema'
import { DECIMAL_ZERO, INT_ONE, INT_ZERO } from "../constants"

const ONE_WEEK_SECONDS = 7 * 24 * 60 * 60

/* Records weekly data for transfers and fees */
export function recordTransferWeeklyData(transfer: Transfer): TransferWeeklyData {
  let timestamp = (transfer.timestamp / ONE_WEEK_SECONDS)
  let id = timestamp.toString()
  let weeklyData = TransferWeeklyData.load(id)

  // Create the weekly data if it does not exist
  if (weeklyData == null) {
    weeklyData = new TransferWeeklyData(id)
    weeklyData.timestamp = timestamp * ONE_WEEK_SECONDS
    weeklyData.blockNumber = transfer.blockNumber
    weeklyData.minAmount = DECIMAL_ZERO
    weeklyData.maxAmount = DECIMAL_ZERO
    weeklyData.avgAmount = DECIMAL_ZERO
    weeklyData.transferCount = INT_ZERO
    weeklyData.transferVolume = DECIMAL_ZERO
    weeklyData.feeVolume = DECIMAL_ZERO
  }

  // If current amount is below previous min, update the min value
  if (transfer.amount.lt(weeklyData.minAmount)) {
    weeklyData.minAmount = transfer.amount
  }

  // If transfer amount is above previous max, update the max value
  if (transfer.amount.gt(weeklyData.maxAmount)) {
    weeklyData.maxAmount = transfer.amount
  }

  // Update totals
  weeklyData.transferCount = weeklyData.transferCount.plus(INT_ONE)
  weeklyData.transferVolume = weeklyData.transferVolume.plus(transfer.amount)
  weeklyData.feeVolume = weeklyData.feeVolume.plus(transfer.feeAmount)

  // Update average amount
  if (weeklyData.transferCount.gt(INT_ZERO)) {
    weeklyData.avgAmount = weeklyData.transferVolume.div(weeklyData.transferCount.toBigDecimal())
  }

  weeklyData.save()
  return weeklyData as TransferWeeklyData
}
