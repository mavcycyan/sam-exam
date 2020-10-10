export function getTemplates(responseStr, name, btnId) {
    const deskData = JSON.parse(responseStr)
    const deskAnswers = JSON.parse(deskData.answers)
    let deskAnswersHtml = ''
    switch (deskData.type) {
    case 'single':
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
