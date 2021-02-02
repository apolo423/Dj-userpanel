var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require("body-parser");
var timeout = require('connect-timeout');
const logger = require('./logger');

require('moment-timezone');

function difference_to_utc() {
    // return 2 hours or 3 hours if DST
    return 60 * 60 * (2 + moment().tz('EET').isDST())
}

function get_timezone() {
    // return 2 hours or 3 hours if DST
    return (2 + moment().tz('EET').isDST()).toString(); // possibly it need to be 2-
}

var moment = require('moment');
require('moment-duration-format');

var get_ip = require('ipware')().get_ip;

require('dotenv-safe').load();
var redis_config = {
    db: process.env.REDIS_DB,
};

if (process.env.REDIS_PASSWORD !== 'null') {
    redis_config.password = process.env.REDIS_PASSWORD;
    redis_config.host = process.env.REDIS_HOST;
}

const redis = require("redis").createClient(redis_config);

const {
    promisify
} = require('util');
const getAsync = promisify(redis.get).bind(redis);
const smembersAsync = promisify(redis.smembers).bind(redis);

process.on('warning', e => console.warn(e.stack));

var io = require('socket.io')(server, {
    path: '/api'
});

var io_redis = require('socket.io-redis');
io.adapter(io_redis(redis_config));

io.on('connection', function(socket) {
    // logger.info('receive connection');

    socket.on('start_symbol', start_symbol);
    socket.on('time', time);
    socket.on('config', get_config);
    socket.on('symbols', get_symbol);
    socket.on('get_symbols', get_symbols);

    socket.on('history', get_history);
    socket.on('quotes', quotes);
    socket.on('symbol_info', symbol_info);
    socket.on('search', search);
    socket.on('marks', marks);
    socket.on('timescale_marks', marks);
    socket.on('patterns', patterns);
    socket.on('save_patterns', save_patterns);
    socket.on('delete_patterns', delete_patterns);

    socket.on('room', function(room) {
        socket.join(room);
    });

    socket.on('leaveroom', function(room) {
        socket.leave(room);
    });
});

var jobs = [];

var request = require("request");

process.on('message', function(message) {

    switch (message.type) {
        case 'port':
            server.listen(message.port, '127.0.0.1');
            break;

        case 'get_jobs':
            return_jobs(message);
            break;

        case 'get_jobs_length':
            return_jobs_length(message);
            break;
    }
});

function return_jobs_length(message) {
    var index = jobs.findIndex(function(el) {
        return el.id == message.id;
    })

    if (index > -1) {
        jobs[index].response.end(message.jobs_length.toString());
        jobs.splice(index, 1);
    }
}

function return_jobs(message) {
    var index = jobs.findIndex(function(el) {
        return el.id == message.id;
    })

    if (index > -1) {
        jobs[index].response.end(message.jobs_string);
        jobs.splice(index, 1);
    }
}

function transform_timezone(key = '0') {
    let timezones = {
        '-3': 'America/Argentina/Buenos_Aires',
        '-3': 'America/Sao_Paulo',
        '-5': 'America/Bogota',
        '-5': 'America/New_York',
        '-5': 'America/Toronto',
        '0': 'UTC',
        '1': 'Europe/London',
        '1': 'Europe/Berlin',
        '1': 'Europe/Madrid',
        '1': 'Europe/Paris',
        '1': 'Europe/Warsaw',
        '1': 'Europe/Zurich',
        '2': 'Africa/Johannesburg',
        '2': 'Europe/Athens',
        '3': 'Europe/Moscow',
        '3': 'Europe/Istanbul',
        '3.30': 'Asia/Tehran',
        '4': 'America/Caracas',
        '4': 'Asia/Dubai',
        '5': 'Asia/Ashkhabad',
        '5.30': 'Asia/Kolkata',
        '5.45': 'Asia/Kathmandu',
        '6': 'America/Chicago',
        '6': 'America/El_Salvador',
        '6': 'America/Mexico_City',
        '6': 'Asia/Almaty',
        '7': 'America/Phoenix',
        '7': 'Asia/Bangkok',
        '7': 'US/Mountain',
        '8': 'America/Los_Angeles',
        '8': 'America/Vancouver',
        '8': 'Asia/Hong_Kong',
        '8': 'Asia/Shanghai',
        '8': 'Asia/Singapore',
        '8': 'Asia/Taipei',
        '9': 'Asia/Seoul',
        '9': 'Asia/Tokyo',
        '9.30': 'Australia/Adelaide',
        '10': 'Australia/Brisbane',
        '10': 'Australia/Sydney',
        '10': 'Pacific/Honolulu',
        '12': 'Pacific/Auckland',
        '12.45': 'Pacific/Chatham',
        '13': 'Pacific/Fakaofo',
        // 'Australia/ACT'
    }
    return timezones[key];
}

function get_symbol(data) {
    let socket = this;
    //GBPCAD|PEPPERSTONE|1|900"
    let symbol_name = data.symbol;

    //PEPPERSTONE:PEPPERSTONE:GBPCAD:M15
    // может быть 2 раза указан брокер
    if (symbol_name.indexOf(':') > -1) {
        if (symbol_name.match(/:/g).length > 2) {
            let colon = symbol_name.split(':');

            symbol_name = colon[colon.length - 3] + ':' + colon[colon.length - 2] + ':' + colon[colon.length - 1];
        }
    } else {
        symbol_name = get_name_from_ticker(symbol_name);
    }

    redis.get(`symbols:${symbol_name}`, async function(error, symbol_json) {

        if (error) {
            logger.info('error on get symbol by name', symbol_name);
        }

        let symbol = JSON.parse(symbol_json);
        let pricescale = 100000;
        if (
            symbol.name.indexOf('JPY') > -1 ||
            symbol.name.indexOf('XAU') > -1
        ) {
            pricescale = 1000;
        }
        let symbol_name_splitted = symbol.name.split(':');

        let answer = {};
        answer["name"] = symbol.name;
        answer["ticker"] = symbol.ticker;
        answer["description"] = symbol_name_splitted[1];
        answer["type"] = 'forex';
        answer["session"] = detect_symbol_type(symbol_name) == 'CRYPTO' ? "24x7" : "0000-2400:23456"
        answer["exchange"] = symbol_name_splitted[0]; //2100-2400:1|0000-2400:2|0000-2400:3456
        answer["exchange-listed"] = symbol_name_splitted[0];
        answer["timezone"] = transform_timezone(get_timezone()); //"Europe/London";
        answer["pricescale"] = pricescale;
        answer["minmov"] = 1;
        answer["has_intraday"] = true;
        answer["has_seconds"] = false;
        answer["has_daily"] = true;
        answer["has_empty_bars"] = false;
        answer["force_session_rebuild"] = true;
        answer["has_no_volume"] = false;

        let symbols = await smembersAsync('symbols:lookup:all_symbols');
        let pair = symbol_name.split(':')[1].toUpperCase()

        answer["supported_resolutions"] = Object
            .values(symbols)
            .filter(name => {
                return name.toUpperCase().includes(pair)
            })
            .map(name => {
                let timeframe = name.split(':')[2];
                return timeframe2interval(timeframe);
            })

        // logger.info('symbols', answer);
        socket.emit('symbols', answer);
    });
}

function get_symbols(data) {

    let socket = this;
    let answer = [];
    let pattern_name = data.pattern;

    let symbols = [];
    redis.hkeys(`patterns:admin:${pattern_name}`, function(error, patterns_name) {
        patterns_name = Object.values(patterns_name);
        redis.hgetall('symbols:lookup:time', async function(error, id_and_d) {
            if (error) {
                logger.info('error on get_symbols', error);
            }

            for (let symbol_name in id_and_d) {
                if (symbol_name.indexOf(pattern_name) == -1) {
                    continue
                }

                let symbol = JSON.parse(id_and_d[symbol_name]);
                let pattern = await getAsync(`patterns:${pattern_name}:${symbol.full_name}`);
                logger.log('pattern', pattern);
                pattern = JSON.parse(pattern) || [];
                pattern
                    .forEach(item => {
                        symbols.push({
                            name: symbol.full_name,
                            tid: item.tid,
                            price: item.price,
                            time: item.time,
                            utc2: item.utc2,
                            trend: item.trend,
                            notes: item.notes,
                            exec: item.exec,
                            tp: item.tp,
                            tp2: item.tp2,
                            tp3: item.tp3,
                            sl: item.sl,
                            has_master: patterns_name.includes(symbol.full_name),
                            id: item.id,
                        });
                    })
            }

            let time = moment();
            let now = moment();

            symbols
                .sort(function(a, b) {
                    return b.time - a.time;
                })
                .forEach(function(symbol) {
                    time = moment.unix(symbol.time)
                    answer.push({
                        symbol_name: symbol.name.split(':')[1],
                        name: symbol.name,
                        tid: symbol.tid,
                        timeframe: symbol.name.split(':')[2],
                        price: symbol.price,
                        utctime: time.utc().format('YYYY-MM-DD HH:mm:ss'),
                        utc2: symbol.utc2,
                        localtime: moment.utc(symbol.dt).local().format('YYYY-MM-DD HH:mm:ss'),
                        agotime: moment.duration(now.diff(time)).format("h:mm"),
                        notes: symbol.notes,
                        trend: symbol.trend,
                        has_master: symbol.has_master,
                        exec: symbol.exec,
                        tp: symbol.tp,
                        tp2: symbol.tp2,
                        tp3: symbol.tp3,
                        sl: symbol.sl,
                        id: symbol.id,
                    });
                });
            socket.emit('get_symbols', answer);
        });
    });
}

function symbol_info(data) {
    let socket = this;
    // logger.info('receive message symbol_info', data);
    redis.hgetall('symbols:lookup:time', function(error, symbols) {

        if (error) {
            logger.info('error getting symbols for make jobs ');
        }

        if (!symbols || symbols.length == 0) {
            logger.info('error for make jobs symbols Array is empty ');
        }

        let answer = {};
        answer["symbol"] = [];
        answer["ticker"] = [];
        answer["description"] = [];
        answer["type"] = 'forex';
        answer["session"] = [];
        answer["exchange"] = data.group;
        answer["exchange-listed"] = data.group;
        answer["timezone"] = transform_timezone(get_timezone()); //"Europe/London";
        answer["pricescale"] = [];
        answer["minmov"] = 1;
        answer["has_intraday"] = true;
        answer["supported_resolutions"] = ["1", "5", "15", "30", "60", "240", "1D", "1M"];
        answer["has_seconds"] = false;
        answer["has_daily"] = true;
        answer["has_empty_bars"] = false;
        answer["force_session_rebuild"] = true;
        answer["has_no_volume"] = false;
        answer["s"] = 'ok';

        for (let symbol_name in symbols) {
            if (symbol_name) {
                answer["symbol"].push(symbol_name);
                answer["ticker"].push(get_ticker_from_name(symbol_name));
                answer["description"].push(symbol_name);
                answer["session"].push(detect_symbol_type(symbol_name) == 'CRYPTO' ? "24x7" : "0000-2400:23456");

                let pricescale = 100000;
                if (
                    symbol_name.indexOf('JPY') > -1 ||
                    symbol_name.indexOf('XAU') > -1
                ) {
                    pricescale = 1000;
                }
                answer["pricescale"].push(pricescale);
            } else {
                logger.info('empty symbol', prop, symbols);
            }
        }

        // logger.info('symbol_info', answer);
        socket.emit('symbol_info', answer);
    });
}

function start_symbol(data) {
    let socket = this;
    let type = data.type;
    //получить все точки д 
    //получить максимальный точку 
    // по ид получить символ 
    let symbol_name = '';
    let max_time = 0;
    redis.hgetall('symbols:lookup:time', async function(error, id_and_d) {
        if (error) {
            logger.info('error on get new symbol', id_and_d);
        }
        Object
            .keys(id_and_d)
            .filter(name => name.indexOf(type) > -1)
            .forEach(name => {
                let item = JSON.parse(id_and_d[name]);
                if (item.time > max_time) {
                    symbol_name = name;
                    max_time = item.time;
                }
            })


        var splitted = symbol_name.split(',');

        let pattern = await getAsync(`patterns:${splitted[0]}`);
        let most_recent_pattern = (JSON.parse(pattern) || [])
            .reduce((accumulator, currentValue) => {
                if (accumulator.time < currentValue.time) {
                    return currentValue
                }
                return accumulator
            }, {
                time: 0
            })

        socket.emit('start_symbol', {
            name: splitted[0],
            timeframe: splitted[0].split(':')[2],
            ticker: get_ticker_from_name(splitted[0]),
            id: most_recent_pattern.id,
        });
    });
}

function get_history(data) {
    // logger.info('get history', data);
    let socket = this;

    let query = {
        ticker: data.symbol, //EURJPY|JAFX|1|900
        broker: data.symbol.split('|')[1],
        symbol: data.symbol.split('|')[0].toUpperCase(),
        timeframe: timeframe_back(data.symbol.split('|')[3]),
        from: data.from,
        to: data.to,
    };

    // получаем историю символа 
    redis.zrangebyscore(`ticks:${query.broker}:${query.symbol}:${query.timeframe}`, query.from, query.to, function(error, ticks) {
        if (error) {
            logger.info('error on get ticks by symbol ', error);
        }

        let answer = {
            t: [],
            c: [],
            o: [],
            h: [],
            l: [],
            v: [],
            s: "no_data",
        };

        ticks.forEach(function(data) {
            let tick = JSON.parse(data);
            answer.t.push(tick.t);
            answer.c.push(tick.c);
            answer.o.push(tick.o);
            answer.h.push(tick.h);
            answer.l.push(tick.l);
            answer.v.push(tick.v);
        });

        if (ticks.length > 0) {
            answer.s = 'ok';
            // // если для запроса не хватает тиков  создать задание
            // let first_tick_t = JSON.parse(ticks[0]).t;
            // let last_tick_t = JSON.parse(ticks[ticks.length - 1]).t;

            // if (query.from < first_tick_t) {
            //     process.send({
            //         from: query.from,
            //         to: first_tick_t,
            //         ticker: query.ticker,
            //         broker_id: broker_id,
            //         type: 'add_job',
            //     });
            // }
            // if (query.to > last_tick_t) {
            //     process.send({
            //         from: last_tick_t,
            //         to: query.to,
            //         ticker: query.ticker,
            //         broker_id: broker_id,
            //         type: 'add_job',
            //     });
            // }
        } else {
            let broker_name = query.ticker.split('|')[1];

            logger.info('not found ticks', query.ticker, query.from, query.to);
            //  узнаем ближайший тик к from 
            // если тика нет то создаем задание от from
            // узнаем ближайший тик к to
            // если тика нет то создаем задание до to

            redis.zrevrangebyscore(`ticks:${query.broker}:${query.symbol}:${query.timeframe}`, query.from, '-inf', 'limit', 0, 1, function(error, ticks) {
                if (error) {
                    logger.info('error getting first tick', `ticks:${query.broker}:${query.symbol}:${query.timeframe}`);
                }
                // история по символу не пустая 
                // создаем задание 
                if (ticks.length > 0) {
                    let tick = JSON.parse(ticks[0]);
                    query.from = tick.t;
                    logger.info('have one tick from', tick.t);
                } else {
                    query.from = moment.unix(query.from).subtract(3, 'months').unix(); // - 3 месяца
                    logger.info('not have ticks from', query.from);
                }

                redis.zrangebyscore(`ticks:${query.broker}:${query.symbol}:${query.timeframe}`, query.to, '+inf', 'limit', 0, 1, function(error, ticks) {
                    if (error) {
                        logger.info('error getting last tick', `ticks:${query.broker}:${query.symbol}:${query.timeframe}`);
                    }
                    // история по символу не пустая 
                    // создаем задание 
                    if (ticks.length > 0) {
                        let tick = JSON.parse(ticks[0]);
                        query.to = tick.t;
                        logger.info('have one tick to', tick.t);
                    }

                    let ticker = [];
                    let symbol = query.ticker.split('|')[0]

                    if (symbol.slice(-1) == 'I') {
                        symbol = symbol.slice(0, -1) + 'i';
                    }

                    ticker.push(symbol);
                    ticker.push(query.ticker.split('|')[1]);
                    ticker.push(1);
                    ticker.push(query.ticker.split('|')[3]);

                    var new_job = {
                        from: query.from,
                        to: query.to,
                        ticker: ticker.join('|'), //GBPNZD|PEPPERSTONE|1|300 
                        broker: broker_name,
                        type: 'add_job',
                    };

                    process.send(new_job);
                });
            });

        }
        socket.emit('history', answer);
    });
}

function change_broker_name(string) {
    return string
        .replace(/JAFX Ltd./g, "JAFX")
        .replace(/FXCM Australia Pty. Limited/g, "FXCM")
        .replace(/Hugo's Way Ltd./g, "HUGOS WAY")
}

function get_job(request, response) {

    let broker = change_broker_name(request.query.broker);

    if (broker == undefined) {
        logger.info('on get job broker null ');
        response.send("none");

        return 0;
    }

    let id = Math.random().toString();
    jobs.push({
        response: response,
        broker: broker,
        id: id,
    });

    process.send({
        type: 'get_jobs',
        broker: broker,
        id: id,
    });
}

// ?ticker=GBPJPYi|TW Corp.|0|86400&data=time|open|close|high|low|volume;time|open|close|high|low|volume;
function send_job(request, response) {
    var data = JSON.parse(request.body.data);
    if (data.length == 0) {
        logger.info('receive empty answer from expert');
    }

    let difference_utc = difference_to_utc();

    data.forEach(function(element) {
        var tick_name = change_broker_name(element.ticker.split('|')[1]) +
            ':' +
            element.ticker.split('|')[0].toUpperCase() +
            ':' +
            timeframe_back(element.ticker.split('|')[3]);

        if (tick_name == "") {
            logger.info('ticker empty ', data);
        }

        let ticks_string = element.data;
        let ticks = ticks_string.split(';');
        ticks.pop(); // удаляем последний пустой элемент
        //определяем мин и макс время 
        if (ticks.length > 0) {
            let min = ticks[0].split('|')[0] - difference_utc;
            let max = ticks[ticks.length - 1].split('|')[0] - difference_utc;

            // удаляем тики которые есть в базе для замены на те что пришли 
            redis.zremrangebyscore("ticks:" + tick_name, min, max, function(error, count) {
                if (error) {
                    logger.info('error on remove ticks', error);
                }
                let batch = redis.batch();
                ticks.forEach(function(tick_data, index, array) {
                    let data = tick_data.split('|');
                    let tick = {};
                    tick.t = data[0] * 1 - difference_utc;
                    tick.o = data[1] * 1;
                    tick.c = data[2] * 1;
                    tick.h = data[3] * 1;
                    tick.l = data[4] * 1;
                    tick.v = data[5] * 1;
                    if (tick.t > 0) {
                        batch.zadd("ticks:" + tick_name, tick.t, JSON.stringify(tick), function(error, reply) {
                            if (error) {
                                logger.info('error on add tick', error);
                            }
                        });
                    }
                })
                batch.exec();
            });
        }
    });
    response.end('ok');
}

function patterns(data) {
    var socket = this;

    //JAFX:EURGBP,M15,DEEP BAT

    var symbol = data.symbol;
    var type = data.type;
    var pattern_id = data.id;
    if (symbol == undefined || symbol == '') {
        logger.info('ticker undefined on pattern request', data);
        socket.emit('patterns', {
            "s": "no_data"
        });
    } else {
        if (symbol.indexOf(':') == -1) {
            // logger.info('get_name_from_ticker', symbol);
            symbol = get_name_from_ticker(symbol);
        }
        // patterns:FXCHOICE:AUDJPY:M15
        symbol = symbol.split(',')[0];

        redis.get(`patterns:${type}:${symbol}`, function(error, pattern_json) {
            if (error) {
                logger.info('error on get pattern', symbol);
            }

            redis.hget(`patterns:admin:${type}`, symbol, function(error, admin_patterns_json) {

                let master = JSON.parse(admin_patterns_json) || [];

                let pattern = (JSON.parse(pattern_json) || [])
                    .filter(item => item.id == pattern_id);

                socket.emit('patterns', {
                    expert: pattern,
                    master: master,
                    s: 'ok',
                });
            });
        });
    }
}

function save_patterns(data) {
    let socket = this;
    var token = data.token;
    var type = data.type;

    // log('all ok save pattern', data.data);
    let symbol = data.symbol.split(':').slice(-3).join(':');
    let patterns = data.data.filter(item => item.points.length > 0);
    let patterns_failed = data
        .data
        .filter(item => item.points.length == 0)
        .reduce((accumulator, currentValue) => accumulator + currentValue.type + ',', '');

    if (patterns_failed.length > 0) {
        logger.info('on save patterns found empty patterns', patterns_failed)
        socket.emit('save_patterns', {
            "s": 'Empty Objects:' + patterns_failed,
        })
    }
    if (patterns.length > 0) {
        // отправляем сообщение о том что мастер отправил паттерны  на этот символ
        logger.info('save master patterns', symbol);
        redis.hset(`patterns:admin:${type}`, symbol, JSON.stringify(patterns));
        socket.emit('refresh_menu')
    }
}

function delete_patterns(data) {
    let socket = this;
    let type = data.type;
    let symbol = data.symbol.split(':').slice(-3).join(':');
    // удаляем 
    logger.info('master delete pattern', symbol);
    redis.hdel(`patterns:admin:${type}`, symbol);
}

function get_config(data) {
    // logger.info('get_config');
    let socket = this;
    let answer = {
        "supports_search": true,
        "supports_group_request": false,
        "supports_marks": false,
        "supports_time": true,
        "supported_resolutions": ["1", "5", "15", "30", "60", "240", "1D", "1M"],
        "exchanges": [{
            value: "",
            name: "All Exchanges",
            desc: "",
        }],
        "symbol_types": [{
            "name": 'All types',
            "value": "",
        }, {
            "name": 'Forex',
            "value": "forex",
        }]
    };

    let brokers = [];
    redis.hgetall('symbols:lookup:time', function(error, symbols) {

        for (let symbol in symbols) {
            let broker = symbol.split(':')[0];
            if (!brokers.includes(broker)) {
                brokers.push(broker);
                answer.exchanges.push({
                    value: broker,
                    name: broker,
                    desc: broker,
                });
            }
        }
        socket.emit('config', answer);
    });
}

function search(data) {
    let socket = this;
    let answer = [];
    let symbols = [];
    let exchange = data.exchange;
    let symbol_name = data.query;

    redis.hgetall('symbols:lookup:time', function(error, symbols_all) {

        for (let symbol in symbols_all) {
            symbols.push({
                name: symbol.split(',')[0],
                time: symbols_all[symbol],
            });
        }

        symbols
            .filter(function(symbol) {
                return symbol.name.toUpperCase().indexOf(exchange.toUpperCase()) > -1 &&
                    symbol.name.toUpperCase().indexOf(symbol_name.toUpperCase()) > -1;
            })
            .sort(function(a, b) {
                return b.time - a.time;
            })
            .forEach(function(symbol) {
		let symbol_splited = symbol.name.split(',')[0].split(':');
                answer.push({
                    symbol: symbol_splited[1] + ' ' + symbol_splited[2],
                    full_name: symbol.name,
                    description: '',
                    exchange: symbol_splited[0],
                    type: 'forex',
                });
            });
        socket.emit('search', answer);
    });
}

function get_ticker_from_name(name) {
    // FXCHOICE:EURJPY:H4
    let name_array = name.split(':');
    let time_frame = timeframe(name_array[2]);
    return name_array[1] + '|' + name_array[0] + '|1|' + time_frame;
}

function get_name_from_ticker(ticker) {
    var arr = ticker.split('|');
    return change_broker_name(arr[1]) + ':' + arr[0] + ':' + timeframe_back(arr[3]);
}

function timeframe_back(timeframe) {
    switch (timeframe) {
        case '60':
            return 'M1';
            break;
        case '300':
            return 'M5';
            break;
        case '900':
            return 'M15';
        case '1800':
            return 'M30';
            break;
        case '3600':
            return 'H1';
            break;
        case '14400':
            return 'H4';
            break;
        case '86400':
            return 'D1';
            break;
        case '2592000':
            return '1M';
            break;
    }
}

function timeframe2interval(timeframe) {
    // ["1", "5", "15", "30", "60", "240", "1D", '1M']
    switch (timeframe) {
        case 'M1':
            return '1';
            break;
        case 'M5':
            return '5';
            break;
        case 'M15':
            return '15';
            break;
        case 'M30':
            return '30';
            break;
        case 'H1':
            return '60';
            break;
        case 'H4':
            return '240';
            break;
        case 'D1':
            return '1D';
            break;
    }
}

function detect_symbol_type(symbol_name) {
    var crypto = [
        'BCH',
        'BIT',
        'BTC',
        'DASH',
        'EDO',
        'EOS',
        'ETH',
        'ETP',
        'IOT',
        'LTC',
        'NEO',
        'OMG',
        'SAN',
        'TRX',
        'XMR',
        'XPD',
        'XRP',
        'ZEC',
    ];

    var contains = crypto.some(function(name) {
        //console.log('--',symbol,name,symbol.includes(name))
        return symbol_name.includes(name);
    })

    if (contains) {
        return 'CRYPTO';
    }
    return 'FOREX';
}

function timeframe(timeframe) {
    switch (timeframe) {
        case 'M1':
            return '60';
            break;
        case 'M5':
            return '300';
            break;
        case 'M15':
            return '900';
            break;
        case 'M30':
            return '1800';
            break;
        case 'H1':
            return '3600';
            break;
        case 'H4':
            return '14400';
            break;
        case 'D1':
            return '86400';
            break;
        case '1M':
            return '2592000';
            break;
    }
}

function job_length(request, response) {
    let id = Math.random().toString();
    jobs.push({
        response: response,
        id: id,
    });

    process.send({
        type: 'get_jobs_length',
        id: id,
    });
}

function get_symbols_for_realtime(request, response) {
    let broker = change_broker_name(request.query.broker);
    redis.smembers('symbols:lookup:all_symbols', function(error, symbols_all) {
        let answer = [];
        symbols_all.filter(function(symbol) {
                return symbol.toUpperCase().indexOf(broker.toUpperCase()) > -1;
            })
            .forEach(function(symbol) {
                let symbols_arr = symbol.split(':');
                if (symbols_arr[1].slice(-1) == 'I') {
                    symbols_arr[1] = symbols_arr[1].slice(0, -1) + 'i';
                }
                answer.push(`${symbols_arr[1]},${symbols_arr[2]}`);
            });

        response.end(answer.join('|'));
    });
}

function get_tick(request, response) {
    //   symbol_name|open|close|high|low|volume;
    //EURUSD,H1|1.24224;EURAUD,M15|1.56729;
    let now = moment().valueOf();
    let ticks = request.body.data.split(';');
    ticks.pop();
    let broker = change_broker_name(request.body.broker);

    let symbols = [];

    ticks.forEach(function(tick) {
        let data = tick.split('|');
        let symbol_name = data[0].split(',')[0].toUpperCase();
        let timeframe = data[0].split(',')[1].toUpperCase();

        let room_name = `${broker}:${symbol_name}:${timeframe}`;
	if (
             data[1] * 1 > 0 &&
             data[2] * 1 > 0 &&
             data[3] * 1 > 0 &&
             data[4] * 1 > 0
         ) {
        io.to(room_name).emit(room_name, {
            time: now,
            close: data[2] * 1,
            open: data[1] * 1,
            high: data[3] * 1,
            low: data[4] * 1,
            // volume: data[5] * 1,
        });
}
    })
    response.end('ok');
}

function time(data) {
    let socket = this;
    let current_timestamp = moment().unix();
    socket.emit('time', current_timestamp.toString());
}

function marks(request, response) {
    let socket = this;
    socket.emit('marks', [{}]);
}

function timescale_marks(request, response) {
    let socket = this;
    socket.emit('timescale_marks', [{}]);
}

function quotes(data) {
    let socket = this;
    socket.emit('quotes', {});
}

function haltOnTimedout(request, response, next) {
    if (!request.timedout) {
        next();
    }
}

function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(err.inner).end();
    } else {
        logger.info('error 500 ', err.inner);
        res.status(500).end(err.inner);
    }
}

app.use(timeout('3s'));
app.use(haltOnTimedout);

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(bodyParser.json({
    limit: '50mb'
})); // support json encoded bodies

app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.get('/', function(request, response) {
    response.end(' Hello!!');
});

app.get('/job_length', job_length);
app.get('/get_job', get_job);
app.get('/get_symbols_for_realtime', get_symbols_for_realtime);
app.post('/get_tick', get_tick);
app.post('/send_job', send_job);

app.use(errorHandler);
