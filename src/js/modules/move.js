import {renderObjTemplates, clearInputs} from './ui'
import {sortingObjByFirstName} from './data'


function moveFriends(e, objA, objB) {

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
            source = objA;
            receiver = objB;
        } else if (mode == 'remove') {
            source = objB;
            receiver = objA;
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

        sortingObjByFirstName(objA, objB);
        renderObjTemplates(objA, objB);
        clearInputs();

        if (e.target) {
            e.preventDefault();
        }
    }
}

export { moveFriends }