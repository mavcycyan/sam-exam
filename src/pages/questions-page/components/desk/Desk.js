import {Component} from '../../../../classes/Component'
import {getData} from './desk.worker'

// import {toLS} from './desk.worker'

export class Desk extends Component {
    constructor() {
        super()
    }

    async getComponent() {
        super.getComponent()
        this.component = await this.getServerData()
        return new Promise(resolve => {
            resolve(this.component)
        })
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
                             data-questionid="${deskData.id}">
                        <label for="q${itt}">
                            <span>${answer.text}</span>
                        </label>
                    </div>
                `
        })
        return `
                <div class="desk">
                    <div class="desk-quastion">${deskData.question}</div>
                    <div class="desk-asnswers">
                        ${deskAnswersHtml}
                    </div>
                </div>
                <button class="btn">Подтвердить</button>
            `
    }
}
