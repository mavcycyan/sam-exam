export class Component {
    constructor() {
        this.component = ''
    }

    init() {
    }

    getComponent() {
        return new Promise(resolve => {
            resolve(this.component)
        })
    }
}
