import {gettingDataPath, settingDataPath} from '../../../../configs'
import {getTemplates} from './desk.templates'
import {Desk} from './Desk'
import {preloader} from '../../../../helpers/preloader'

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
        request.send(`questionID=${questionID}&answerID=${answerID}`)
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

export function validator(nodelist, jsonValid, $button) {
    nodelist.forEach(($el) => {
        if ($el.checked) {
            const validStr = (jsonValid.isCorrect)? 'green' : 'red'
            $el.classList.add(validStr)
        } else {
            if (jsonValid.correct == $el.value) {
                $el.classList.add('green')
            }
        }
        $el.disabled = true
    })
    $button.setAttribute('data-type', 'next')
    $button.innerHTML = 'Далее'
    $button.classList.add('btn-next')
}

export function onClickAnsw() {
    const $answBtn = document.getElementById('questionButton')
    const answChk = document.querySelector('.js-answRad:checked')
    switch ($answBtn.getAttribute('data-type')) {
    case 'submit':
        if (answChk) {
            const questId = answChk.getAttribute('data-questionid')
            const answId = answChk.value
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
                console.log(answChk)
                toLS(objToLs)
            })
        } else {
            alert('Выберите нужный ответ!')
        }
        break;
    case 'next':
        nextPrev('next', +answChk.getAttribute('data-questionid') + 1)
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
