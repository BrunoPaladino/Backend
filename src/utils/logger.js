import winston from 'winston'

const customLevelOptions = {
    levels:{
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors:{
        debug: 'white',
        http: 'white',
        info: 'blue',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red'
    }
}

const developmentLogger = winston.createLogger({
    levels :customLevelOptions.levels,
    transports: [               //donde se almacenan los transportes
        new winston.transports.Console({level: 'debug'}),       //el logger muestra en consola a partir del nivel debug
        new winston.transports.File({           //el logger envia informacion a partir del nivel error
            filename: './errors.log',
            level: 'error'})
    ]
})


const productionLogger = winston.createLogger({
    levels :customLevelOptions.levels,
    transports: [               //donde se almacenan los transportes
        new winston.transports.Console({level: 'info'}),       //el logger muestra en consola a partir del nivel info
        new winston.transports.File({           //el logger envia informacion a partir del nivel error
            filename: './errors.log',
            level: 'error'})
    ]
})

export const addDevelopmentLogger = (req, res, next)=>{
    req.developmentLogger = developmentLogger;      //de esta forma para llamar al logger uso req.developmentLogger y puedo diferenciar del productionLogger
    req.developmentLogger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString}`)
    next()
}

export const addProductionLogger = (req, res, next)=>{
    req.productionLogger = productionLogger;
    req.productionLogger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleTimeString()}`)
    next()
}