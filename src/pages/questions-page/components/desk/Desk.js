import {Component} from '../../../../classes/Component'
import {fromLS, getData, onClickAnsw, onClickSort} from './desk.worker'
import {selectToCheckbox} from './desk.worker'
import {getTemplates} from './desk.templates'

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
            resolve({component: this.component, init: this.init})
        })
    }

    init() {
        super.init()
        const $answBtn = document.getElementById('questionButton')
        $answBtn.addEventListener('click', onClickAnsw, false)
        const $sortChks = document.querySelectorAll('.js-sortChk')
        const $selInput = document.querySelectorAll('.js-relSel')
        if ($sortChks.length) {
            $sortChks.forEach($el => {
                $el.addEventListener('click', onClickSort, false)
            })
        }
        if ($selInput.length) {
            $selInput.forEach($el => {
                $el.addEventListener('change', selectToCheckbox, false)
            })
        }
    }

    destroy() {
        const $answBtn = document.getElementById('questionButton')
        $answBtn.removeEventListener('click', onClickAnsw, false)
    }

    async getServerData() {
        const startId = (fromLS()) ? +fromLS()+1 : 1
        const locData = {id: startId}
        const data = await getData(locData.id)

        return getTemplates(data, this.name, this.btnId)
    }
}
