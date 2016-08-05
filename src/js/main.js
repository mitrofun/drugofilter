import { getFoundObjs } from './modules/search'
import { renderTemplate, renderObjTemplates, clearInputs } from './modules/ui'
import { getDifObj, sortingObjByFirstName} from './modules/data'
import { handleDragOver, handleDrop, handleDragStart } from './modules/dnd'
import { moveFriends } from './modules/move'

let FriendsList = {
      response: {
        count: 0,
        items: []
        }
    };

let friends = new Object(FriendsList);
let selectedFriends = new Object(FriendsList);



function closeApp(e) {

    let listsFriends = document.querySelectorAll('.list__items');

    listsFriends[0].innerHTML = '';
    listsFriends[1].innerHTML = '';
    clearInputs();
    VK.Auth.logout();
    alert('You leave the app!');
    e.preventDefault();
}

function saveData(e) {
    localStorage.setItem('selectedFriends', JSON.stringify(selectedFriends));
    alert(`List of ${selectedFriends.response.count} friends saved!`);
    e.preventDefault();
}



function listsFriendsEvents(lists) {
    for (let i = 0; i < 2 ; i ++) {
        lists[i].addEventListener('dragstart', handleDragStart);
        lists[i].addEventListener('dragover', handleDragOver);
        lists[i].addEventListener('drop', (e) => {
            handleDrop(e, friends, selectedFriends)
        });
        lists[i].addEventListener('click', (e) => {
            moveFriends(e, friends, selectedFriends)
        });
    }
}

function extraBtnEvents() {

    let closeBth = document.querySelector('.filter-app__close');
    let saveBtn = document.querySelector('.button__save');

    closeBth.addEventListener('click', closeApp);
    saveBtn.addEventListener('click', saveData);
}

function searchEvents() {

    let inputFriends = document.querySelector('.search-panel__input_left');
    let inputSelectedFriends = document.querySelector('.search-panel__input_right');

    inputFriends.addEventListener("input", () => {
        renderTemplate(getFoundObjs(friends, inputFriends.value), 'left', 'plus');
    });

    inputSelectedFriends.addEventListener("input", () => {
        renderTemplate(getFoundObjs(selectedFriends, inputSelectedFriends.value), 'right', 'remove');
    });
}

function startApp() {

    sortingObjByFirstName(friends, selectedFriends);
    renderObjTemplates(friends, selectedFriends);

     // Events

    let listsFriends = document.querySelectorAll('.list__items');

    searchEvents();
    listsFriendsEvents(listsFriends); // move friends events
    extraBtnEvents(); // events save & exit btn
}

function initData(obj) {

    // initial lists of friends

    if (localStorage['selectedFriends']) {
        selectedFriends =  JSON.parse(localStorage['selectedFriends']);
        friends = getDifObj(obj, selectedFriends);
    } else {
        friends = obj;
    }
}

// init application

new Promise(function (resolve) {
    if (document.readyState == 'complete') {
        resolve();
    } else {
        window.onload = resolve;
    }
}).then(() => {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 5573844
        });

        VK.Auth.login(function (response) {
            if (response.session) {
                resolve(response);
            } else {
                reject(new Error('Failed to login'));
            }
        }, 2);
    });
}).then(() => {

     return new Promise(function (resolve, reject) {
        VK.api('friends.get', {v: '5.53', 'fields': 'photo_50'}, function (serverAnswer) {

            if (serverAnswer.error) {
                reject(new Error(serverAnswer.error.error_msg));
            } else {
                resolve(serverAnswer);
            }
        });
    });

}).then((response) => {

    initData(response);

}).then(() => {

    startApp(friends);

}).catch(function (e) {
    alert(`Error: ${e.message}`);
});