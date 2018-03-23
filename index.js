/**
 * サンプル発話
 * 
 * ベンチプレス
 * 50キログラムです
 * 10回やりました
 * 3セットやりました
 */

'use strict';

const Alexa = require('alexa-sdk');

const states = {
    TRANINGTYPEMODE: '_TRANINGTYPEMODE',
    TRANINGWEIGHTMODE: '_TRANINGWEIGHTMODE',
    TRANINGAMOUNTMODE: '_TRANINGAMOUNTMODE',
    TRANINGSETCOUNTMODE: '_TRANINGSETCOUNTMODE',
    TRANINGSAVEMODE: '_TRANINGSAVEMODE',
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    //alexa.dynamoDBTableName = 'TraningRecordTable';
    alexa.registerHandlers(handlers, weightModeHandlers, amountModeHandlers, setCountModeHandlers, saveModeHandlers);
    alexa.execute();
};

const handlers = {
    'LaunchRequest': function () {
        this.handler.state = '';
        this.attributes['name'] = '';
        this.attributes['weight'] = '';
        this.attributes['amount'] = '';
        this.attributes['setcount'] = '';
        this.emit(':ask', '今日の筋トレを記録します。まずはどんな種目をしたのか教えてください。');
    },
    'TraningIntent': function () {
        this.handler.state = states.TRANINGWEIGHTMODE;
        const name =this.event.request.intent.slots.Traning.value;
        this.attributes['name'] = name;
        this.emit(':ask', name + 'ですね。次に重さ・ウェイトをキログラム単位で教えてください。');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', '今日やった筋トレを記録します', '今日やった筋トレを記録します。');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'Unhandled': function() {
        const message = '筋トレをした種目を教えてください。';
        this.emit(':ask', message, message);
    }
};

const weightModeHandlers = Alexa.CreateStateHandler(states.TRANINGWEIGHTMODE, {
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'もう一度お願いします。', 'もう一度お願いします。');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'WeightIntent': function () {
        this.handler.state = states.TRANINGAMOUNTMODE;
        const weight = this.event.request.intent.slots.Weight.value;
        this.attributes['weight'] = weight;
        this.emit(':ask', weight + 'キログラムですね。次に回数を教えてください。');
    },
    'Unhandled': function() {
        const message = '重さ・ウェイトをキログラム単位で教えてください';
        this.emit(':ask', message, message);
    }
});

const amountModeHandlers = Alexa.CreateStateHandler(states.TRANINGAMOUNTMODE, {
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'もう一度お願いします。', 'もう一度お願いします。');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AmountIntent': function () {
        this.handler.state = states.TRANINGSETCOUNTMODE;
        const amount = this.event.request.intent.slots.Amount.value;
        this.attributes['amount'] = amount;
        this.emit(':ask', amount + '回ですね。最後にセット数を教えてください。');
    },
    'Unhandled': function() {
        const message = '回数を教えてください';
        this.emit(':ask', message, message);
    }
});

const setCountModeHandlers = Alexa.CreateStateHandler(states.TRANINGSETCOUNTMODE, {
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'もう一度お願いします。', 'もう一度お願いします。');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'SetIntent': function () {
        const setcount = this.event.request.intent.slots.SetCount.value;
        this.attributes['setcount'] = setcount;
        
        const name = this.attributes['name'];
        const weight = this.attributes['weight'];
        const amount = this.attributes['amount'];
        
        this.handler.state = states.TRANINGSAVEMODE;
        this.emit(':ask', name + 'を' + weight + 'キログラムで' + amount + '回' + setcount + 'セットですね。記録しますか？');
    },
    'Unhandled': function() {
        const message = 'セット数を教えてください';
        this.emit(':ask', message, message);
    }
});

const saveModeHandlers = Alexa.CreateStateHandler(states.TRANINGSAVEMODE, {
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'もう一度お願いします。', 'もう一度お願いします。');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', '終了します。');
    },
    'AMAZON.YesIntent': function () {
    this.handler.state = '';
        this.emit(':', '了解しました。記録しました。');
    },
    'AMAZON.NoIntent': function () {
    this.handler.state = '';
        this.emit(':tell', '了解しました。記録せずに終了します。');
    },
});