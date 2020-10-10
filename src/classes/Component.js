export class Component {
    constructor() {
        this.component = ''
    }

    init() {
    }

    destroy() {
    }

    getComponent() {
        return new Promise(resolve => {
            resolve({component: this.component, init: this.init})
        })
    }
}
