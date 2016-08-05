function getFoundObjs(object, keyword) {
    
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

export { getFoundObjs }