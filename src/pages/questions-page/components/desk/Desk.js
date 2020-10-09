import {Component} from '../../../../classes/Component'
import {getData, onClickAnsw} from './desk.worker'

export class Desk extends Component {
    constructor() {
        super()
        this.name = 'desk'
        this.btnId = 'questionButton'
    }

    async getComponent() {
        super.getComponent()
        this.component = await this.getServerData()
        return new Promise(resolve => {
            resolve(this.component)
        })
    }

    init() {
        super.init()
        const $answBtn = document.getElementById('questionButton')
        $answBtn.addEventListener('click', onClickAnsw, false)
    }

    async getServerData() {
        const locData = {id: 1}
        const data = await getData(locData.id)
        const deskData = JSON.parse(data)
        const deskAnswers = JSON.parse(deskData.answers)
        let deskAnswersHtml = ''
        // const deskAnswersDom = []
        deskAnswers.forEach((answer, itt) => {
            // deskAnswersDom[itt] = document.createElement('input')
            // deskAnswersDom[itt].id = `q${itt}`
            // deskAnswersDom[itt].class = 'js-answRad'
            // deskAnswersDom[itt].value = answer.id
            // deskAnswersDom[itt].name = 'answer'
            // deskAnswersDom[itt].type = 'radio'
            // deskAnswersDom[itt].setAttribute('data-questionid', deskData.id)
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

        return `
                <div id="${this.name}" class="desk">
                    <div class="desk-quastion">${deskData.question}</div>
                    <div class="desk-asnswers">
                        ${deskAnswersHtml}
                    </div>
                </div>
                <button 
                    id="${this.btnId}" 
                    class="btn" 
                    data-type="submit"
                >Подтвердить</button>
            `
    }
}
