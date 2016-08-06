function _itemInObj(item, obj, inObj) {

    for (let i = obj.response.items.length - 1; i >= 0; i--) {

        if (item.id == obj.response.items[i].id) {
            return inObj.response.items.indexOf(item);
        }
    }
}

function getDifObj(objA, objB) {

    for (let i = objA.response.items.length - 1; i >= 0; i--) {
        let friend = objA.response.items[i];
        let index = _itemInObj(friend, objB, objA);

        if (index) {
            objA.response.items.splice(index, 1);
        }
    }
    return objA;
}

function sortByField(obj, field) {
    obj.response.items.sort(function(a, b) {
        var x = a[field]; var y = b[field];
        if (x < y) return -1;
        if (x > y) return 1;
        else return 0;
    });
}

function sortingObjByFirstName(objA, ObjB) {
    for (let i = arguments.length - 1; i >= 0; i--) {
        sortByField(arguments[i], 'first_name');
    }
}

function saveData(e, obj, key) {
    localStorage.setItem(key, JSON.stringify(obj));
    alert(`List of ${obj.response.count} friends saved!`);
    e.preventDefault();
}

export { getDifObj, sortingObjByFirstName, saveData}