class TinyVue {
    constructor({ el, data, methods }) {
        this.$data = data
        this.$el = document.querySelector(el)
        this.$methods = methods
        this._compile()
        this._updater()
        this._watcher()
    }
    _watcher(data = this.$data) {
        let that = this
        Object.keys(data).forEach(i => {
            let value = data[i]
            Object.defineProperty(data, i, {
                enumerable: true,
                configurable: true,
                get: function() {
                    return value;
                },
                set: function(newVal) {
                    if (value !== newVal) {
                        value = newVal;
                        that._updater()
                    }
                }
            })
        })
    }
    _initEvents(el, attr, callBack) {
        this.$el.querySelectorAll(el).forEach(i => {
            if (i.hasAttribute(attr)) {
                let key = i.getAttribute(attr)
                callBack(i, key)
            }
        })
    }
    _initView(el, attr, callBack) {
        this.$el.querySelectorAll(el, attr, callBack).forEach(i => {
            if (i.hasAttribute(attr)) {
                let key = i.getAttribute(attr),
                    data = this.$data[key]
                callBack(i, key, data)
            }
        })
    }
    _updater() {
        this._initView('input, textarea', 'v-model', (i, key, data) => {
            i.value = data
        })
        this._initView('select', 'v-model', (i, key, data) => {
            i.querySelectorAll('option').forEach(v => {
                if (v.value == data) v.setAttribute('selected', true)
                else v.removeAttribute('selected')
            })
        })
        let regExpInner = /\{{ *([\w_\-]+) *\}}/g
        this.$el.querySelectorAll("*").forEach(i => {
            let replaceList = i.innerHTML.match(regExpInner) || (i.hasAttribute('vueID') && i.getAttribute('vueID').match(regExpInner))
            if (replaceList) {
                if (!i.hasAttribute('vueID')) {
                    i.setAttribute('vueID', i.innerHTML)
                }
                i.innerHTML = i.getAttribute('vueID')
                replaceList.forEach(v => {
                    let key = v.slice(2, v.length - 2)
                    console.log(key)
                    i.innerHTML = i.innerHTML.replace(v, this.$data[key])
                })
            }
        })
    }
    _compile() {
        this._initEvents('*', '@click', (i, key) => {
            i.addEventListener('click', () => this.$methods[key].bind(this.$data)())
        })
        this._initEvents('input, textarea', 'v-model', (i, key) => {
            i.addEventListener('input', () => {
                Object.assign(this.$data, {
                    [key]: i.value
                })
            })
        })
        this._initEvents('select', 'v-model', (i, key) => {
            i.addEventListener('change', () => Object.assign(this.$data, {
                [key]: i.options[i.options.selectedIndex].value
            }))
        })
    }
}