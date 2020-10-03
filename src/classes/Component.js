export class Component {
    constructor() {
        this.component = ''
    }

    getComponent() {
        return new Promise(resolve => {
            resolve(this.component)
        })
    }
}
