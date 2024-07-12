window.onload = () => {
    wideDisplay = false;
    existingStickies = [];
    existingNotes = [];

    setDateTime();
    loadNotes();

    addToggleListener();

    initializeSticky();
    initializeDisplayButtons();

    initializeNewThingsButton();
}

function addToggleListener() {
    toggleButtons = document.getElementsByName("toggle");
    toggleButtons[1].style.display = 'none';

    colorChange = Array.from(document.getElementsByName("colorChange"));

    toggleButtons[0].addEventListener('click', ()=> {
        toggleButtons[0].style.display = 'none';
        toggleButtons[1].style.display = 'flex';

        colorChange.forEach((item) => {
                item.style.backgroundColor = '#f0f0f0';
                item.style.color = 'black';
                item.style.borderColor = 'black';
        });
    });

    toggleButtons[1].addEventListener('click', ()=> {
        toggleButtons[1].style.display = 'none';
        toggleButtons[0].style.display = 'flex';

        colorChange.forEach((item) => {
                item.style.backgroundColor = 'black';
                item.style.color = '#f0f0f0';
                item.style.borderColor = '#f0f0f0';

        });
    });
}

function setDateTime(){
    document.getElementById("date").innerText = new Date().toLocaleDateString();
    updateTime();
    setInterval(updateTime, 1000);

}

function updateTime() {
    timeElement = document.getElementById("time");
    now = new Date();

    hours = now.getHours().toString().padStart(2, '0') % 12;
    hours == 0 ? hours = 12 : hours = hours;

    minutes = now.getMinutes().toString().padStart(2, '0');
    seconds = now.getSeconds().toString().padStart(2, '0');

    formattedTime = `${hours}:${minutes}:${seconds}`;
    timeElement.innerText = formattedTime;
}


function initializeSticky() {  
    newNoteButton = document.getElementsByClassName("notesHeadingIcon")[0];
    newNoteButton.addEventListener('click', createSticky);
}

function createSticky(noteData = {}) {
    const container = document.getElementById('stickieContainer');

    for (let i = 0; i < existingStickies.length; i++) {
        const currSticky = existingStickies[i];

        const currStickyTitle = currSticky.querySelector('.stickyTitle');
        const currStickyContent = currSticky.querySelector('.stickyContent');

        // Check if the sticky is empty
        if (currStickyTitle.value === '' && currStickyContent.value === '') {
            currSticky.remove();
        }
    }  

    // Create the main sticky div
    const sticky = document.createElement('div');
    sticky.className = 'sticky';
    sticky.setAttribute('name', 'sticky');

    const stickyHeader = document.createElement('div');
    stickyHeader.className = 'stickyHeader';

    const stickyTitle = document.createElement('input');
    stickyTitle.className = 'stickyTitle';
    stickyTitle.setAttribute('placeholder', 'Untitled Note');
    stickyTitle.value = noteData.title || '';

    const dateCreated = document.createElement('div');
    dateCreated.className = 'dateCreated';
    let currDate = (new Date().toLocaleDateString()).slice(0, 4);
    currDate.split('')[1] === '/' ? currDate = '0' + currDate : currDate;
    dateCreated.textContent = noteData.date || currDate;

    stickyHeader.appendChild(stickyTitle);
    stickyHeader.appendChild(dateCreated);

    const stickyContent = document.createElement('textarea');
    stickyContent.className = 'stickyContent';
    stickyContent.value = noteData.content || '';

    sticky.appendChild(stickyHeader);
    sticky.appendChild(stickyContent);

    container.prepend(sticky);

    // Add event listeners to save on input
    stickyTitle.addEventListener('input', saveNotes);
    stickyContent.addEventListener('input', saveNotes);
    existingStickies.unshift(sticky);
}

// Helper function to get current date in DD/MM format
// function getCurrentDate() {
//     const currentDate = new Date();
//     const day = String(currentDate.getDate()).padStart(2, '0');
//     const month = String(currentDate.getMonth() + 1).padStart(2, '0');
//     return `${day}/${month}`;
// }

function initializeDisplayButtons() {
    displayButtons = document.getElementsByClassName('displayIcon');

    thingContainer = document.getElementById('thingsContainer');

    
    displayButtons[0].addEventListener('click', () => {
        thingContainer.style.flexDirection = "column";
        thingContainer.style.justifyContent = 'flex-start';
        wideDisplay = true;
        document.querySelectorAll('.thing').forEach(element => {
            element.style.width = '90%';
            element.style.height = '100px';
            element.style.justifyContent = 'space-between';
            element.querySelector('.thingInfo').style.height = '60%';
            element.querySelector('.thingPreview').style.display = 'none';
        });
    });

    displayButtons[1].addEventListener('click', () => {
        thingContainer.style.flexDirection = "row";
        wideDisplay = false;
        document.querySelectorAll('.thing').forEach(element => {
            element.style.width = '300px';
            element.style.height = '300px';
            element.style.justifyContent = 'flex-start';
            element.querySelector('.thingInfo').style.height = '35%';
            element.querySelector('.thingPreview').style.display = 'flex';
        });
    });
}


function initializeNewThingsButton() {
    let idCreateThing = document.querySelector('#createThing');
    let tagSearchBar = document.getElementById('tagSearch');
    let createTitle = document.getElementById('createThingTitle');
    let dateSet = document.getElementById('dateSet');

    let prioritySet = document.getElementById('createThingSetPriority');
    let subMenu = document.querySelectorAll('.menuInfo');
    let radioButtons = prioritySet.querySelectorAll('input[name="priority"]');

    
    document.querySelectorAll('#newThingButton')[0].addEventListener('click', () => {
        idCreateThing.style.display = 'flex';
        createTitle.focus();

    });

    document.querySelector('#cancelThing').addEventListener('click', () => {
        createTitle.value = '';

        idCreateThing.querySelectorAll('.tag').forEach((element) => {
            element.remove();
        });
        tagSearchBar.setAttribute('placeholder','#...');
        tagSearchBar.value = '';
        tagSearchBar.disabled = false;

        dateSet.value = '';

        radioButtons.forEach(button => button.checked = false);

        subMenu[0].style.visibility = 'hidden';
        subMenu[1].style.visibility = 'hidden';
        subMenu[2].innerText = 'None';

        idCreateThing.style.display = 'none';
    });

    document.querySelector('#addThing').addEventListener('click', () => {
        if (checkNewThing(createTitle, dateSet, subMenu)) {
            createNewThing(createTitle.value, dateSet.value, prioritySet, idCreateThing.querySelectorAll('.tag'));

            createTitle.value = '';

            idCreateThing.querySelectorAll('.tag').forEach((element) => {
                element.remove();
            });
            tagSearchBar.setAttribute('placeholder','#...');
            tagSearchBar.value = '';
            tagSearchBar.disabled = false;

            dateSet.value = '';

            radioButtons.forEach(button => button.checked = false);

            subMenu[0].style.visibility = 'hidden';
            subMenu[1].style.visibility = 'hidden';
            subMenu[2].innerText = 'None';

            idCreateThing.style.display = 'none';
        }
    });

    tagSearchBar.addEventListener('input', (event) => {
        let inputValue = event.target.value;

        inputValue = inputValue.replace(/ /g, '_');
        let allowedCharsOnly = inputValue.replace(/[^a-zA-Z0-9_]/g, '');
        
        if (inputValue !== allowedCharsOnly) {
            event.target.value = allowedCharsOnly;
        } else {
            event.target.value = inputValue;
        }
    });

    tagSearchBar.addEventListener('keydown', (event) => {
        if ((event.key == 'Enter') && tagSearchBar.value.length) {
            newThingAddTag(tagSearchBar.value, '#createThingSetTags');
            if (idCreateThing.querySelectorAll('.tag').length > 3) {
                tagSearchBar.disabled = true;
                tagSearchBar.setAttribute('placeholder','limit reached');
            }
            tagSearchBar.value = '';
        } 
    });

    dateSet.addEventListener('input', (event) => {
        let inputValue = event.target.value;

        let allowedCharsOnly = inputValue.replace(/[^0-9/]/g, '');

        if (inputValue !== allowedCharsOnly) {
            event.target.value = allowedCharsOnly;
        } else {
            event.target.value = inputValue;
        }

        if ((inputValue.length != 3) && (inputValue.split('')[inputValue.length - 1] == '/')) {
            alert('here');
            event.target.value = event.target.value.substring(0, event.target.value.length - 1);
        }
        if ((inputValue.length == 2) && (!inputValue.includes('/'))) {
            event.target.value = inputValue + '/';
        }
    });

    dateSet.addEventListener('keydown', (event) => {
        let inputValue = event.key;

        if ((dateSet.value.length == 1) && (inputValue == '/')) {
            dateSet.value = '0' + dateSet.value;
        } 
    });

    radioButtons.forEach((button) => {
        button.addEventListener('change', () =>{
            let selectedPriority = prioritySet.querySelector('input[name="priority"]:checked').value;

            switch (selectedPriority) {
                case '1':
                    subMenu[2].innerText = 'Low Priority';
                    break;
                case '2':
                    subMenu[2].innerText = 'Medium Priority';
                    break;
                case '3':
                    subMenu[2].innerText = 'High Priority';
                    break;
                default:
                    subMenu[2].innerText = 'None';
            }
        });
    });
}

function newThingAddTag(tagName, parentContainer) {
    parent = document.querySelectorAll(parentContainer)[0];
    const newTag = document.createElement('div');
    newTag.className = 'tag';
    newTag.addEventListener('mouseover', (event) => {
        event.target.style.color = 'rgb(96, 0, 0)';
        event.target.style.borderColor = 'rgb(96, 0, 0)';
        event.target.style.backgroundColor = 'rgb(255, 226, 226)';
        event.target.style.scale = 'none';
        event.target.style.animation = 'shake 0.65s infinite';
    });

    newTag.addEventListener('mouseout', (event) => {
        event.target.style.color = 'blue';
        event.target.style.borderColor = 'blue';
        event.target.style.backgroundColor = 'rgb(195, 226, 250)';
        event.target.style.animation = 'none';
    });    

    newTag.addEventListener('click', (event) => {
        event.target.remove();
        document.getElementById('tagSearch').disabled = false;
        document.getElementById('tagSearch').setAttribute('placeholder','#...');
        document.getElementById('tagSearch').focus();

    })
    
    if(tagName.split('')[0] != '#') {
        tagName = '#' + tagName;
    }
    newTag.innerText = tagName;

    parent.appendChild(newTag);
}

function checkNewThing(createTitle, dateSet, subMenu) {
    let valid = true;

    if ((createTitle.value == '') || (createTitle.value.split(' ').length == 0)) {
        subMenu[0].style.visibility = 'visible';
        valid = false;
    }

    if ((dateSet.value.substring(0, 2) > 12) || (dateSet.value.substring(3, 5) > 31)) {
        subMenu[1].style.visibility = 'visible';
        valid = false;
    }
    return valid;
}

function createNewThing(title, date, prioritySet, tags) {
    parentElement = document.getElementById('thingsContainer');
    const newThing = document.createElement('div');
    const thingHeader = document.createElement('div');
    const thingTitle = document.createElement('div');
    const lastWorked = document.createElement('div');
    const preview = document.createElement('div');
    const info = document.createElement('div');
    const thingTags = document.createElement('div');
    const stats = document.createElement('div');
    const timeSpent = document.createElement('div');
    const deadline = document.createElement('div');
    const priorityRank = document.createElement('div');

    newThing.className = "thing";
    newThing.appendChild(thingHeader);

    thingHeader.className = "thingHeader";
    thingHeader.appendChild(thingTitle);
    thingHeader.appendChild(lastWorked);

    thingTitle.className = "thingTitle";
    thingTitle.innerText = title;
    let currDate = (new Date().toLocaleDateString()).slice(0, 4);
    currDate.split('')[1] === '/' ? currDate = '0' + currDate : currDate;
    lastWorked.innerText = currDate;

    newThing.appendChild(preview);
    preview.className = "thingPreview";

    newThing.appendChild(info);
    info.className = "thingInfo";

    info.appendChild(thingTags);
    thingTags.className = "thingTags";
    tags.forEach((tag) => {
        let newTag = document.createElement('div');
        newTag.className = "tag";
        newTag.innerText = tag.innerText;
        thingTags.appendChild(newTag);
    })

    info.appendChild(stats);
    stats.className = "thingStats";

    stats.appendChild(timeSpent);
    timeSpent.innerHTML = "0:00 <i class='fa-regular fa-clock'>";
    timeSpent.className = "timeSpent";

    stats.appendChild(deadline);
    deadline.innerHTML = date + " <i class='fa-regular fa-calendar'>";
    deadline.className = "deadline";

    if (wideDisplay) {
        preview.style.display = 'none';

        newThing.style.justifyContent = 'space-between';
        newThing.style.width = '90%';
        newThing.style.height = '100px';

        info.style.height = '35%';
    } else {
        preview.style.display = 'flex';

        newThing.style.justifyContent = 'flex-start';
        newThing.style.width = `300px`;
        newThing.style.height = '300px';

        info.style.height = '60%';
    }

    if (prioritySet.querySelector('input[name="priority"]:checked')) {
        let priortyVal = prioritySet.querySelector('input[name="priority"]:checked').value;
        stats.appendChild(priorityRank);
        priorityRank.innerHTML = '';
        priorityRank.className = "priorty";
    
        for (let i = 0; i < priortyVal; i++) {
            priorityRank.innerHTML += "<i class='fa-solid fa-exclamation'></i>";
        }
    }

    parentElement.appendChild(newThing)
}

// Function to save notes to local storage
function saveNotes() {
    const stickies = document.getElementsByClassName('sticky');
    const notesData = [];
    Array.from(stickies).reverse().forEach((sticky, index) => {
        title = sticky.querySelector('.stickyTitle').value;
        content = sticky.querySelector('.stickyContent').value;

        if ((title == '') && (content == '')) {
            return;
        } else {
            notesData.push({
                title: title,
                content: content,
                date: sticky.querySelector('.dateCreated').textContent
            });
        }
    });
    
    localStorage.setItem('stickyNotes', JSON.stringify(notesData));
}

// Function to load notes from local storage
function loadNotes() {
    const savedNotes = localStorage.getItem('stickyNotes');
    if (savedNotes) {
        const notesData = JSON.parse(savedNotes);
        notesData.forEach(noteData => createSticky(noteData));
    }
}