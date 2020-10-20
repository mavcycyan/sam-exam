import {gettingDataPath, settingDataPath} from '../../../../configs'
import {getTemplates} from './desk.templates'
import {Desk} from './Desk'
import {preloader} from '../../../../helpers/preloader'
import {validator} from './desk.validators'

export function getData(questionID = 1) {
    return new Promise(resolve => {
        const request = new XMLHttpRequest()
        request.open('GET', gettingDataPath + `?id=${questionID}`, false)
        request.onload = function() {
            resolve(this.responseText)
        }
        request.onerror = function() {
            console.log('Ошибка ' + this.status)
        }
        request.send()
    })
}

export function setData(questionID, answerID) {
    let answerIdPost = ''
    answerID.forEach((answ, itt) => {
        if (itt != 0) {
            answerIdPost += ','
        }
        answerIdPost += answ
    })
    return new Promise(resolve => {
        const request = new XMLHttpRequest()
        request.open('POST', settingDataPath, false)
        request.setRequestHeader(
            'Content-Type', 'application/x-www-form-urlencoded'
        )
        request.onload = function() {
            resolve(this.responseText)
        }
        request.onerror = function() {
            console.log('Ошибка ' + this.status)
        }
        request.send(`questionID=${questionID}&answerID=${answerIdPost}`)
    })
}

export function toLS(answersObj) {
    let lStor = null
    if (localStorage.getItem('answers')) {
        lStor = JSON.parse(localStorage.getItem('answers'))
        lStor.push(answersObj)
    } else {
        lStor = [
            answersObj
        ]
    }
    localStorage.setItem('answers', JSON.stringify(lStor))
}

export function onClickAnsw() {
    const $answBtn = document.getElementById('questionButton')
    const answChk = document.querySelectorAll('.js-answRad:checked')
    switch ($answBtn.getAttribute('data-type')) {
    case 'submit':
        if (answChk && answChk.length > 0) {
            let questId = ''
            const answId = []
            answChk.forEach((answ, itt) => {
                questId = answ.getAttribute('data-questionid')
                answId[itt] = answ.value
            })
            console.log(questId, answId)
            setData(questId, answId).then( data => {
                const json = JSON.parse(data)
                const answ = document.querySelectorAll('.js-answRad')
                validator(answ, json, $answBtn)
                const objToLs = {
                    question_id: questId,
                    chosen_answer_id: answId,
                    isCorrect: (json.isCorrect) ? json.isCorrect : false
                }
                if (json.correct) {
                    objToLs.correct = json.correct
                }
                console.log(data)
                console.log(answChk)
                toLS(objToLs)
            })
        } else {
            alert('Выберите нужный ответ!')
        }
        break;
    case 'next':
        nextPrev('next', +answChk[0].getAttribute('data-questionid') + 1)
        break;
    }
}

export function nextPrev(param, chkId) {
    const $answBtn = document.getElementById('questionButton')
    preloader('init')
    getData(chkId).then(data => {
        const templ = getTemplates(data, 'desk', 'questionButton')
        const templDom = document.getElementById('desk')
        templDom.outerHTML = templ
        $answBtn.remove()
        const desk = new Desk()
        desk.init()
        switch (param) {
        case 'next':
            break;
        }
    }).catch(() => {
        if (param == 'next') {
            alert('done')
        }
    }).finally(() => {
        preloader('destroy')
    })
}
