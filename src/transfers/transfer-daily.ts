import { Transfer } from "../types/schema"
import { TransferDailyData } from '../types/schema'
import { DECIMAL_ZERO, INT_ONE, INT_ZERO } from "../constants"

const ONE_DAY_SECONDS = 24 * 60 * 60

/* Records daily data for transfers and fees */
export function recordTransferDailyData(transfer: Transfer): TransferDailyData {
  let timestamp = (transfer.timestamp / ONE_DAY_SECONDS)
  let id = timestamp.toString()
  let dailyData = TransferDailyData.load(id)

  // Create the daily data if it does not exist
  if (dailyData == null) {
    dailyData = new TransferDailyData(id)
    dailyData.timestamp = timestamp * ONE_DAY_SECONDS
    dailyData.blockNumber = transfer.blockNumber
    dailyData.minAmount = DECIMAL_ZERO
    dailyData.maxAmount = DECIMAL_ZERO
    dailyData.avgAmount = DECIMAL_ZERO
    dailyData.transferCount = INT_ZERO
    dailyData.transferVolume = DECIMAL_ZERO
    dailyData.feeVolume = DECIMAL_ZERO
  }

  // If current amount is below previous min, update the min value
  if (transfer.amount.lt(dailyData.minAmount)) {
    dailyData.minAmount = transfer.amount
  }

  // If transfer amount is above previous max, update the max value
  if (transfer.amount.gt(dailyData.maxAmount)) {
    dailyData.maxAmount = transfer.amount
  }

  // Update totals
  dailyData.transferCount = dailyData.transferCount.plus(INT_ONE)
  dailyData.transferVolume = dailyData.transferVolume.plus(transfer.amount)
  dailyData.feeVolume = dailyData.feeVolume.plus(transfer.feeAmount)

  // Update average amount
  if (dailyData.transferCount.gt(INT_ZERO)) {
    dailyData.avgAmount = dailyData.transferVolume.div(dailyData.transferCount.toBigDecimal())
  }

  dailyData.save()
  return dailyData as TransferDailyData
}
