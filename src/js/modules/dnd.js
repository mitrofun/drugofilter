import { moveFriends } from './move'

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

function handleDrop(e, objA, objB) {
    // drop on element
    let data = e.dataTransfer.getData('"text/plain');
    let obj = JSON.parse(data);

    moveFriends(obj, objA, objB);
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

export { handleDragOver, handleDrop, handleDragStart }