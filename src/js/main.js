import { getFoundObjs } from './modules/search'
import { renderTemplate, clearInputs } from './modules/ui'
import { getDifObj , sortByField} from './modules/data'

let FriendsList = {
      response: {
        count: 0,
        items: []
        }
    };

let friends = new Object(FriendsList);
let selectedFriends = new Object(FriendsList);

function moveFriends(e) {

    if (e.target && e.target.tagName == "A" || e.uid) {

        let item, mode;

        if (e.target) {
            item = e.target.parentNode;
            mode = e.target.className.split('__')[1];
        } else {
            item = {
                dataset: {
                    uid: e.uid
                }
            };
            mode = e.mode;
        }

        let source, receiver;

        if (mode == 'plus') {
            source = friends;
            receiver = selectedFriends;
        } else if (mode == 'remove') {
            source = selectedFriends;
            receiver = friends;
        }

        for (let i = source.response.items.length - 1; i >= 0; i--) {

            let friend = source.response.items[i];

            if (item.dataset.uid == friend.id) {

                let index = source.response.items.indexOf(friend);

                source.response.items.splice(index, 1);
                source.response.count --;

                receiver.response.items.push(friend);
                receiver.response.count ++;
            }
        }

        reSortFriends();
        reRenderTemplates();
        clearInputs();

        if (e.target) {
            e.preventDefault();
        }
    }
}

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

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDrop(e) {
    // drop on element
    let data = e.dataTransfer.getData('"text/plain');
    let obj = JSON.parse(data);
    
    moveFriends(obj);
    e.stopPropagation();
    e.preventDefault();
}

function handleDragStart(e) {
    
    if(e.target.className == "list__item"){
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('"text/plain', JSON.stringify(
            {
                uid: e.target.dataset.uid,
                mode: e.target.lastElementChild.className.split('__')[1]
            }
        ));
    }
}

function listsFriendsEvents(lists) {
    for (let i = 0; i < 2 ; i ++) {
        lists[i].addEventListener('dragstart', handleDragStart);
        lists[i].addEventListener('dragover', handleDragOver);
        lists[i].addEventListener('drop', handleDrop);
        lists[i].addEventListener('click', moveFriends);
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

function reRenderTemplates() {
    renderTemplate(friends, 'left', 'plus');
    renderTemplate(selectedFriends, 'right', 'remove');
}

function reSortFriends() {
    sortByField(friends, 'first_name');
    sortByField(selectedFriends, 'first_name');
}

function startApp() {

    reSortFriends();
    reRenderTemplates();

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