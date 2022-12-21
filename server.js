const express = require('express');
const fs = require('fs');

const PORT = process.env.PORT || 8080;
const app = express();
var cors = require('cors')

app.use(cors())

const words = JSON.parse(fs.readFileSync("words.json"))

const fill_in_blanks = JSON.parse(fs.readFileSync("fill_in_blanks.json"))

const quiz = JSON.parse(fs.readFileSync("quiz.json"))

const puzzles = JSON.parse(fs.readFileSync("puzzles.json"))

const minigames = {
    'unscramble': { minigame: 'unscramble' },
    'memorygame': { minigame: 'memorygame' },
    'puzzles': { minigame: 'puzzles' }
}

const languages = {
    'polish': { language: 'polish' },
    'english': { language: 'english' }
}

const levels = {
    'hard': { level: 'hard' },
    'easy': { level: 'easy' }
}

const categories = {
    'animals': { category: 'animals' },
    'nature': { category: 'nature' },
    'house': { category: 'house' },
    'technology': { category: 'technology' },
    'other': { category: 'other' },
    'transport': { category: 'transport' }
}

const tasks = {
    'quiz': { task: 'quiz' },
    'flashcards': { task: 'flashcards' },
    'fill-in-blanks': { task: 'fill-in-blanks' }
}

function losowanie_bez_powtorzen(ile_wylosowac, range, final) {
    var r
    var temp = []
    ile_wylosowano = 0
    for (i = 0; i < ile_wylosowac; i++) {
        do {
            r = Math.floor(Math.random() * range)
            nastepna = true;
            for (j = 0; j < ile_wylosowano; j++) {
                if (temp[j] == final[r]) nastepna = false;
            }
            if (nastepna == true) {
                temp[ile_wylosowano] = final[r]
                ile_wylosowano++;
            }
        }
        while (nastepna != true)
    }
    return temp
}

app.get('/', (req, res) => {
    return res.send("It works :)")
})


app.get('/api/users', (req, res) => {
    let minigame = req.query.minigame
    let task = req.query.task
    let language = req.query.language
    let level = req.query.level
    let category = req.query.category
    var filtered_words = []
    var ile_wylosowac
    var j = 0
    var final = []
    //sprawdzanie, czy dane parametry istnieją -> minigry
    if (minigames[minigame] && languages[language] && levels[level] && categories[category]) {
        if (minigame != 'puzzles') {
            for (var i = 0; i < words.length; i++) {
                for (var y = 0; y < Object.keys(languages).length; y++) {
                    if (words[i].level == level && words[i].languages[y].language == language && words[i].category == category) {
                        filtered_words[j] = words[i]
                        j++
                    }
                }
            }
            for (var i = 0; i < filtered_words.length; i++) {
                if (language == "polish") {
                    final[i] = {
                        "image": filtered_words[i].image,
                        "name": filtered_words[i].languages[0].name
                    }
                }
                else if (language == "english") {
                    final[i] = {
                        "image": filtered_words[i].image,
                        "name": filtered_words[i].languages[1].name
                    }
                }
            }
            ile_wylosowac = 10
        }
        else {
            for (var y = 0; y < puzzles.length; y++) {
                if (puzzles[y].level == level && puzzles[y].language == language && puzzles[y].category == category) {
                    filtered_words[j] = puzzles[y]
                    j++
                }
            }
            for (var i = 0; i < filtered_words.length; i++) {
                final[i] = {
                    "question": filtered_words[i].question,
                    "correctAnswer": filtered_words[i].correctAnswer,
                    "incorrectAnswer1": filtered_words[i].incorrectAnswer1,
                    "incorrectAnswer2": filtered_words[i].incorrectAnswer2
                }
            }
            ile_wylosowac = 3
        }
        final = losowanie_bez_powtorzen(ile_wylosowac, final.length, final)
        res.send(final)
    }
    //sprawdzanie, czy dane parametry istnieją -> zadania językowe
    else if (tasks[task] && languages[language] && levels[level] && categories[category]) {
        if (task == 'fill-in-blanks') {
            for (var i = 0; i < fill_in_blanks.length; i++) {
                if (fill_in_blanks[i].level == level && fill_in_blanks[i].language == language && fill_in_blanks[i].category == category) {
                    filtered_words[j] = fill_in_blanks[i]
                    j++
                }
            }
            for (var i = 0; i < filtered_words.length; i++) {
                final[i] = {
                    "text": filtered_words[i].text
                }
            }
            ile_wylosowac = 1
        }
        else if (task == 'quiz') {
            for (var i = 0; i < quiz.length; i++) {
                if (quiz[i].level == level && quiz[i].language == language && quiz[i].category == category) {
                    filtered_words[j] = quiz[i]
                    j++
                }
            }
            for (var i = 0; i < filtered_words.length; i++) {
                final[i] = {
                    "question": filtered_words[i].question,
                    "correctAnswer": filtered_words[i].correctAnswer,
                    "incorrectAnswer1": filtered_words[i].incorrectAnswer1,
                    "incorrectAnswer2": filtered_words[i].incorrectAnswer2
                }
            }
            ile_wylosowac = 3
        }
        //flashcards
        else {
            for (var i = 0; i < words.length; i++) {
                for (var y = 0; y < Object.keys(languages).length; y++) {
                    if (words[i].level == level && words[i].languages[y].language == language && words[i].category == category) {
                        filtered_words[j] = words[i]
                        j++
                    }
                }
            }
            for (var i = 0; i < filtered_words.length; i++) {
                if (language == "polish") {
                    final[i] = {
                        "image": filtered_words[i].image,
                        "hint": filtered_words[i].category, // "hint": filtered_words[i].languages[1].hint
                        "name": filtered_words[i].languages[0].name,
                        "answer": filtered_words[i].languages[1].name

                    }
                }
                else if (language == "english") {
                    final[i] = {
                        "image": filtered_words[i].image,
                        "hint": filtered_words[i].category, // "hint": filtered_words[i].languages[0].hint
                        "name": filtered_words[i].languages[1].name,
                        "answer": filtered_words[i].languages[0].name
                    }
                }
            }
            ile_wylosowac = 10
        }
        final = losowanie_bez_powtorzen(ile_wylosowac, final.length, final)
        res.send(final)
    }
    else { res.json('Parameters not found') }
})

app.listen(PORT);

module.exports = app;