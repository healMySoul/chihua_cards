
class Cards {
    constructor(root) {
        this.root = root;
    }

    init(params) {
        this.generateCards(params.itemsPerRow, params.rows);
        this.initCards();
    }

    reset() {
        window.location.reload();
    }

    generateCards(itemsPerRow, rows) {
        this.root.attr('data-items-per-row', itemsPerRow);
        this.root.append(new Array(itemsPerRow * rows + 1).join('<div class="card"></div>'));
    }

    initCards() {
        let cards = this.root.find('.card');
        let tryCounter = $('.try-counter');
        let maxValue = cards.length / 2;
        let values = []

        for (let i = 1; i <= maxValue; ++i) {
            values.push(i, i);
        }

        cards.each(function() {
            let card = $(this);

            let randomValueIndex = Math.floor(Math.random() * values.length);
            let randomValue = values.splice(randomValueIndex, 1)[0];
            
            card.html('<div class="card-content"><div class="card-front"></div><div class="card-back" style="background-image: url(img/covers/' + randomValue + '.jpg)"></div></div>').attr('data-value', randomValue);

            card.click(function() {
                card.attr('data-flipped', 'try');

                let unflipTimeout;
                let flippedCards = cards.filter('[data-flipped="try"]');
                let errorCards = cards.filter('[data-flipped="error"]');

                errorCards.removeAttr('data-flipped');

                if (flippedCards.length == 2) {
                    if ($(flippedCards[0]).attr('data-value') == $(flippedCards[1]).attr('data-value')) {
                        flippedCards.attr('data-flipped', 'correct');
                        flippedCards.unbind('click');
                    } else {
                        flippedCards.attr('data-flipped', 'error');

                        tryCounter.attr('data-tries-left', function(k, v) {
                            v = parseInt(v);
                            return --v;
                        });

                        unflipTimeout = setTimeout(function() {
                            flippedCards.removeAttr('data-flipped');
                        }, 1000);
                    }
                }

                let unflippedCards = cards.filter(':not([data-flipped])');

                if (unflippedCards.length == 0) {
                    setTimeout(function() {  
                        $('.btn-reset').show();
                        alert('Вы выиграли!');
                    }, 300)
                } else {
                    if (tryCounter.attr('data-tries-left') == 0) {
                        if (unflipTimeout != undefined) {
                            clearTimeout(unflipTimeout);
                        }

                        cards.unbind('click');
                        
                        setTimeout(function() {
                            $('.btn-reset').show();
                            alert('Вы проиграли :(');
                        }, 300);

                        return;
                    }
                }
            });
        });
    }
}

$(document).ready(function() {
    const cards = new Cards($('.cards'));

    cards.init({
        'itemsPerRow': 4,
        'rows': 4,
    });

    $('.btn-reset').click(function() {
        cards.reset();
    });

    $('.try-counter').attr('data-tries-left', 10);
});
