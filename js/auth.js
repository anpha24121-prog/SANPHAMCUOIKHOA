/* =========================================
   AUTHENTICATION SYSTEM
========================================= */

const USERS_KEY = "musicPlayerUsers";
const CURRENT_USER_KEY = "musicPlayerCurrentUser";


/* =========================================
   GET USERS
========================================= */

function getUsers() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(USERS_KEY)
            );

        if (!Array.isArray(data)) {
            return [];
        }

        /*
           Fix old user data:
           old version may use "name"
           instead of "username"
        */

        return data.map(user => ({

            id: user.id || Date.now(),

            username:
                user.username ||
                user.name ||
                "User",

            email:
                user.email ||
                "",

            password:
                user.password ||
                "",

            favorites:
                Array.isArray(user.favorites)
                    ? user.favorites
                    : []

        }));

    } catch (error) {

        console.error(
            "Cannot read users:",
            error
        );

        return [];

    }

}


/* =========================================
   SAVE USERS
========================================= */

function saveUsers(users) {

    localStorage.setItem(
        USERS_KEY,
        JSON.stringify(users)
    );

}


/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                CURRENT_USER_KEY
            )
        );

    } catch (error) {

        return null;

    }

}


/* =========================================
   SET CURRENT USER
========================================= */

function setCurrentUser(user) {

    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify({

            id: user.id,

            username:
                user.username ||
                user.name ||
                "User",

            email:
                user.email || ""

        })
    );

}


/* =========================================
   IS LOGGED IN
========================================= */

function isLoggedIn() {

    return getCurrentUser() !== null;

}


/* =========================================
   SIGN UP
========================================= */

const signupForm =
    document.getElementById(
        "signupForm"
    );


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "signupUsername"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "signupEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "signupConfirmPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "signupMessage"
                );


            message.style.color =
                "#ff6b6b";


            /* Username */

            if (username.length < 3) {

                message.textContent =
                    "Username must be at least 3 characters.";

                return;

            }


            /* Password */

            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                return;

            }


            /* Confirm password */

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;

            }


            const users =
                getUsers();


            /* Username exists */

            const usernameExists =
                users.some(
                    user =>
                        String(
                            user.username || ""
                        )
                        .toLowerCase() ===
                        username.toLowerCase()
                );


            if (usernameExists) {

                message.textContent =
                    "Username already exists.";

                return;

            }


            /* Email exists */

            const emailExists =
                users.some(
                    user =>
                        String(
                            user.email || ""
                        )
                        .toLowerCase() ===
                        email
                );


            if (emailExists) {

                message.textContent =
                    "Email already exists.";

                return;

            }


            /* Create user */

            const newUser = {

                id: Date.now(),

                username: username,

                email: email,

                password: password,

                favorites: []

            };


            users.push(newUser);

            saveUsers(users);


            message.style.color =
                "#20c463";

            message.textContent =
                "Account created successfully!";


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                800
            );

        }
    );

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "loginUsername"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            message.style.color =
                "#ff6b6b";


            const users =
                getUsers();


            const user =
                users.find(
                    account => {

                        const savedUsername =
                            String(
                                account.username ||
                                account.name ||
                                ""
                            )
                            .toLowerCase();

                        return (
                            savedUsername ===
                            username.toLowerCase()
                        )
                        &&
                        account.password ===
                        password;

                    }
                );


            if (!user) {

                message.textContent =
                    "Incorrect username or password.";

                return;

            }


            setCurrentUser(user);


            message.style.color =
                "#20c463";

            message.textContent =
                "Login successful!";


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                700
            );

        }
    );

}


/* =========================================
   LOGOUT
========================================= */

function logout() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

    window.location.href =
        "index.html";

}


/* =========================================
   GET CURRENT USER RECORD
========================================= */

function getCurrentUserRecord() {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return null;
    }


    const users =
        getUsers();


    return (
        users.find(
            user =>
                user.id ===
                currentUser.id
        ) || null
    );

}


/* =========================================
   GET FAVORITES
========================================= */

function getFavorites() {

    const user =
        getCurrentUserRecord();


    if (!user) {
        return [];
    }


    return Array.isArray(
        user.favorites
    )
        ? user.favorites
        : [];

}


/* =========================================
   ADD FAVORITE
========================================= */

function addFavorite(song) {

    const user =
        getCurrentUserRecord();


    if (!user) {

        alert(
            "Please login to save favorite songs."
        );

        return false;

    }


    const users =
        getUsers();


    const userIndex =
        users.findIndex(
            account =>
                account.id ===
                user.id
        );


    if (userIndex === -1) {
        return false;
    }


    if (
        !Array.isArray(
            users[userIndex].favorites
        )
    ) {

        users[userIndex].favorites = [];

    }


    const exists =
        users[userIndex]
            .favorites
            .some(
                favorite =>
                    favorite.trackId ===
                    song.trackId
            );


    if (exists) {
        return false;
    }


    users[userIndex]
        .favorites
        .push(song);


    saveUsers(users);

    return true;

}


/* =========================================
   REMOVE FAVORITE
========================================= */

function removeFavorite(trackId) {

    const user =
        getCurrentUserRecord();


    if (!user) {
        return false;
    }


    const users =
        getUsers();


    const userIndex =
        users.findIndex(
            account =>
                account.id ===
                user.id
        );


    if (userIndex === -1) {
        return false;
    }


    users[userIndex].favorites =
        (
            users[userIndex].favorites || []
        )
        .filter(
            song =>
                song.trackId !==
                trackId
        );


    saveUsers(users);

    return true;

}