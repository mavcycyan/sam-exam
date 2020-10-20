export function validator(nodelist, jsonValid, $button) {
    switch (jsonValid.type) {
    case 'single':
        validSingle(nodelist, jsonValid)
        break;
    case 'multiple':
        multipleSingle(nodelist, jsonValid)
        break;
    }
    $button.setAttribute('data-type', 'next')
    $button.innerHTML = 'Далее'
    $button.classList.add('btn-next')
}

function validSingle(nodelist, jsonValid) {
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
}

function multipleSingle(nodelist, jsonValid) {
    nodelist.forEach(($el) => {
        let isCorrect
        if (jsonValid.correct) {
            isCorrect = jsonValid.correct.find(answerId => {
                if ($el.value == answerId) {
                    return true
                }
            })
        } else {
            isCorrect = 'all'
        }

        if ($el.checked) {
            const validStr = (isCorrect)? 'green' : 'red'
            $el.classList.add(validStr)
        } else {
            if (isCorrect && isCorrect != 'all') {
                $el.classList.add('gray')
            }
        }
        $el.disabled = true
    })
}
