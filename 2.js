require('dotenv').config();
const { Telegraf } = require('telegraf');
const {MenuTemplate, MenuMiddleware}  = require('telegraf-inline-menu');
const {Markup}  =  require ('telegraf') ;
const bot = new Telegraf('5394765496:AAGAhx0VCspYNnflQfanIftWXijbsmMq4-I');
const PAYMENT_TOKEN = '1744374395:TEST:bce59265bbf292861da';


try{


    const products = [
    {
        name: 'Nuka-Cola Quantum',
        price: 227.99,
        description: 'Ice-cold, radioactive Nuka-Cola. Very rare!',
        photoUrl: 'http://vignette2.wikia.nocookie.net/fallout/images/e/e6/Fallout4_Nuka_Cola_Quantum.png'
    },
    {
        name: 'Iguana on a Stick',
        price: 223.99,
        description: 'The wasteland\'s most famous delicacy.',
        photoUrl: 'https://vignette2.wikia.nocookie.net/fallout/images/b/b9/Iguana_on_a_stick.png'
  }
];

function createInvoice (product) {
    return {
        provider_token: '1832575495:TEST:ef0faadeaa3624a93c63274084a6aaf99efa01f5e9d5479847299b26661bb444',
        start_parameter: 'foo',
        title: product.name,
        description: product.description,
        currency: 'RUB',
        photo_url: product.photoUrl,
        is_flexible: false,
        need_shipping_address: false,
        prices: [{ label: product.name, amount: Math.trunc(product.price * 100) }],
        payload: {}
    }
};

// Start command
bot.command('start',  ((ctx) =>  {ctx.reply(`Здравствуй, ${ctx.from.first_name}. Добро пожаловать в "TawClub" .`,
  
  Markup.keyboard([
['МЕНЮ'],
['помощь', 'ввести промокод'],
  ]).resize(),

  )}));

const category = [{ 
  name: 'Бургеры',
  description: 'Лучшие бургеры в океане!',
}, 
{ 
  name: 'Суши', 
  description: 'Готовят корейцы!'
},
{
  name: 'Пицца',
  description: 'Прямо как в Италии!'
},
{
  name: 'Напитки',
  description: 'Самые дешевые напитки!'
}];

const sushi = { 
    1: '2122' , 
    2: '12' , 
    3: '121'
};

//категории
bot.hears(`МЕНЮ`,  ctx =>{ 
  bot.telegram.sendMessage(ctx.chat.id , 'ВЫБЕРИТЕ КАТЕГОРИЮ' , 
 {
  reply_markup: { 
     inline_keyboard: [
            [ {text: "шапка" , callback_data:'1'}],
      
      [{text:"куртка" , callback_data:'2'}]]
  }
   }
 
)})

bot.command('res' , ((ctx) => {ctx.reply(`${sushi}`)}))


// Show offer
bot.on(`${category.name}`, async (ctx) => await ctx.replyWithMarkdown( `` , 
      
    Markup.keyboard(products.map(p => p.name)).oneTime().resize()
  
))

// Order product
products.forEach(p => {
    bot.hears(p.name, ((ctx) => {
      ctx.telegram.sendMessage( 2090697721 , `${ctx.from.first_name} хочет купить ${p.name}.`)
        //console.log(`${ctx.from.first_name} is about to buy a ${p.name}.`);
        ctx.replyWithInvoice(createInvoice(p))
    }))
});

// Handle payment callbacks


bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true))
bot.on('successful_payment', (ctx) => {
    ctx.telegram.sendMessage( 2090697721 , `${ctx.from.first_name} (${ctx.from.username}) оплатил ${ctx.message.successful_payment.total_amount / 100} €.`)

})

 

bot.command('info' , ctx => {
  

     let cat12 = 'выберите категорию'; 
  bot.telegram.sendMessage(ctx.chat.id ,   `*выберите категорию*` , 
  

{
  reply_markup: { 
     inline_keyboard: [
            [ {text: "шапка" , callback_data:'price'}],
      
      [{text:"куртка" , callback_data:'price-sa'}]]
  }
})
})

bot.action('price' , ctx => { 
    ctx.deleteMessage(); 
    bot.telegram.sendMessage(ctx.chat.id , 'купить' , 
     {
  reply_markup: { 
     inline_keyboard: [
            [ {text: "шапка" , callback_data:'price-sh'}]]
  
  }
} )
})

bot.action('price-sa' , ctx => { 
    ctx.deleteMessage(); 
    bot.telegram.sendMessage(ctx.chat.id , 'купить' , 
     {
  reply_markup: { 
     inline_keyboard: [
            [ {text: "куртка" , callback_data:'price-kr'}]]
  
  }
} )
})

bot.action('price-sh' , ctx => {
       ctx.deleteMessage(); 
       ctx.replyWithMarkdown('Заказ выполнен!')


})



bot.action('price-kr' , ctx => {
       ctx.deleteMessage(); 
       ctx.replyWithMarkdown('Заказ выполнен!')


})

}catch (err) {
  console.log(`ошибка`)
}




bot.startPolling();







// 1. Нужно подключить свою карту для оплаты. 
// 2. Нужно подключить категории и подкатегории.  
// 3. Подключить аналитику. 
// 4. Вопросы для клиентов. 
// 5. Отправка результата на аккаунт. 