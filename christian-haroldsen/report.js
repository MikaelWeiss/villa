
import { getFloorPlan } from "./floor-plan.mjs";

const floorPlan = document.getElementById('floor-plan');
floorPlan.insertAdjacentHTML('beforeend', getFloorPlan());

const roomOfIssue = document.getElementById('room-of-issue');
const itemOfIssue = document.getElementById('item-of-issue');
const descriptionOfIssue = document.getElementById('description-of-issue');

const itemOptions = document.getElementById('item-options');
const submitIssue = document.getElementById('submit-issue');


const submitTicketButton = document.getElementById('submit-ticket-button');
const submitDescriptionButton = document.getElementById('submit-description-button');
const backArrow = document.getElementById('back-arrow');

let panelIndex = 0;

let issue = {
    "room": '',
    "item": '',
    "description": ''
}

function getDamageOptions(element) {
    let damageOptions = element.classList.value.split(' ');
    let parent = element.parentElement;
    let notDone = true;
    while (notDone) {
        if (parent.id === 'selectable') {
            notDone = false;
        } else {
            let inheritedDamageOptions = parent.classList.value.split(' ');
            for (let i = inheritedDamageOptions.length - 1; i > -1; i --) {
                damageOptions.unshift(inheritedDamageOptions[i]);
            }
        }
        parent = parent.parentElement;
    }
    damageOptions = damageOptions.filter(Boolean);
    damageOptions.push('other');
    return damageOptions;
}

function setRoomOfIssue(e) {
    let clickedElement = e.target;
    if (clickedElement.closest('#selectable')) {
        issue.room = clickedElement.id;
        console.log(issue.room);
        let optionList = getDamageOptions(clickedElement);
        itemOptions.innerHTML = '';
        for (let i = 0; i < optionList.length; i ++) {
            itemOptions.insertAdjacentHTML('beforeend', `<button>${optionList[i]}</button>`)
        }
        panelIndex = 1;
        panelSwitch(panelIndex);
    }
}

function setItemOfIssue(e) {
    if (e.target.tagName === 'BUTTON') {
        issue.item = e.target.innerHTML;
        console.log(issue.item);
        panelIndex = 2;
        panelSwitch(panelIndex);
    }
}

function setDescriptionOfIssue() {
    issue.description = document.getElementById('description-input').value;
    console.log(issue.description);
    panelIndex = 3;
    panelSwitch(panelIndex);
}

function backArrowPress() {
    if (panelIndex > 0) {
        panelIndex --;
    }
    panelSwitch(panelIndex);
}

function panelSwitch(index) {
    if (index == 0) {
        roomOfIssue.style.display = 'flex';
        itemOfIssue.style.display = 'none';
        descriptionOfIssue.style.display = 'none';
        submitIssue.style.display = 'none';
    } else if (index == 1) {
        roomOfIssue.style.display = 'none';
        itemOfIssue.style.display = 'flex';
        descriptionOfIssue.style.display = 'none';
        submitIssue.style.display = 'none';
    } else if (index == 2) {
        roomOfIssue.style.display = 'none';
        itemOfIssue.style.display = 'none';
        descriptionOfIssue.style.display = 'flex';
        submitIssue.style.display = 'none';
    } else if (index == 3) {
        roomOfIssue.style.display = 'none';
        itemOfIssue.style.display = 'none';
        descriptionOfIssue.style.display = 'none';
        submitIssue.style.display = 'flex';
    }
}

floorPlan.addEventListener('click', setRoomOfIssue);
itemOfIssue.addEventListener('click', setItemOfIssue);
submitDescriptionButton.addEventListener('click', setDescriptionOfIssue);
backArrow.addEventListener('click', backArrowPress);
