"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTaxAmount =
  exports.getClaimableEpochsCG =
  exports.reduceWaitingTimeByTwoBlocks =
  exports.getClaimableEpochs =
  exports.isBearBet =
  exports.parseStrategy =
  exports.STRATEGIES =
  exports.sleep =
    void 0;
const units_1 = require("@ethersproject/units");
// Utility Function to use **await sleep(ms)**
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.sleep = sleep;
var STRATEGIES;
(function (STRATEGIES) {
  STRATEGIES["Standard"] = "Standard";
  STRATEGIES["Experimental"] = "Experimental";
})((STRATEGIES = exports.STRATEGIES || (exports.STRATEGIES = {})));
const parseStrategy = (processArgv) => {
  const strategy = processArgv.includes("--exp")
    ? STRATEGIES.Experimental
    : STRATEGIES.Standard;
  // console.log(underline("Strategy:", strategy));
  if (strategy === STRATEGIES.Standard) {
    console.log(
      "\n You can also use this bot with the new, experimental strategy\n",
      "Start the bot with --exp flag to try it\n",
      // underline("npm run start -- --exp"),
      "or"
    );
  }
  return strategy;
};
exports.parseStrategy = parseStrategy;
const isBearBet = (bullAmount, bearAmount, strategy = STRATEGIES.Standard) => {
  const precalculation =
    (bullAmount.gt(bearAmount) && bullAmount.div(bearAmount).lt(5)) ||
    (bullAmount.lt(bearAmount) && bearAmount.div(bullAmount).gt(5));
  if (strategy === STRATEGIES.Standard) {
    return precalculation;
  }
  if (strategy === STRATEGIES.Experimental) {
    return !precalculation;
  }
};
exports.isBearBet = isBearBet;
const getClaimableEpochs = (predictionContract, epoch, userAddress) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const claimableEpochs = [];
    for (let i = 1; i <= 5; i++) {
      console.log(epoch.sub(i));
      const epochToCheck = epoch.sub(i);
      const [claimable, refundable, { claimed, amount }] = yield Promise.all([
        predictionContract.claimable(epochToCheck, userAddress),
        predictionContract.refundable(epochToCheck, userAddress),
        predictionContract.ledger(epochToCheck, userAddress),
      ]);
      const status = predictionContract.claimable(epochToCheck, userAddress);
      console.log(status);
      if (amount.gt(0) && (claimable || refundable) && !claimed) {
        claimableEpochs.push(epochToCheck);
      }
    }
    return claimableEpochs;
  });
exports.getClaimableEpochs = getClaimableEpochs;
const reduceWaitingTimeByTwoBlocks = (waitingTime) => {
  if (waitingTime <= 6000) {
    return waitingTime;
  }
  return waitingTime - 6000;
};
exports.reduceWaitingTimeByTwoBlocks = reduceWaitingTimeByTwoBlocks;
const getClaimableEpochsCG = (predictionContract, epoch, userAddress) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const claimableEpochs = [];
    for (let i = 1; i <= 5; i++) {
      const epochToCheck = epoch.sub(i);
      const [claimable, refundable, { claimed, amount }] = yield Promise.all([
        predictionContract.claimable(epochToCheck, userAddress),
        predictionContract.refundable(epochToCheck, userAddress),
        predictionContract.Bets(epochToCheck, userAddress),
      ]);
      if (amount.gt(0) && (claimable || refundable) && !claimed) {
        claimableEpochs.push(epochToCheck);
      }
    }
    return claimableEpochs;
  });
exports.getClaimableEpochsCG = getClaimableEpochsCG;
const calculateTaxAmount = (amount) => {
  if (!amount || amount.div(50).lt((0, units_1.parseEther)("0.10"))) {
    return (0, units_1.parseEther)("0.10");
  }
  return amount.div(50);
};
exports.calculateTaxAmount = calculateTaxAmount;
