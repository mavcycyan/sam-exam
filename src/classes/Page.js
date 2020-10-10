import {preloader} from '../helpers/preloader'

export class Page {
    constructor() {
        this.componentInit = []
    }

    init() {
        this.componentInit.forEach(compInit => {
            compInit()
        })
    }

    async rendering(pageClass) {
        const layout = await this.getLayout(pageClass)
        return new Promise(resolve => {
            document.getElementById('app').append(layout)
            this.init()
            resolve()
        })
    }

    destroy() {}

    getComponents() {
        return ''
    }

    async getLayout(pageClass) {
        preloader('init')
        const $main = document.createElement('div')
        $main.className = pageClass
        const $el = document.createElement('div')
        $el.className = 'container'
        try {
            const $forRender = await this.getComponents()
            if ($forRender != '') {
                $el.innerHTML = $forRender
            }
            $main.append($el)
            return new Promise(resolve => {
                preloader('destroy')
                resolve($main)
            })
        } catch (e) {
            preloader('destroy')
            console.error(e)
            return new Promise(resolve => {
                resolve('Server is not responds')
            })
        }
    }
}
