document.addEventListener('DOMContentLoaded', () => {
    const chapterForm = document.getElementById('chapterForm');
    const subjectSelect = document.getElementById('subjectSelect');
    const chapterInput = document.getElementById('chapterInput');
    const overallProgressBar = document.getElementById('overallProgressBar');
    const overallProgressText = document.getElementById('overallProgressText');

    let subjects = {
        Physics: [],
        Chemistry: [],
        Maths: []
    };

    // Load data from localStorage
    if (localStorage.getItem('subjects')) {
        subjects = JSON.parse(localStorage.getItem('subjects'));
    }

    chapterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addChapter(subjectSelect.value, chapterInput.value);
        chapterInput.value = '';
        subjectSelect.value = '';
    });

    function addChapter(subject, name) {
        const chapter = {
            name: name,
            tasks: []
        };
        subjects[subject].push(chapter);
        saveAndRenderChapters();
    }

    function renderChapters() {
        Object.keys(subjects).forEach(subject => {
            const subjectElement = document.getElementById(subject);
            const chapterList = subjectElement.querySelector('.chapterList');
            chapterList.innerHTML = '';

            subjects[subject].forEach((chapter, chapterIndex) => {
                const chapterItem = document.createElement('li');

                const chapterHeader = document.createElement('div');
                const chapterName = document.createTextNode(`${chapter.name}`);
                const addTaskButton = document.createElement('button');
                addTaskButton.textContent = 'Add Task';
                addTaskButton.addEventListener('click', () => {
                    const taskName = prompt('Enter task:');
                    if (taskName) {
                        addTask(subject, chapterIndex, taskName);
                    }
                });
                
                const deleteChapterButton = document.createElement('button');
                deleteChapterButton.textContent = 'Delete Chapter';
                deleteChapterButton.addEventListener('click', () => {
                    deleteChapter(subject, chapterIndex);
                });

                chapterHeader.appendChild(chapterName);
                chapterHeader.appendChild(addTaskButton);
                chapterHeader.appendChild(deleteChapterButton);
                chapterItem.appendChild(chapterHeader);

                const taskList = document.createElement('ul');
                chapter.tasks.forEach((task, taskIndex) => {
                    const taskItem = document.createElement('li');
                    const taskCheckbox = document.createElement('input');
                    taskCheckbox.type = 'checkbox';
                    taskCheckbox.checked = task.completed;
                    taskCheckbox.addEventListener('change', () => {
                        toggleTask(subject, chapterIndex, taskIndex);
                    });
                    taskItem.appendChild(taskCheckbox);
                    taskItem.appendChild(document.createTextNode(`${taskIndex + 1}) ${task.name}`));
                    taskList.appendChild(taskItem);
                });
                chapterItem.appendChild(taskList);

                chapterList.appendChild(chapterItem);
            });
        });
        updateProgress();
    }

    function addTask(subject, chapterIndex, taskName) {
        subjects[subject][chapterIndex].tasks.push({
            name: taskName,
            completed: false
        });
        saveAndRenderChapters();
    }

    function toggleTask(subject, chapterIndex, taskIndex) {
        subjects[subject][chapterIndex].tasks[taskIndex].completed = !subjects[subject][chapterIndex].tasks[taskIndex].completed;
        saveAndRenderChapters();
    }

    function deleteChapter(subject, chapterIndex) {
        subjects[subject].splice(chapterIndex, 1);
        saveAndRenderChapters();
    }

    function updateProgress() {
        let completedTasks = 0;
        let totalTasks = 0;

        Object.keys(subjects).forEach(subject => {
            subjects[subject].forEach(chapter => {
                chapter.tasks.forEach(task => {
                    if (task.completed) {
                        completedTasks++;
                    }
                    totalTasks++;
                });
            });
        });

        const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
        overallProgressBar.style.width = `${progress}%`;
        overallProgressText.textContent = `Overall Progress: ${completedTasks} / ${totalTasks} tasks completed (${progress.toFixed(2)}%)`;

        // Save progress to localStorage
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }

    function saveAndRenderChapters() {
        localStorage.setItem('subjects', JSON.stringify(subjects));
        renderChapters();
    }

    renderChapters();
});
