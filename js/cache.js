const crypto = require('crypto')

const memoize = (fn) => {
    let hash = (arg) => crypto.createHash('sha256').update(arg).digest('hex')
    let cache = {}
    return (...args) => {
        let n = hash(JSON.stringify(args))
        if (n in cache) {
            return cache[n]
        } else {
            let result = fn(n)
            cache[n] = result
            return result
        }
    }
}


