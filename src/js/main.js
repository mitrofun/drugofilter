import { getFoundObjs } from './modules/search'
import { renderTemplate, renderObjTemplates, closeApp } from './modules/ui'
import { getDifObj, sortingObjByFirstName, saveData } from './modules/data'
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
let userId = 0;


function listsFriendsEvents(lists) {

    for (let i = lists.length - 1; i >= 0 ; i--) {
        let el = lists[i];
        
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('drop', (e) => {
            handleDrop(e, friends, selectedFriends)
        });
        el.addEventListener('click', (e) => {
            moveFriends(e, friends, selectedFriends)
        });
    }
}

function initApp() {

    sortingObjByFirstName(friends, selectedFriends);
    renderObjTemplates(friends, selectedFriends);

     // Events

    let listsFriends = document.querySelectorAll('.list__items');
    let inputFriends = document.querySelector('.search-panel__input_left');
    let inputSelectedFriends = document.querySelector('.search-panel__input_right');
    let closeBth = document.querySelector('.filter-app__close');
    let saveBtn = document.querySelector('.button__save');

    listsFriendsEvents(listsFriends); // move friends events
    
    inputFriends.addEventListener("input", () => {
        renderTemplate(getFoundObjs(friends, inputFriends.value), 'left', 'plus');
    });
    inputSelectedFriends.addEventListener("input", () => {
        renderTemplate(getFoundObjs(selectedFriends, inputSelectedFriends.value), 'right', 'remove');
    });
    
    closeBth.addEventListener('click', closeApp);
    saveBtn.addEventListener('click', (e) => {
        saveData(e, selectedFriends, userId)
    });
}

function initData(obj) {
 
    // initial lists of friends

    if (localStorage[`${userId}`]) {
        selectedFriends =  JSON.parse(localStorage[`${userId}`]);
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
                userId = response.session.user.id;
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

    initApp(friends);

}).catch(function (e) {
    alert(`Error: ${e.message}`);
});