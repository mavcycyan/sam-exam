import {Component} from '../../../../classes/Component'
import {getData, onClickAnsw} from './desk.worker'

export class Desk extends Component {
    constructor() {
        super()
        this.name = 'desk'
        this.btnId = 'questionButton'
        this.answBtn = {}
    }

    async getComponent() {
        super.getComponent()
        this.component = await this.getServerData()
        return new Promise(resolve => {
            resolve({component: this.component, init: this.init})
        })
    }

    init() {
        super.init()
        const $answBtn = document.getElementById('questionButton')
        $answBtn.addEventListener('click', onClickAnsw, false)
    }

    destroy() {
        const $answBtn = document.getElementById('questionButton')
        $answBtn.removeEventListener('click', onClickAnsw, false)
    }

    async getServerData() {
        const locData = {id: 1}
        const data = await getData(locData.id)
        const deskData = JSON.parse(data)
        const deskAnswers = JSON.parse(deskData.answers)
        let deskAnswersHtml = ''
        deskAnswers.forEach((answer, itt) => {
            deskAnswersHtml += `
                    <div class="answer">
                        <input id="q${itt}" type="radio"
                             value="${answer.id}" name="answer"
                             data-questionid="${deskData.id}"
                             class="js-answRad">
                        <label for="q${itt}">
                            <span>${answer.text}</span>
                        </label>
                    </div>
                `
        })

        const $answBtn = document.createElement('button')
        $answBtn.id = this.btnId
        $answBtn.className = 'btn'
        $answBtn.setAttribute('data-type', 'submit')
        $answBtn.innerHTML = 'Подтвердить'


        return `
                <div id="${this.name}" class="desk">
                    <div class="desk-quastion">${deskData.question}</div>
                    <div class="desk-asnswers">
                        ${deskAnswersHtml}
                    </div>
                </div>
                ${$answBtn.outerHTML}
            `
    }
}
