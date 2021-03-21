/*
 * This file serves as an index.ts to keep everything organized as separate files
 * The subgraph mapper will still see all the function handlers as top-level exports
*/

// Re-export transfer event handlers for tracking accounts
export { handleTransferForAccount } from './accounts'

 // Re-export transfer event handlers for tracking transfers
export { handleTransfer } from './transfers'
