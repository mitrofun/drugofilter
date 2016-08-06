import template from '../../hbs/friend.hbs';

function renderTemplate(obj, panel, status) {
    
    if (obj.response) {
        let friendsList = document.querySelector(`.friend-lists__list_${panel} .list__items`);
        friendsList.innerHTML = template({friend: obj.response.items, mode: status});
    }

}

function clearInputs() {
    
    let inputs = document.querySelectorAll('input');

    for (let i=0; i< inputs.length; i++) {
        if (inputs[i].value) {
            inputs[i].value = '';
        }
    }
}

function renderObjTemplates(objA, objB) {

    renderTemplate(objA, 'left', 'plus');
    renderTemplate(objB, 'right', 'remove');
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

export { renderTemplate, clearInputs , renderObjTemplates, closeApp}