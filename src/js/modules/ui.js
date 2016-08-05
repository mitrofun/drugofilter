function renderTemplate(obj, panel, status) {
    
    if (obj.response) {

        let friendsTemplate = document.getElementById('template');
        let friendsList = document.querySelector(`.friend-lists__list_${panel} .list__items`);

        let source = friendsTemplate.innerHTML;
        let template = Handlebars.compile(source);
        friendsList.innerHTML = template({friend: obj.response.items, mode: status});
    }

}

function clearInputs() {

    // module ui (inputs)

    let inputs = document.querySelectorAll('input');

    for (let i=0; i< inputs.length; i++) {
        if (inputs[i].value) {
            inputs[i].value = '';
        }
    }
}

export { renderTemplate, clearInputs }