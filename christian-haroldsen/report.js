
function getFloorPlan() {
    return `
    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 812.65 380.48">
    <defs>
        <style>
            .c12 {font-size: 35px;}
            .c13 {font-size: 40px;}
            .c14 {font-size: 18px;}
        </style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">

        <g id="walls">
            <line x1="259.66" y1="359.74" x2="259.66" y2="347.74"/>
        </g>

        <g id="furnishings">
            <rect x="256.9" y="255.58" width="99.36" height="41.4"/>
            <rect x="509.92" y="58.66" width="54.65" height="110.88"/>
            <rect x="416.99" y="58.66" width="54.65" height="110.88"/>
            <rect x="688.96" y="58.66" width="54.65" height="110.88"/>
            <rect x="596.03" y="58.66" width="54.65" height="110.88"/>
            <rect x="111.16" y="58.66" width="54.65" height="110.88"/>
            <rect x="18.23" y="58.66" width="54.65" height="110.88"/>
            <line x1="103.18" y1="338.38" x2="181.54" y2="338.38"/>
            <line x1="580.3" y1="338.38" x2="661.74" y2="338.38"/>
        </g>

        <text class="c12" transform="translate(291.4 111.82)">Living Room</text>
        <text class="c12" transform="translate(92.02 224.54)">Bedroom</text>
        <text class="c14" transform="translate(52.84 292.98)">Bathroom</text>
        <text class="c14" transform="translate(710.62 292.98)">Bathroom</text>
        <text class="c14" transform="translate(142.36 292.98)">Vanity</text>
        <text class="c14" transform="translate(580.3 292.98)">Vanity</text>
        <text class="c12" transform="translate(490.78 224.54)">Bedroom</text>
        <text class="c12" transform="translate(669.82 224.54)">Bedroom</text>
        <text class="c13" transform="translate(348.73 352.39)">Kitchen</text>

        <g id="selectable">
            <g class="paint lighting carpet">
                <g class="mattress bedframe">
                    <rect id="bedroom2" x="401.26" y="25.18" width="179.04" height="230.4"/>
                    <rect id="bedroom3" x="580.3" y="25.18" width="179.04" height="230.4"/>
                    <rect id="bedroom1" x="2.5" y="25.18" width="179.04" height="230.4"/>
                </g>
                <g class="toilet shower">
                    <polygon id="bathroom1" points="103.18 255.58 103.18 377.98 28.3 377.98 28.3 338.14 2.5 338.14 2.5 255.58 103.18 255.58"/>
                    <polygon id="bathroom2" points="759.34 255.58 759.34 339.1 737.86 339.1 737.86 377.98 661.9 377.98 661.9 255.58 759.34 255.58"/>
                </g>
                <g class="sink">
                    <rect id="vanity1" x="103.18" y="255.58" width="78.36" height="122.4"/>
                    <polygon id="vanity2" points="661.9 255.58 661.9 377.98 580.3 377.98 580.3 314.62 507.82 314.62 507.82 255.58 661.9 255.58"/>
                </g>
                <polyline id="kitchen" class="oven sink garbage-disposal microwave" points="507.82 255.58 507.82 314.62 438.7 314.62 438.7 377.98 259.66 377.98 259.66 359.74 181.54 359.74 181.54 255.58"/>
                <polyline id="living-room" class="tv couch" points="181.54 255.58 181.54 2.5 401.26 2.5 401.26 255.58"/>
            </g>
        </g>
    </g>
    </svg>
    `;
}

const floorPlan = document.getElementById('floor-plan');
floorPlan.insertAdjacentHTML('beforeend', getFloorPlan());
const roomOfIssue = document.getElementById('room-of-issue');
const itemOfIssue = document.getElementById('item-of-issue');
const descriptionOfIssue = document.getElementById('description-of-issue');
const itemOptions = document.getElementById('item-options');
const submitIssue = document.getElementById('submit-issue');

const descriptionInput = document.getElementById('description-input');
const submitTicketButton = document.getElementById('submit-ticket-button');
const submitDescriptionButton = document.getElementById('submit-description-button');

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

function logLocation(e) {
    let clickedElement = e.target;
    if (clickedElement.closest('#selectable')) {
        let roomOfDamage = clickedElement.id;
        console.log(roomOfDamage);
        let optionList = getDamageOptions(clickedElement);
        itemOptions.innerHTML = '';
        for (let i = 0; i < optionList.length; i ++) {
            itemOptions.insertAdjacentHTML('beforeend', `<button>${optionList[i]}</button>`)
        }
        roomOfIssue.style.display = 'none';
        itemOfIssue.style.display = 'flex';
    }
}

function clickedItemOfIssue(e) {
    if (e.target.tagName === 'BUTTON') {
        descriptionOfIssue.style.display = 'flex';
        itemOfIssue.style.display = 'none';
    }
}

floorPlan.addEventListener('click', logLocation);
itemOfIssue.addEventListener('click', clickedItemOfIssue);
descriptionInput.addEventListener('input', ()=> {
    submitIssue.style.display = 'flex';
});
submitDescriptionButton.addEventListener('click', ()=> {
    descriptionOfIssue.style.display = 'none';
    submitIssue.style.display = 'flex';
});
