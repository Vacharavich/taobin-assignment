Info about this project.

This project is my attempt on writing publish-subscribe as an assignment given by Gnoyoyo.

From the base given by assignment. I chose to modify machines a little bit - to have status lowStockWarning on itself - to have a objective payload for stockLevelOkEvent. Then, I chose to create pubSubServices by having Map<string, ISubscriber> to keep a list of handler that subscribe the service, which use subID as a key to help when unsubscribe, while event will always publish to every handler that subscribe under the service, and they will check the event they received themselves whether they can handle or not.

For SaleSubscriber, I add stockLevel checking before sale event happen to make sure that sale will not occur if the machine stock is not enough to create the transaction.

I also create test case to cover all scenario that could happen, which cover Note II that given in the instruction.

To run the project, you can run "npm run dev" and it will run the app.ts, or you can run "npm run test" to run the test suite.