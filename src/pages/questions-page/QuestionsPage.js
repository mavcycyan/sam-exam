import {Page} from '../../classes/Page'
import {Header} from './components/header/Header'
import {Navbar} from './components/navbar/Navbar'
import {Desk} from './components/desk/Desk'

export class QuestionsPage extends Page {
    constructor() {
        super()
    }

    async getComponents() {
        super.getComponents()

        const components = []
        components[0] = new Header
        components[1] = new Navbar
        components[2] = new Desk

        const headerComponent = await components[0].getComponent()
        const navbarComponent = await components[1].getComponent()
        const deskComponent = await components[2].getComponent()

        components.forEach(component => {
            this.componentInit.push(component.init)
        })

        return headerComponent.component+''+
            navbarComponent.component+''+
            deskComponent.component
    }
}
