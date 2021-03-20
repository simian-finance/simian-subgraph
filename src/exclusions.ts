import { ExcludeAccountCall, IncludeAccountCall } from './types/SimianToken/SimianToken'
import { Exclusion } from './types/schema'

// Handles a call to the excludeAccount function on the contract
export function handleExcludeAccount(call: ExcludeAccountCall): void {
  // The ID will be the account address being excluded
  let id = call.inputs.account.toHexString()
  let exclusion = Exclusion.load(id)

  // If the exclusion does not exist, create it
  if (exclusion == null) {
    exclusion = new Exclusion(id)
  }

  // Mark the exclusion as active and save it
  exclusion.active = true
  exclusion.save()
}

// Handles a call to the includeAccount function on the contract
export function handleIncludeAccount(call: IncludeAccountCall): void {
  // The ID will be the account address being excluded
  let id = call.inputs.account.toHexString()
  let exclusion = Exclusion.load(id)

  // If the exclusion does not exist, ignore this
  if (exclusion == null) {
    return
  }

  // Mark the exclusion as inactive and save it
  exclusion.active = false
  exclusion.save()
}
