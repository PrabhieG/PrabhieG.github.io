HTMLElement.prototype.clear = function() {
    this.innerHTML = '';
}

const main = document.getElementById('main'),
    footer = document.getElementById('footer');

// Fisher Yates shuffle array, returning a new object
function shuffle(a) {
    for (i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}

class Term {
    constructor(term, def, list) {
        this.term = term;
        this.def = def;
        this.list = list.filter(e => e !== this.term);
    }

    mc() {
        return new Promise((resolve, reject) => {
            const definition = document.createElement('p');
            definition.innerText = this.def;
            definition.id = 'question';
            main.appendChild(definition);

            const next = document.createElement('button');
            next.innerText = 'Next';
            
            const answers = [document.createElement('button'), 
                            document.createElement('button'), 
                            document.createElement('button'),
                            document.createElement('button')];

            const answerpos = Math.round(Math.random() * 3);
            let tlist = this.list;
            
            for (let i = 0; i < 4; i++) {
                if (i == answerpos) {
                    answers[i].innerText = this.term;
                    answers[i].addEventListener('click', () => {
                        answers[i].classList.add('correct');
                        answers.forEach((answer) => {
                            answer.disabled = true;
                        });
                        next.addEventListener('click', () => {
                            resolve();
                        }, {once: true});
                        footer.appendChild(next);
                    }, {once: true});
                } else {
                    const word = tlist[Math.round(Math.random() * (tlist.length - 1))]
                    tlist = tlist.filter(e => e !== word);
                    answers[i].innerText = word;
                    answers[i].addEventListener('click', () => {
                        answers[i].classList.add('incorrect');
                        answers[answerpos].classList.add('correct');
                        answers.forEach((answer) => {
                            answer.disabled = true;
                        });
                        next.addEventListener('click', () => {
                            reject();
                        }, {once: true});
                        footer.appendChild(next);
                    }, {once: true});
                }
                main.appendChild(answers[i]);
            } 
        });
    }

    input() {
        return new Promise((resolve, reject) => {
            const definition = document.createElement('p');
            definition.innerText = this.def;
            definition.id = 'question';
            main.appendChild(definition);

            const next = document.createElement('button');
            next.innerText = 'Next';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Answer';
            input.style.width = input.placeholder.length + "ch";
            input.addEventListener('input', () => {
                if (input.value.length == 0) {
                    input.style.width = input.placeholder.length + "ch";
                } else {
                    input.style.width = input.value.length + "ch";
                }
            });
            main.appendChild(input);

            const submit = document.createElement('button');
            submit.innerText = 'Submit';
            main.appendChild(submit);

            submit.addEventListener('click', () => {
                input.disabled = true;
                submit.disabled = true;
                if (input.value.toLowerCase().replace(/\s/g, '') == this.term.toLowerCase().replace(/\s/g, '')) {
                    input.classList.add('correct');

                    footer.clear();
                    footer.appendChild(next);
                    next.addEventListener('click', () => {
                            resolve(true);
                    }, {once: true});
                } else {
                    let overridden = false;
                    input.classList.add('incorrect');

                    const correct = document.createElement('label');
                    correct.classList.add('correct');
                    correct.innerText = this.term;
                    main.appendChild(correct);

                    const override = document.createElement('button');
                    override.innerText = 'Override, I was correct'
                    override.addEventListener('click', () => {
                        input.classList.add('correct');
                        input.classList.remove('incorrect');
                        overridden = true;
                    }, {once: true});
                    main.appendChild(override);
                    
                    footer.clear();
                    footer.appendChild(next);
                    next.addEventListener('click', () => {
                        resolve(overridden);
                    }, {once: true});
                }
            }, {once: true});
        });
    }
}

// Create Home layout
function home() {
    main.clear();
    footer.clear();
    const instructions = document.createElement('p');

    try {
        const save = JSON.parse(localStorage.sets);

        // Checkbox for each vocab set
        const checks = []
        instructions.innerText = 'Select sets:';
        instructions.id = "used";
        main.appendChild(instructions);

        Object.keys(save).forEach(set => {
            const container = document.createElement('span');
            container.classList.add('checkpair');

            const check = document.createElement('input');
            check.id = set.replace(/\s/g, '');
            check.value = set;
            check.type = 'checkbox';

            const label = document.createElement('label');
            label.setAttribute('for', set.replace(/\s/g, ''));
            label.innerText = set;

            
            container.appendChild(check);
            container.appendChild(label);
            main.appendChild(container);
            checks.push(check);
        });

        // Submit checked sets for question game
        const submit = document.createElement('button');
        submit.innerText = 'Start';
        submit.disabled = true;
        checks.forEach((check) => {
            check.addEventListener('click', () => {
                let checked = 0;
                checks.forEach((check) => {
                    if (check.checked) checked++;
                });
                if (checked == 0) {
                    submit.disabled = true;
                } else {
                    submit.disabled = false;
                }
            });
        });
        submit.addEventListener('click', () => {
            const sets = [];
            checks.forEach((check) => {
                if (check.checked) sets.push(check.value);
            });
            setup(sets);
        }, {once: true});
        
        footer.appendChild(submit);
    } catch {
        instructions.innerText = 'Get started by clicking Editor below to create your first word set.';
        instructions.id = "firstuse";
        main.appendChild(instructions);
    }

    

    const editor = document.createElement('button');
    editor.innerText = 'Editor';
    editor.addEventListener('click', () => {
        edit();
    }, {once: true});
    footer.appendChild(editor);
}

// Setup game
function setup(sets) {
    const save = JSON.parse(localStorage.sets);
    const list = [];
    const terms = [];
    
    sets.forEach(set => {
        save[set].forEach(term => {
            list.push(term[0]);
        });
    });

    sets.forEach(set => {
        save[set].forEach(term => {
            terms.push(new Term(term[0], term[1], list));
        });
    });

    quiz(terms);
}

// Play game (terms, question, round, revision, rterms, rround)
async function quiz(terms) {
    let question = 0,
           round = 0;
    const rterms = [];

    shuffle(terms);
    for (let i = 0; i < terms.length; i++) {
        main.clear();
        footer.clear();

        const info = document.createElement('p');
        info.id = "info";
        info.innerText = (question + 1) + '/' + (terms.length * 2);
        main.appendChild(info);

        await terms[i].mc().then(() => {}, () => {rterms.push(terms[i])});
        question++;
    }

    shuffle(rterms);
    for (let i = 0; i < rterms.length; i ++) {
        main.clear();
        footer.clear();

        const info = document.createElement('p');
        info.id = "info";
        info.innerText = 'Revision questions';
        main.appendChild(info);

        await rterms[i].mc().then(() => {}, () => {rterms.push(rterms[i])});
    }
    rterms.length = 0;

    let j;
    shuffle(terms);
    for (let i = 0; i < terms.length; i = i) {
        main.clear();
        footer.clear();

        const info = document.createElement('p');
        info.id = "info";
        info.innerText = (question + 1) + '/' + (terms.length * 2);
        main.appendChild(info);

        if (i !== j) {
            j = i;
            await terms[i].input().then((value) => {
                if (value) {
                    i++;
                } else {
                    rterms.push(terms[i]);
                    i++;
                    
                }
            });
            question++;
        }
    }

    let k;
    shuffle(terms);
    for (let i = 0; i < rterms.length; i = i) {
        main.clear();
        footer.clear();

        const info = document.createElement('p');
        info.id = "info";
        info.innerText = 'Revision questions';
        main.appendChild(info);

        if (i !== k) {
            k = i;
            await rterms[i].input().then((value) => {
                if (value) {
                    i++;
                } else {
                    rterms.push(rterms[i]);
                    i++;
                }
            });
        }
    }

    home();
}

function edit() {
    let save;
    try {
        save = JSON.parse(localStorage.sets);
    } catch {
        save = {}
    }
    
    main.clear();
    footer.clear();

    const containers = [];

    function makeset(set) {
        if (!set) {
            set = ''
        }

        const container = document.createElement('div');
        main.appendChild(container);
        container.classList.add('set');
        containers.push(container);
        
        const header = document.createElement('input');
        header.value = set;
        header.type = 'text';
        header.placeholder = 'Title';
        header.classList.add('set-title');
        if (header.value.length == 0) {
            header.style.width = header.placeholder.length + "ch";
        } else {
            header.style.width = header.value.length + "ch";
        }
        header.addEventListener('input', () => {
            if (header.value.length == 0) {
                header.style.width = header.placeholder.length + "ch";
            } else {
                header.style.width = header.value.length + "ch";
            }
        });
        container.appendChild(header);

        const del = document.createElement('button');
        del.innerText = 'Delete set';
        del.classList.add('delset');
        del.addEventListener('click', () => {
            main.removeChild(container);
            containers.splice(containers.indexOf(container));
        }, {once: true});
        container.appendChild(del);

        const add = document.createElement('button');
        add.innerText = 'Add term';
        add.classList.add('add');
        add.addEventListener('click', () => makepair());
        container.appendChild(add);

        function makepair(word, definition) {
            if (!word) {
                word = '';
                definition = '';
            }

            const paircontainer = document.createElement('div');
            container.appendChild(paircontainer);

            const term = document.createElement('input');
            term.value = word;
            term.placeholder = 'Term';
            term.classList.add('edit', 'term');
            if (term.value.length == 0) {
                term.style.width = term.placeholder.length + "ch";
            } else {
                term.style.width = term.value.length + "ch";
            }
            term.addEventListener('input', () => {
                if (term.value.length == 0) {
                    term.style.width = term.placeholder.length + "ch";
                } else {
                    term.style.width = term.value.length + "ch";
                }
            });
            paircontainer.appendChild(term);

            const dash = document.createElement('span');
            dash.innerHTML = '-';
            dash.classList.add('dash');
            paircontainer.appendChild(dash);

            const def = document.createElement('input');
            def.value = definition;
            def.placeholder = 'Definition';
            def.classList.add('edit', 'def');
            if (def.value.length == 0) {
                def.style.width = def.placeholder.length + "ch";
            } else {
                def.style.width = def.value.length + "ch";
            }
            def.addEventListener('input', () => {
                if (def.value.length == 0) {
                    def.style.width = def.placeholder.length + "ch";
                } else {
                    def.style.width = def.value.length + "ch";
                }
            });
            paircontainer.appendChild(def);

            const del = document.createElement('button');
            del.innerText = 'Delete';
            del.classList.add('delterm');
            del.addEventListener('click', () => {
                container.removeChild(paircontainer);
                delete paircontainer;
            });
            paircontainer.appendChild(del);
        }

        if (set != '') {
            save[set].forEach((pair) => {
                makepair(pair[0], pair[1]);
            });
        } else {
            for (let i = 0; i < 4; i++) {
                makepair();
            }
        }

        containers.forEach((container) => {
            const terms = container.getElementsByClassName('term');
            if (terms.length <= 4) {
                Array.from(container.getElementsByClassName('delterm')).forEach((element) => {
                    element.disabled = true;
                });
            } else {
                Array.from(container.getElementsByClassName('delterm')).forEach((element) => {
                    element.disabled = false;
                });
            }
        });
    }

    main.addEventListener('click', () => {
        containers.forEach((container) => {
            const terms = container.getElementsByClassName('term');
            if (terms.length <= 4) {
                Array.from(container.getElementsByClassName('delterm')).forEach((element) => {
                    element.disabled = true;
                });
            } else {
                Array.from(container.getElementsByClassName('delterm')).forEach((element) => {
                    element.disabled = false;
                });
            }
        });
    });

    Object.keys(save).forEach(set => makeset(set));

    const add = document.createElement('button');
    add.innerText = 'Create set';
    add.addEventListener('click', () => makeset());
    footer.appendChild(add);

    const update = document.createElement('button');
    update.innerText = 'Submit';
    let err = false;
    update.addEventListener('click', () => {
        const temp = {};
        containers.forEach(container => {
            const title = container.getElementsByClassName('set-title')[0].value;
            if (title != '' && !(temp[title])) {
                const terms = [];
                Array.from(container.getElementsByTagName('div')).forEach((pair) => {
                    const term = pair.getElementsByClassName('term')[0].value;
                    const def = pair.getElementsByClassName('def')[0].value;
                    terms.push([term, def]);
                });
                temp[title] = terms;
            } else {
                alert('Sets share titles or a set does not have a title.');
                err = true;
            }
        });
        if (!err) {
            localStorage.sets = JSON.stringify(temp);
            home();
        }
        err = false;
    });
    footer.appendChild(update);
}

home();