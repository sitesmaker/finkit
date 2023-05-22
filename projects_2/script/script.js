document.addEventListener("DOMContentLoaded", () => {
    let form_selector = document.querySelectorAll('[data-js="form"]'),
        close_buttom  = document.querySelector('.modal__close');

    close_buttom.addEventListener('click', (e)=> {
        let parrent = e.target.parentNode;
        parrent.style.display = 'none';
        document.body.classList.remove('overlay');
    })

    function serialize(form_selector) {
        form_selector.forEach((form) => {
            let form_data = {};

            const button = form.querySelector('button[type="submit"]');

            button.addEventListener('click', (event) => {
                event.preventDefault();

                const input_list = form.querySelectorAll('input'),
                    method = form.getAttribute('method'),
                    action = form.getAttribute('action');

                inputs_get_data(input_list, form_data);

                if(action === "autorization.php") {
                    ajax(method, action, form_data).then((response) => {
                        return response.json();
                    }).then(data => {

                        if(data.error && !document.querySelector('.form__error')) {
                            form.insertAdjacentHTML('beforebegin', `
                                <div class="form__error">${data.error}</div>
                            `);
                        } else if(document.querySelector('.form__error')) {
                            document.querySelector('.form__error').innerHTML = data.error;
                        }

                        document.body.classList.add('overlay');
                        document.body.querySelector('.modal_success').style.display = "block";

                        setTimeout(()=> {
                            document.body.classList.remove('overlay');
                            document.body.querySelector('.modal_success').style.display = "none";
                        }, 10000);

                        view_profile();
                    })
                } else {
                    ajax(method, action, form_data);
                }
            })
        })
    }
    serialize(form_selector);

    function inputs_get_data(input_list, form_data) {

        input_list.forEach((input) => {
            let input_name = input.getAttribute('name'),
                input_value = input.value;
                form_data[input_name] = input_value;
        })
    }

    function ajax(method, action, form_data) {
        return fetch(action, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form_data)
        });
    }

    function view_profile() {

        let cookie_login = document.cookie ?? null;

        if(cookie_login) {
            let user_data = ajax('POST', 'user_data.php', {login: cookie_login.match(/login=(.+?)(;|$)/)[1]});

            user_data.then((response) => {
                return response.json();
            }).then(data => {
                let login_page = document.querySelector('.login-page'),
                    fio = data['fio'] ? data['fio'] : '',
                    birthday = data['birthday'] ? data['birthday'] : '',
                    description = data['description'] ? data['description'] : '';

                login_page.style.display = "none";

                if(!document.body.querySelector('header') && !document.body.querySelector('.profile')) {
                    login_page.insertAdjacentHTML('beforebegin', `
                        <header>
                            <div class="row">
                                <form action="autorization.php" method="POST" data-js="form">
                                    <input type="text" hidden="hidden" value="true" name="logout">
                                    <button type="submit">Выйти</button>
                                </form>
                            </div>
                        </header>
                        <div class="profile">
                            <div class="profile__fio"><b>Фио:</b> ${fio}</div>
                            <div class="profile__birthday"><b>Дата рождения:</b> ${birthday}</div>
                            <div class="profile__description"><b>Описание:</b> ${description}</div>
                        </profile>
                    `);
                }

                serialize(document.querySelectorAll('[data-js="form"]'));
            })
        } else {
            document.querySelector('.login-page').style.display = "flex";
            
            if(document.body.querySelector('header') && document.body.querySelector('.profile')) {
                document.body.querySelector('header').remove();
                document.body.querySelector('.profile').remove();
            }
        }
    }

    view_profile();
});