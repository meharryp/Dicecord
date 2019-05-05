const saveDeck = require('../helpers/saveDeck');
const loadDecks = require('../helpers/loadDecks.js');
const _ = require('underscore');
const fs = require('fs');

module.exports = args => {
    const numberOfCardsToDraw = args.commandText.trim().split(' ')[0];
    const comment = args.commandText.trim().slice(numberOfCardsToDraw.length).trim();
    processDrawCommand(args.message, numberOfCardsToDraw, comment);
};

const processDrawCommand = function (message, numberOfCardsToDraw, comment) {
    let text = '';
    if (isNaN(numberOfCardsToDraw)) {
        return message.reply('ERROR: "' + numberOfCardsToDraw + '" is not a valid number.').catch(console.error);
    }
    else {
        numberOfCardsToDraw = parseInt(numberOfCardsToDraw);
        loadDecks().then((result) => {
            if(result[message.channel.id]) {
                let deck = JSON.parse(JSON.stringify(result[message.channel.id]));

                if (deck.length < numberOfCardsToDraw) {
                    return message.reply('ERROR: Not enough cards left in the deck (requested ' + numberOfCardsToDraw +
                        ', but only ' + deck.length + ' cards left). Reshuffle or draw fewer cards.')
                        .catch(console.error);
                }
                else {
                    let drawnCards = deck.slice(0, numberOfCardsToDraw);
                    deck = deck.slice(numberOfCardsToDraw);
                    text = 'You drew ' + numberOfCardsToDraw + ' cards from the deck (' + deck.length + ' left): ';
                    if (comment) {
                        text += '\n`' + comment + ':`';
                    }
                    _.each(drawnCards, function(card) {
                        text += card + ', ';
                    });
                    text = text.slice(0, -2) + '.';
                    saveDeck({ deck: deck, message: message });
                    return message.reply(text).catch(console.error);
                }
            }
            else {
                return message.reply('ERROR: No deck found for this channel. Shuffle the deck first!')
                    .catch(console.error);
            }
        }, (error) => {
            return message.reply(error).catch(console.error);
        });
    }
};