import {gettingDataPath, settingDataPath} from '../../../../configs'

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
    console.log(questionID)
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
        console.log(lStor)
    } else {
        lStor = [
            answersObj
        ]
        console.log(lStor)
    }
    localStorage.setItem('answers', JSON.stringify(lStor))
}

export function validator(nodelist, jsonValid, $button) {
    nodelist.forEach(($el, itt) => {
        if ($el.checked) {
            $el.className = (jsonValid.isCorrect)? 'green' : 'red'
        } else {
            $el.className = (jsonValid.correct == $el.value)
                ? 'green'
                : ''
        }
        $el.disabled = true
    })
    $button.setAttribute('data-type', 'next')
    $button.innerHTML = 'Далее'
    $button.className = 'btn btn-next'
    $button.removeEventListener('click', onClickAnsw, false)
}

export function onClickAnsw() {
    console.log('clicked')
    const $answBtn = document.getElementById('questionButton')
    const answChk = document.querySelector('.js-answRad:checked')
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
            toLS(objToLs)
        })
    } else {
        alert('Выберите нужный ответ!')
    }
}
