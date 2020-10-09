import {Page} from '../../classes/Page'
import {Header} from './components/header/Header'
import {Navbar} from './components/navbar/Navbar'
import {Desk} from './components/desk/Desk'

export class QuestionsPage extends Page {
    constructor() {
        super()
    }

    init() {
        super.init()
        const component = new Desk()
        component.init()
    }

    async getComponents() {
        super.getComponents()
        const header = new Header
        const navbar = new Navbar
        const desk = new Desk

        const headerComponent = await header.getComponent()
        const navbarComponent = await navbar.getComponent()
        const deskComponent = await desk.getComponent()

        return headerComponent+''+navbarComponent+''+deskComponent
    }
}
