const fs = require('fs');
const loadDecks = require('./loadDecks.js');

module.exports = (args) => {
    loadDecks().then((result) => {
        const decks = result;
        decks[args.message.channel.id] = args.deck;
        fs.writeFile('./storage/decks.json', JSON.stringify(decks), function(err) {
            if (err) {
                return args.message.reply('ERROR: Couldn\'t save decks file: ', err);
            } else if(args.shuffling) {
                return args.message.reply('Deck shuffled!');
            }
        });
    }, (error) => {
        return args.message.reply(error);
    });
};