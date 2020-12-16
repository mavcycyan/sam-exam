import {gettingDataPath, settingDataPath} from '../../../../configs'
import {gettingResultsSmall} from '../../../../configs'
import {getTemplates, getTemplateCongrats} from './desk.templates'
import {Desk} from './Desk'
import {preloader} from '../../../../helpers/preloader'
import {validator} from './desk.validators'

export function getData(questionID = 1, allQuestions = null) {
    return new Promise(resolve => {
        const request = new XMLHttpRequest()
        let allStr = ''
        if (allQuestions) {
            allQuestions.forEach((question, itt) => {
                if (itt != 0) {
                    allStr += ','
                }
                allStr += question
            })
        }
        allStr = '&all='+allStr
        request.open(
            'GET',
            gettingDataPath + `?id=${questionID}${allStr}`,
            false
        )
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
        request.send(
            `questionID=${questionID}&answerID=${answerIdPost}`
        )
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

export function fromLS() {
    if (localStorage.getItem('answers')) {
        const lStor = JSON.parse(localStorage.getItem('answers'))

        return lStor[lStor.length-1].question_id
    }
    return null
}

export function fromLsAll() {
    if (localStorage.getItem('answers')) {
        const lStor = JSON.parse(localStorage.getItem('answers'))
        const lStorIds = lStor.map(item => {
            return item.question_id
        })
        return lStorIds
    }
    return null
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
        break;
    case 'next':
        nextPrev('next', +answChk[0].getAttribute('data-questionid') + 1)
        break;
    }
}
export function nextPrev(param, chkId) {
    const $answBtn = document.getElementById('questionButton')
    preloader('init')
    getData(chkId, fromLsAll()).then(data => {
        const check = JSON.parse(data)
        if (check.finish === true) {
            getFinish()
        } else {
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
        }
    }).catch((e) => {
        if (param == 'next') {
            alert('error')
        }
        console.log(e)
    }).finally(() => {
        preloader('destroy')
    })
}

export function onClickSort() {
    if (document.querySelectorAll('.sortChkActive').length > 0) {
        event.target.closest('.js-sortChk').classList.add('sortChkActive')
        const $sortActive = document.querySelectorAll('.sortChkActive')
        const $sort1 = $sortActive[0]
        const $sort2 = $sortActive[1]
        const $sortContainer = $sort1.parentNode
        const $cloneSort1 = $sort1.cloneNode(true)
        const $cloneSort2 = $sort2.cloneNode(true)
        $sortContainer.replaceChild($cloneSort1, $sort2)
        $sortContainer.replaceChild($cloneSort2, $sort1)
        const $newSortActive = [$cloneSort1, $cloneSort2]
        $newSortActive.forEach($el => {
            $el.classList.add('sortChkAlert')
            $el.classList.remove('sortChkActive')
        })

        // Deleting sort event listeners and reinitializing them
        const $sortChks = document.querySelectorAll('.js-sortChk')
        if ($sortChks.length) {
            $sortChks.forEach($el => {
                $el.addEventListener('click', onClickSort, false)
            })
        }
        // Deleting sort event listeners and reinitializing them END

        setTimeout(function() {
            $newSortActive.forEach($el => {
                $el.classList.remove('sortChkAlert')
            })
        }, 500);
    } else {
        event.target.closest('.js-sortChk').classList.add('sortChkActive')
    }
}

export function selectToCheckbox() {
    if (document.querySelectorAll('.js-relSel').length > 0) {
        const $parEl = event.target.closest('div')
        $parEl.querySelector('.js-forRelSel').value = event.target.value
    }
}

async function getFinish() {
    const results = await getResults()

    const templ = getTemplateCongrats(results)
    const templDom = document.getElementById('desk')
    templDom.outerHTML = templ
    document.getElementById('header').remove()
    document.getElementById('navbar').remove()
    document.getElementById('questionButton').remove()
}

function getResults() {
    return new Promise(resolve => {
        const request = new XMLHttpRequest()
        const lStor = JSON.parse(localStorage.getItem('answers'))
        const sortStor = []
        lStor.forEach(element => {
            sortStor[element.question_id-1] = element.isCorrect
        })
        let allStr = ''

        sortStor.forEach((res, itt) => {
            if (itt != 0) {
                allStr += ','
            }
            allStr += `${itt+1}-${res}`
        })

        request.open(
            'GET',
            gettingResultsSmall + `?questions=${allStr}`,
            false
        )
        request.onload = function() {
            resolve(this.responseText)
        }
        request.onerror = function() {
            console.log('Ошибка ' + this.status)
        }
        request.send()
    })
}
