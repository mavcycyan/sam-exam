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
    let resData = {}
    const request = new XMLHttpRequest()
    request.open('POST', settingDataPath, false)
    request.onload = function() {
        resData = this.responseText
    }
    request.onerror = function() {
        console.log('Ошибка ' + this.status)
    }
    request.send({questionID, answerID})
    return resData
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
