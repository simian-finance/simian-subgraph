# Simian Finance Subgraph
Graph Network subgraph for indexing Simian Finance (SIFI) token transfers and distributions

The [Simian Finance subgraph](https://thegraph.com/explorer/subgraph/simian-finance/simian-finance) has been deployed on the Graph and continues to be improved with additional data. You can query data from the Graph playground and see what is available.

## What is a subgraph?

If you are unfamiliar with the [Graph Network](https://thegraph.com/explorer/), check out their [docs](https://thegraph.com/docs/introduction#what-the-graph-is) to get a basic overview of how it works.

Our subgraph is code that instructions the Graph Network how to parse events on the Ethereum blockchain, and store it as entities and relationships. Here are some things we are able to store:
- Token Transfers (and fees)
- Running Balances
- Balance History
- Fee Distribution
- Transfer Volume (daily, weekly, monthly)
- Fee Volume (daily, weekly, monthly)

And that's just the tip of the iceberg. As you can imagine, this data can be used to power some really useful views into the Simian Finance ecosystem!

## Querying the Subgraph

To use the [Simian Finance subgraph](https://thegraph.com/explorer/subgraph/simian-finance/simian-finance) data in a more programmatic fashion you can access it via the GraphQL endpoints:

```
POST https://api.thegraph.com/subgraphs/name/simian-finance/simian-finance
{
  query {
    transfers (first:10 orderBy:timestamp orderDirection:desc) {
      id,
      transaction,
      blockNumber,
      timestamp,
      from,
      to,
      amount,
      feeAmount,
      feeExcluded,
      transferAmount
    }
  }
}
```

For development, we recommended using a REST client that supports GraphQL such as [Insomina](https://insomnia.rest/) or [Postman](https://www.postman.com/).

## Development

### Read the Docs
For developers extending the Simian Finance subgraph, it is recommended that you first do a thorough reading of the [Graph Network docs](https://thegraph.com/docs/). They do a great job of explaining the basics and how it works so that you can get a fundamental understanding of what is possible.

### Local Environment
To develop quickly, you will need a few key things on your machine:

- Node.js 14.x (use 15.x for ARM-based machines)
- REST Client such as [Insomina](https://insomnia.rest/) or [Postman](https://www.postman.com/)
- TypeScript IDE such as [Visual Studio Code](https://code.visualstudio.com/) or [WebStorm](https://www.jetbrains.com/webstorm/)

### Install Graph CLI

Once you have Node.js installed, you should install the Graph CLI tool for deploying subgraph changes:

```
npm install -g @graphprotocol/graph-cli
```

### Running Code Generation
As you build new entity schemas and add event, call, or block handlers to the `subgraph.yaml` files, you will need to re-run the Graph code gen tool:

```
npm run codegen
```

This will ensure the `src/types` directory is populated with the latest TypeScript mappings, allowing you to interact with them in your code.

If you notice that properties are missing/out of date, or imports are not working properly then this is a good first step in troubleshooting.

### Deploying the Subgraph
Prior to deploying, you will need to configure your authentication credentials. You can find your unique access token on the [Graph Dashboard](https://thegraph.com/explorer/dashboard).

To set it, use the following command:
```
graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
```
You should only have to do this once, or if your access token changes in the future.

To deploy
Once you have made changes and wish to deploy them to the Graph, you can use the following command:

```
npm run deploy
```

You should see a success message if everything goes well with a couple URLs. Keep in mind that this will be considered the `Pending Version` until it fully syncs. Once it does, it will replace the `Current Version`, as to ensure there is no lapse in data.
