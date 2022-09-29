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
const { JsonRpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("@ethersproject/wallet");
const dotenv = require("dotenv");
const typechain_1 = require("./types/typechain");
const Web3 = require("web3");
dotenv.config();

const GLOBAL_CONFIG = {
  PPV2_ADDRESS: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  AMOUNT_TO_BET: "0",
  BSC_RPC: "https://bsc-dataseed.binance.org/",
  PRIVATE_KEY: "",
  WAITING_TIME: 270000,
};

function checkHistory(private_key) {
  return __awaiter(this, void 0, void 0, function* () {
    const signer = new Wallet(
      private_key,
      new JsonRpcProvider(GLOBAL_CONFIG.BSC_RPC)
    );
    const predictionContract = typechain_1.PancakePredictionV2__factory.connect(
      GLOBAL_CONFIG.PPV2_ADDRESS,
      signer
    );
    const w = new Web3(GLOBAL_CONFIG.BSC_RPC);
    let checkHistory = [];
    const wallet = w.eth.accounts.wallet.add(
      w.eth.accounts.privateKeyToAccount(private_key)
    );
    const userPredictionListLength =
      yield predictionContract.getUserRoundsLength(wallet.address);
    const number = userPredictionListLength.toNumber();
    const predictionHistoryList = yield predictionContract.getUserRounds(
      wallet.address,
      0,
      number
    );
    for (let i = 0; i < number; i++) {
      let history = {
        round: predictionHistoryList[0][i].toString(),
        status: predictionHistoryList[1][i][2],
      };
      checkHistory.push(history);
    }
    return checkHistory;
  });
}
function getBalance(private_key) {
  return __awaiter(this, void 0, void 0, function* () {
    const signer = new Wallet(
      private_key,
      new JsonRpcProvider(GLOBAL_CONFIG.BSC_RPC)
    );
    const w = new Web3(GLOBAL_CONFIG.BSC_RPC);
    const wallet = w.eth.accounts.wallet.add(
      w.eth.accounts.privateKeyToAccount(private_key)
    );
    let balance = 0;
    yield w.eth.getBalance(wallet.address).then(function (b) {
      balance = Web3.utils.fromWei(b, "ether");
    });
    return balance;
  });
}
module.exports = {
  getBalance,
  checkHistory,
};
