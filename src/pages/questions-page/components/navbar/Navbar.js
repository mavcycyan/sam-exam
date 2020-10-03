import {Component} from '../../../../classes/Component'

export class Navbar extends Component {
    constructor() {
        super()
        this.component = `
        <div class="navbar">
            <button class="nav_btn">&#60;</button>
            <button class="nav_btn">&#62;</button>
            <div class="progress_bar">
                <span></span>
            </div>
            <div class="steps">
                <span class="cur">0</span> / <span class="all">33</span>
            </div>
        </div>
        `
    }
}
