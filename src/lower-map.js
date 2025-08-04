// 소문자 key 기반 Map
class LowerMap extends Map {

    constructor() {
        super()
    }

    key(key) {
        return key.toLowerCase()
    }

    get(key) {
        return super.get(this.key(key))
    }
    has(key) {
        return super.has(this.key(key))
    }
    set(key, value) {
        return super.set(this.key(key), value)

    }
    delete(key) {
        return super.delete(this.key(key))
    }
}

module.exports = LowerMap
