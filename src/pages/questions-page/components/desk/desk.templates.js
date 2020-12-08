export function getTemplates(responseStr, name, btnId) {
    const deskData = JSON.parse(responseStr)
    const deskAnswers = JSON.parse(deskData.answers)

    let deskAnswersHtml = ''
    // let deskRels = ''
    switch (deskData.type) {
    case 'single':
        deskAnswersHtml = getSingle(deskAnswers, deskData)
        break;
    case 'multiple':
        deskAnswersHtml = getMultiple(deskAnswers, deskData)
        break;
    case 'sort':
        deskAnswersHtml = getSort(deskAnswers, deskData)
        break;
    case 'relation':
        deskAnswersHtml = getRelation(deskAnswers, deskData)
        break;
    }

    const $answBtn = document.createElement('button')
    $answBtn.id = btnId
    $answBtn.className = 'btn'
    $answBtn.setAttribute('data-type', 'submit')
    $answBtn.innerHTML = 'Подтвердить'


    return `
                <div id="${name}" class="desk">
                    <div class="desk-quastion">${deskData.question}</div>
                    <div class="desk-asnswers">
                        ${deskAnswersHtml}
                    </div>
                </div>
                ${$answBtn.outerHTML}
            `
}

function getSingle(deskAnswers, deskData) {
    let HTML = ''
    deskAnswers.forEach((answer, itt) => {
        HTML += `
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
    return HTML
}

function getMultiple(deskAnswers, deskData) {
    let HTML = ''
    deskAnswers.forEach((answer, itt) => {
        HTML += `
                    <div class="answer">
                        <input id="q${itt}" type="checkbox"
                             value="${answer.id}" name="answer[]"
                             data-questionid="${deskData.id}"
                             class="js-answRad">
                        <label for="q${itt}" class="chb">
                            <span>${answer.text}</span>
                        </label>
                    </div>
                `
    })
    return HTML
}

function getSort(deskAnswers, deskData) {
    let HTML = ''
    deskAnswers.forEach((answer, itt) => {
        HTML += `
                    <div class="answer js-sortChk">
                        <input id="q${itt}" type="checkbox"
                             value="${answer.id}" name="answer"
                             data-questionid="${deskData.id}"
                             class="js-answRad"
                             checked
                             disabled>
                        <label for="q${itt}" class="sort">
                            <span>${answer.text}</span>
                        </label>
                    </div>
                `
    })
    return HTML
}

function getRelation(deskAnswers, deskData) {
    let HTML = ''
    let relationList = ''
    const deskRelative = JSON.parse(deskData.relative)
    deskRelative.forEach((answer, itt) => {
        relationList += `
                    <option value="${answer.id}">${answer.text}</option>
                `
    })
    deskAnswers.forEach((answer, itt) => {
        HTML += `
                    <div class="answer-row">
                        <div class="answer">
                            <input id="q${itt}" type="checkbox"
                                 checked
                                 disabled>
                            <label for="q${itt}" class="sort">
                                <span>${answer.text}</span>
                            </label>
                        </div>
                        <div class="answer-rel">
                            <input id="q${itt}" type="checkbox"
                                 value="${deskRelative[0].id}" name="answer"
                                 data-questionid="${deskData.id}"
                                 class="js-answRad js-forRelSel" 
                                 style="display: none;"
                                 checked>
                            <select class="js-relSel">
                                ${relationList}
                            </select>
                        </div>
                    </div>
                `
    })
    return HTML
}
