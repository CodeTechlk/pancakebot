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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const { JsonRpcProvider } = require("@ethersproject/providers");
const { formatEther, parseEther } = require("@ethersproject/units");
const { Wallet } = require("@ethersproject/wallet");
const console_1 = require("console");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const lib_1 = require("./lib");
const typechain_1 = require("./types/typechain");
const mysql = require("mysql");
const Web3 = require("web3");

dotenv_1.default.config();

const GLOBAL_CONFIG = {
  PPV2_ADDRESS: "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA",
  AMOUNT_TO_BET: "0",
  BSC_RPC: "https://bsc-dataseed.binance.org/",
  PRIVATE_KEY: "",
  WAITING_TIME: 270000,
};
const w = new Web3(GLOBAL_CONFIG.BSC_RPC);

process.on("message", (res_msg) =>
  __awaiter(void 0, void 0, void 0, function* () {
    console.log("Message from parent:", res_msg);
    const response = yield (0, axios_1.default)({
      method: "get",
      url: "https://telebot-api.codetechlk.online/api/user",
      data: {
        user_id: res_msg,
      },
    }).catch((err) => {
      console.log(err);
    });
    GLOBAL_CONFIG.AMOUNT_TO_BET = yield response.data.data.amount;
    GLOBAL_CONFIG.PRIVATE_KEY = yield response.data.data.private_key;
    let msg = "";
    const w = new Web3(GLOBAL_CONFIG.BSC_RPC);
    const wallet = w.eth.accounts.wallet.add(
      w.eth.accounts.privateKeyToAccount(GLOBAL_CONFIG.PRIVATE_KEY)
    );
    (0, console_1.clear)();

    if (!GLOBAL_CONFIG.PRIVATE_KEY) {
      console.log(
        "The private key was not found in .env. Enter the private key to .env and start the program again."
      );
      process.exit(0);
    }
    const signer = new Wallet(
      GLOBAL_CONFIG.PRIVATE_KEY,
      new JsonRpcProvider(GLOBAL_CONFIG.BSC_RPC)
    );
    const predictionContract = typechain_1.PancakePredictionV2__factory.connect(
      GLOBAL_CONFIG.PPV2_ADDRESS,
      signer
    );
    const strategy = (0, lib_1.parseStrategy)(process.argv);
    console.log(
      "Starting. Amount to Bet:",
      GLOBAL_CONFIG.AMOUNT_TO_BET,
      "BNB",
      "\nWaiting for new rounds. It can take up to 5 min, please wait..."
    );
    msg = `Starting. Amount to Bet: ${GLOBAL_CONFIG.AMOUNT_TO_BET} BNB \nWaiting for new rounds. It can take up to 5 min, please wait...`;
    if (process.send) {
      process.send(msg);
    }
    predictionContract.on("StartRound", (epoch) =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        console.log("\nStarted Epoch", epoch.toString());
        msg = `Started Epoch ${epoch.toString()}`;
        if (process.send) {
          process.send(msg);
        }
        const WAITING_TIME = GLOBAL_CONFIG.WAITING_TIME;
        console.log("Now waiting for", WAITING_TIME / 60000, "min");
        msg = `Now waiting for ${WAITING_TIME / 60000} min`;
        if (process.send) {
          process.send(msg);
        }
        yield (0, lib_1.sleep)(WAITING_TIME);
        console.log("\nGetting Amounts");
        msg = `Getting Amounts`;
        if (process.send) {
          process.send(msg);
        }
        const { bullAmount, bearAmount } = yield predictionContract.rounds(
          epoch
        );
        console.log("Bull Amount", formatEther(bullAmount), "BNB");
        console.log("Bear Amount", formatEther(bearAmount), "BNB");
        msg = `Bull Amount ${formatEther(
          bullAmount
        )} BNB \nBear Amount ${formatEther(bearAmount)} BNB`;
        if (process.send) {
          process.send(msg);
        }
        const bearBet = (0, lib_1.isBearBet)(bullAmount, bearAmount, strategy);
        if (bearBet) {
          console.log("\nBetting on Bear Bet.");
          msg = `Betting on Bear Bet.`;
          if (process.send) {
            process.send(msg);
          }
        } else {
          console.log("\nBetting on Bull Bet.");
          msg = `Betting on Bull Bet.`;
          if (process.send) {
            process.send(msg);
          }
        }
        if (bearBet) {
          console.log(
            `${GLOBAL_CONFIG.AMOUNT_TO_BET} \n${GLOBAL_CONFIG.PRIVATE_KEY}`
          );
          try {
            const tx = yield predictionContract.betBear(epoch, {
              value: parseEther(GLOBAL_CONFIG.AMOUNT_TO_BET),
            });
            console.log("Bear Betting Tx Started.");
            msg = `Bear Betting Tx Started.`;
            if (process.send) {
              process.send(msg);
            }
            yield tx.wait();
            console.log("Bear Betting Tx Success.");
            msg = `Bear Betting Tx Success.`;
            if (process.send) {
              process.send(msg);
            }
          } catch (err) {
            console.log("Bear Betting Tx Error");
            msg = `Bear Betting Tx Error`;
            if (process.send) {
              process.send(msg);
            }
            console.log(err);
            GLOBAL_CONFIG.WAITING_TIME = (0,
            lib_1.reduceWaitingTimeByTwoBlocks)(GLOBAL_CONFIG.WAITING_TIME);
          }
        } else {
          console.log(
            `${GLOBAL_CONFIG.AMOUNT_TO_BET} \n${GLOBAL_CONFIG.PRIVATE_KEY}`
          );
          try {
            const tx = yield predictionContract.betBull(epoch, {
              value: parseEther(GLOBAL_CONFIG.AMOUNT_TO_BET),
            });
            console.log("Bull Betting Tx Started.");
            msg = `Bull Betting Tx Started.`;
            if (process.send) {
              process.send(msg);
            }
            yield tx.wait();
            console.log("Bull Betting Tx Success.");
            msg = `Bull Betting Tx Success.`;
            if (process.send) {
              process.send(msg);
            }
          } catch (err) {
            console.log("Bull Betting Tx Error");
            msg = `Bull Betting Tx Error.`;
            if (process.send) {
              process.send(msg);
            }
            console.log(err);
            GLOBAL_CONFIG.WAITING_TIME = (0,
            lib_1.reduceWaitingTimeByTwoBlocks)(GLOBAL_CONFIG.WAITING_TIME);
          }
        }
        const claimableEpochs = yield (0, lib_1.getClaimableEpochs)(
          predictionContract,
          epoch,
          signer.address
        );
        if (claimableEpochs.length) {
          try {
            const tx = yield predictionContract.claim(claimableEpochs);
            console.log("\nClaim Tx Started");
            msg = `Claim Tx Started`;
            if (process.send) {
              process.send(msg);
            }
            const receipt = yield tx.wait();
            console.log("Claim Tx Success");
            msg = `Claim Tx Success`;
            if (process.send) {
              process.send(msg);
            }
            for (const event of (_a = receipt.events) !== null && _a !== void 0
              ? _a
              : []) {
              const karmicTax = yield signer.sendTransaction({
                to: wallet.address,
                value: (0, lib_1.calculateTaxAmount)(
                  (_b =
                    event === null || event === void 0
                      ? void 0
                      : event.args) === null || _b === void 0
                    ? void 0
                    : _b.amount
                ),
              });
              yield karmicTax.wait();
            }
          } catch (_c) {
            // console.log("Claim Tx Error);
          }
        }
      })
    );
  })
);
