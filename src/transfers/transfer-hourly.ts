import { Transfer } from "../types/schema"
import { TransferHourlyData } from '../types/schema'
import { DECIMAL_ZERO, INT_ONE, INT_ZERO } from "../constants"

const ONE_HOUR_SECONDS = 60 * 60

/* Records hourly data for transfers and fees */
export function recordTransferHourlyData(transfer: Transfer): TransferHourlyData {
  let timestamp = (transfer.timestamp / ONE_HOUR_SECONDS)
  let id = timestamp.toString()
  let hourlyData = TransferHourlyData.load(id)

  // Create the hourly data if it does not exist
  if (hourlyData == null) {
    hourlyData = new TransferHourlyData(id)
    hourlyData.timestamp = timestamp * ONE_HOUR_SECONDS
    hourlyData.blockNumber = transfer.blockNumber
    hourlyData.minAmount = DECIMAL_ZERO
    hourlyData.maxAmount = DECIMAL_ZERO
    hourlyData.avgAmount = DECIMAL_ZERO
    hourlyData.transferCount = INT_ZERO
    hourlyData.transferVolume = DECIMAL_ZERO
    hourlyData.feeVolume = DECIMAL_ZERO
  }

  // If current amount is below previous min, update the min value
  if (transfer.amount.lt(hourlyData.minAmount)) {
    hourlyData.minAmount = transfer.amount
  }

  // If transfer amount is above previous max, update the max value
  if (transfer.amount.gt(hourlyData.maxAmount)) {
    hourlyData.maxAmount = transfer.amount
  }

  // Update totals
  hourlyData.transferCount = hourlyData.transferCount.plus(INT_ONE)
  hourlyData.transferVolume = hourlyData.transferVolume.plus(transfer.amount)
  hourlyData.feeVolume = hourlyData.feeVolume.plus(transfer.feeAmount)

  // Update average amount
  if (hourlyData.transferCount.gt(INT_ZERO)) {
    hourlyData.avgAmount = hourlyData.transferVolume.div(hourlyData.transferCount.toBigDecimal())
  }

  hourlyData.save()
  return hourlyData as TransferHourlyData
}
