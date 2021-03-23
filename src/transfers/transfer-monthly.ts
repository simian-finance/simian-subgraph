import { Transfer } from "../types/schema"
import { TransferMonthlyData } from '../types/schema'
import { DECIMAL_ZERO, INT_ONE, INT_ZERO } from "../constants"

const ONE_MONTH_SECONDS = 30 * 24 * 60 * 60

/* Records monthly data for transfers and fees */
export function recordTransferMonthlyData(transfer: Transfer): TransferMonthlyData {
  let timestamp = (transfer.timestamp / ONE_MONTH_SECONDS)
  let id = timestamp.toString()
  let monthlyData = TransferMonthlyData.load(id)

  // Create the monthly data if it does not exist
  if (monthlyData == null) {
    monthlyData = new TransferMonthlyData(id)
    monthlyData.timestamp = timestamp * ONE_MONTH_SECONDS
    monthlyData.blockNumber = transfer.blockNumber
    monthlyData.minAmount = transfer.amount
    monthlyData.maxAmount = transfer.amount
    monthlyData.avgAmount = transfer.amount
    monthlyData.transferCount = INT_ZERO
    monthlyData.transferVolume = DECIMAL_ZERO
    monthlyData.feeVolume = DECIMAL_ZERO
  }

  // If current amount is below previous min, update the min value
  if (transfer.amount.lt(monthlyData.minAmount)) {
    monthlyData.minAmount = transfer.amount
  }

  // If transfer amount is above previous max, update the max value
  if (transfer.amount.gt(monthlyData.maxAmount)) {
    monthlyData.maxAmount = transfer.amount
  }

  // Update totals
  monthlyData.transferCount = monthlyData.transferCount.plus(INT_ONE)
  monthlyData.transferVolume = monthlyData.transferVolume.plus(transfer.amount)
  monthlyData.feeVolume = monthlyData.feeVolume.plus(transfer.feeAmount)

  // Update average amount
  if (monthlyData.transferCount.gt(INT_ZERO)) {
    monthlyData.avgAmount = monthlyData.transferVolume.div(monthlyData.transferCount.toBigDecimal())
  }

  monthlyData.save()
  return monthlyData as TransferMonthlyData
}
