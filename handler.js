//'use strict';

//module.exports.hello = async (event) => {
//  return {
//    statusCode: 200,
//    body: JSON.stringify(
//      {
//        message: 'Go Serverless v1.0! Your function executed successfully!',
//        input: event,
//      },
//      null,
//      2
//    ),
//  };

  /// Use this code if you don't use the http event with the LAMBDA-PROXY integration
  /// return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
//};


const { Telegraf } = require('telegraf')
// Telegram API token який ми отримали
const token = "5135783195:AAEyAiuUiufSmRFXneQ9klYKL60rh7M3LJY"
// створення бота
const bot = new Telegraf(token);
const imconst = require('./const')
// початок діалогу з ботом 
bot.start((ctx) =>
   ctx.reply("Миру нам!")
);
bot.command("inline", (ctx) => {ctx.reply(imconst.commands)});
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.command("inline", (ctx) => {
    ctx.reply("Hi there!", {
        reply_markup: {
            inline_keyboard: [
                /* Inline buttons. 2 side-by-side */
                [ { text: "Button 1", callback_data: "btn-1" }, { text: "Button 2", callback_data: "btn-2" } ],

                /* One button */
                [ { text: "Next", callback_data: "next" } ],
                
                /* Also, we can have URL buttons. */
                [ { text: "Open in browser", url: "telegraf.js.org" } ]
            ]
        }
    });
});
// запуск бота
module.exports = {
   bot,
};

// вебхук це і є той самий вебхук, який буде відповідати за роботу нашого бота
module.exports.start = async (event) => {
   try {
       let body = event.body[0] === "{"
               ? JSON.parse(event.body)
               : JSON.parse(Buffer.from(event.body, "base64"));
       await bot.handleUpdate(body);
       return { statusCode: 200, body: "" };
   } catch (err) {
      // error handler
   }
};


// прив'язка вебхуку до робота
module.exports.setWebhook = async (event) => {
   try {
//отримання url методу, коли він буде опублікований
       const url = `https://${event.headers.Host}/${event.requestContext.stage}/webhook`;
// виклика методf API телеграм-бота
       await bot.telegram.setWebhook(url);
       return {
           statusCode: 200,
           headers: {"Access-Control-Allow-Origin": "*"},
           body: JSON.stringify({ url }),
       };
   } catch (err) {
   }
};