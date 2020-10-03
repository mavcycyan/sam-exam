import './sass/index.sass'
import {QuestionsPage} from './pages/questions-page/QuestionsPage'

const page = new QuestionsPage

const pageRender = page.getLayout('questions-page')
pageRender.then(html => {
    document.getElementById('app').append(html)
})
