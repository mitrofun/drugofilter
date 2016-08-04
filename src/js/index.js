// global list obj
let FriendsList = {
      response: {
        count: 0,
        items: []
        }
    };

let friends = new Object(FriendsList);
let selectedFriends = new Object(FriendsList);

function itemInObj(item, obj, inObj) {

    for (let i = obj.response.items.length - 1; i >= 0; i--) {

        if (item.id == obj.response.items[i].id) {
            return inObj.response.items.indexOf(item);
        }
    }
}

function getFriends(objA, objB) {

    for (let i = objA.response.items.length - 1; i >= 0; i--) {
        let friend = objA.response.items[i];
        let index = itemInObj(friend, objB, objA);

        if (index) {
            objA.response.items.splice(index, 1);
        }
    }
    return objA;

}


function initData(obj) {
    // initial list friends

    if (localStorage['selectedFriends']) {
        selectedFriends =  JSON.parse(localStorage['selectedFriends']);
        friends = getFriends(obj, selectedFriends);
    } else {
        friends = obj;
    }
}

function renderTemplate(obj, panel, templateName) {

    // module template (ui)

    if (obj.response) {

        let friendsTemplate = document.getElementById(templateName);
        let friendsList = document.querySelector(`.friend-lists__list_${panel} .list__items`);

        let source = friendsTemplate.innerHTML;
        let template = Handlebars.compile(source);
        friendsList.innerHTML = template({friend: obj.response.items});
    }

}


function searchFriend(object, keyword) {

    // module search (ui)

    let array = [];

    let obj = {
        response: {
            count: 0,
            items: []
        }
    };

    if (keyword.length == 0 || keyword == ' ') {
        return object;
    }

    for (let i = 0; i < object.response.items.length; i++) {
            let re = new RegExp(keyword, "i");
            let item = object.response.items[i];

            if (re.test(item["first_name"]) || re.test(item["last_name"])) {
                array.push(item);
            }
    }

    if (keyword.length > 0 && !array.length) {
        array = [];
    }

    obj.response.items = array;
    obj.response.count = array.length;

    return obj;
}


function closeApp(e) {

    let listsFriends = document.querySelectorAll('.list__items');

    listsFriends[0].innerHTML = '';
    listsFriends[1].innerHTML = '';

    VK.Auth.logout();

    e.preventDefault();
}


function addSelectedFriends(e) {

    if ((e.target && e.target.tagName == "A") || 'uid' in e) {

        let item;
        if (e.target) {
            item = e.target.parentNode;
        } else {
            item = {
                dataset: {
                    uid: e.uid
                }
            }
        }

        for (let i = friends.response.items.length - 1; i >= 0; i--) {
            let friend = friends.response.items[i];

            if (item.dataset.uid == friend.id || e.uid == friend.id ) {

                let index = friends.response.items.indexOf(friend);

                friends.response.items.splice(index, 1);
                friends.response.count --;

                selectedFriends.response.items.push(friend);
                selectedFriends.response.count ++;
            }
        }

        reSortFriends();
        reRenderTemplates();

        if (e.target) {
            e.preventDefault();
        }

    }
}

function removeSelectedFriends(e) {

    if ((e.target && e.target.tagName == "A")  || 'uid' in e) {

        let item;
        if (e.target) {
            item = e.target.parentNode;
        } else {
            item = {
                dataset: {
                    uid: e.uid
                }
            }
        }

        for (let i = selectedFriends.response.items.length - 1; i >= 0; i--) {
            let friend = selectedFriends.response.items[i];
            if (item.dataset.uid == friend.id || e.uid == friend.id ) {

                let index = selectedFriends.response.items.indexOf(friend);

                selectedFriends.response.items.splice(index, 1);
                selectedFriends.response.count --;

                friends.response.items.push(friend);
                friends.response.count ++;
            }
        }

        reSortFriends();
        reRenderTemplates();
        
        if (e.target) {
            e.preventDefault();
        }
    }
}

function searchEvent() {

    let inputFriends = document.querySelector('.search-panel__input_left');
    let inputSelectedFriends = document.querySelector('.search-panel__input_right');

    inputFriends.addEventListener("input", () => {
        renderTemplate(searchFriend(friends, inputFriends.value), 'left', 'friendsTemplate');
        });

    inputSelectedFriends.addEventListener("input", () => {
        renderTemplate(searchFriend(selectedFriends, inputSelectedFriends.value), 'right', 'selectedFriendsTemplate');
        });

}


function reRenderTemplates() {
    renderTemplate(friends, 'left', 'friendsTemplate');
    renderTemplate(selectedFriends, 'right', 'selectedFriendsTemplate');
}

function reSortFriends() {
    sortFriendsByName(friends);
    sortFriendsByName(selectedFriends);
}


function sortFriendsByName(obj) {
    obj.response.items.sort(function(a, b) {
        var x = a['first_name']; var y = b['first_name'];
        if (x < y) return -1;
        if (x > y) return 1;
        else return 0;
    });
}

function saveData(e) {
    localStorage.setItem('selectedFriends', JSON.stringify(selectedFriends));
    alert(`Список из ${selectedFriends.response.count} друзей сохранен!`);
    e.preventDefault();
}


function handleDragOver(e) {
    // on element
    if (e.preventDefault) {
        e.preventDefault();
    }
}


function handleDrop(e) {
    // drop on element
    let data = e.dataTransfer.getData('"text/plain');
    let obj = JSON.parse(data);

    console.log(obj);

    addSelectedFriends(obj);
    removeSelectedFriends(obj);

    e.stopPropagation();
    e.preventDefault();
}


function handleDragStart(e) {

    if(e.target.className == "list__item"){
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('"text/plain', JSON.stringify(e.target.dataset));
    }
}

function startApp() {
    
    reSortFriends();
    reRenderTemplates();

    searchEvent();

    let closeBth = document.querySelector('.filter-app__close');
    let listsFriends = document.querySelectorAll('.list__items');
    let saveBtn = document.querySelector('.button__save');


    closeBth.addEventListener('click', (e) => {
        closeApp(e);
    });

    saveBtn.addEventListener('click', (e) => {
        saveData(e);
    });

    listsFriends[0].addEventListener('dragstart', handleDragStart);
    listsFriends[0].addEventListener('dragover', handleDragOver);
    listsFriends[0].addEventListener('drop', handleDrop);

    listsFriends[1].addEventListener('dragstart', handleDragStart);
    listsFriends[1].addEventListener('dragover', handleDragOver);
    listsFriends[1].addEventListener('drop', handleDrop);


    listsFriends[0].addEventListener('click', (e) => {
        addSelectedFriends(e);
    });

    listsFriends[1].addEventListener('click', (e) => {
        removeSelectedFriends(e);
    })
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
                reject(new Error('Не удалось авторизоваться'));
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
    alert(`Ошибка: ${e.message}`);
});