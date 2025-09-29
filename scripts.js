document.addEventListener('DOMContentLoaded', () => {
    setInitialTheme();
    checkUser();

    // === Index (Login) Page ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        const motivationElement = document.getElementById('motivationLine');
        if (motivationElement) {
            motivationElement.textContent = randomMotivation;
        }

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username && password) {
                localStorage.setItem('planner_username', username);
                window.location.href = 'dashboard.html';
            } else {
                alert('Please enter both username and password.');
            }
        });
    }

    // === Dashboard Page ===
    const isDashboardPage = window.location.pathname.endsWith('dashboard.html');
    if (isDashboardPage) {
        const motivationElement = document.getElementById('motivationLine');
        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
        if (motivationElement) {
            motivationElement.textContent = randomMotivation;
        }
    }

    // === Tasks Page ===
    const taskInput = document.getElementById('newTaskInput');
    const taskList = document.getElementById('taskList');
    if (taskInput && taskList) {
        loadTasks();

        const addTaskButton = document.querySelector('.task-input-container button');
        if (addTaskButton) {
            addTaskButton.addEventListener('click', addTask);
        }

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });
    }

    function saveTasks(tasks) { localStorage.setItem('planner_tasks', JSON.stringify(tasks)); }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('planner_tasks')) || [];
        tasks.forEach(task => displayTask(task));
    }

    function displayTask(task) { 
        const li = document.createElement('li');
        li.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task, li));
        
        const textSpan = document.createElement('span');
        textSpan.textContent = task.text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', () => deleteTask(task, li));
        
        li.appendChild(checkbox);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        
        if (task.completed) {
            li.classList.add('completed');
        }
        
        if (document.body.classList.contains('dark-theme')) {
            li.classList.add('dark-theme');
        }
        
        taskList.appendChild(li);
    }

    function addTask() { 
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        
        const tasks = JSON.parse(localStorage.getItem('planner_tasks')) || [];
        const newTask = {
            text: taskText,
            completed: false,
            id: Date.now()
        };
        tasks.push(newTask);
        saveTasks(tasks);
        displayTask(newTask);
        taskInput.value = '';
    }

    function toggleTaskCompletion(task, listItem) { 
        task.completed = !task.completed;
        if (task.completed) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
        const tasks = JSON.parse(localStorage.getItem('planner_tasks')) || [];
        const taskIndex = tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = task.completed;
            saveTasks(tasks);
        }
    }

    function deleteTask(task, listItem) { 
        listItem.remove();
        let tasks = JSON.parse(localStorage.getItem('planner_tasks')) || [];
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks(tasks);
    }

    // === Profile Page ===
    const educationLevel = document.getElementById('education-level');
    if (educationLevel) {
        educationLevel.addEventListener('change', (e) => {
            const schoolLabel = document.getElementById('school-label');
            const schoolClass = document.getElementById('school-class');
            const collegeLabel = document.getElementById('college-label');
            const collegeDetails = document.getElementById('college-details');

            if (schoolLabel) schoolLabel.style.display = 'none';
            if (schoolClass) schoolClass.style.display = 'none';
            if (collegeLabel) collegeLabel.style.display = 'none';
            if (collegeDetails) collegeDetails.style.display = 'none';

            if (e.target.value === 'school') {
                if (schoolLabel) schoolLabel.style.display = 'block';
                if (schoolClass) schoolClass.style.display = 'block';
            } else if (e.target.value === 'college') {
                if (collegeLabel) collegeLabel.style.display = 'block';
                if (collegeDetails) collegeDetails.style.display = 'block';
            }
        });
    }

    // === Diary Page ===
    const unlockBtn = document.getElementById('unlock-btn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            const pinInput = document.getElementById('pin-input').value;
            const storedPin = localStorage.getItem('diary_pin');
            const diaryLock = document.getElementById('diary-lock');
            const diaryContent = document.getElementById('diary-content');

            if (!storedPin) {
                if (pinInput.length >= 4) {
                    localStorage.setItem('diary_pin', pinInput);
                    alert('PIN set successfully! You can now write your diary.');
                    if (diaryLock) diaryLock.style.display = 'none';
                    if (diaryContent) diaryContent.style.display = 'block';
                } else {
                    alert('Please enter a PIN with at least 4 digits.');
                }
            } else {
                if (pinInput === storedPin) {
                    alert('Diary unlocked!');
                    if (diaryLock) diaryLock.style.display = 'none';
                    if (diaryContent) diaryContent.style.display = 'block';
                } else {
                    alert('Incorrect PIN. Please try again.');
                }
            }
        });
    }

    // === Drawing Page ===
    const canvas = document.getElementById('drawing-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('color-picker');
        const clearBtn = document.getElementById('clear-btn');
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;

        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => { ctx.strokeStyle = e.target.value; });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => { ctx.clearRect(0, 0, canvas.width, canvas.height); });
        }
        
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; [lastX, lastY] = [e.offsetX, e.offsetY]; });
        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
            [lastX, lastY] = [e.offsetX, e.offsetY];
        });
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);
    }

    // === Dictionary Page ===
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const word = document.getElementById('word-input').value;
            if (word.trim() === '') return;
            // API call logic would go here
        });
    }

    // === Calendar Page ===
    const calendarGrid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('currentMonthYear');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const today = new Date();

        if (monthYearEl) {
            monthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        }
        
        if (calendarGrid) {
            // Clear previous calendar days, but keep the header
            const dayElements = calendarGrid.querySelectorAll('.calendar-day, .empty');
            dayElements.forEach(el => el.remove());

            // Add empty days for the start of the month
            for (let i = 0; i < firstDay.getDay(); i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'calendar-day empty';
                calendarGrid.appendChild(emptyDiv);
            }

            // Add days of the month
            for (let i = 1; i <= lastDay.getDate(); i++) {
                const dayDiv = document.createElement('div');
                dayDiv.className = 'calendar-day';
                dayDiv.textContent = i;
                
                // Highlight the current day
                if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
                    dayDiv.classList.add('current-day');
                }

                // Apply dark theme if active
                if (document.body.classList.contains('dark-theme')) {
                    dayDiv.classList.add('dark-theme');
                }
                
                calendarGrid.appendChild(dayDiv);
            }
        }
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
        
        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
        
        renderCalendar(); // Initial render
    }
    
    // ======================================
    // === NEW LOGOUT FUNCTIONALITY ADDED ===
    // ======================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevents the link from immediately navigating
            
            // Removes the username from local storage, effectively logging the user out.
            localStorage.removeItem('planner_username');
            
            // Redirects the user to the login page.
            window.location.href = 'index.html'; 
        });
    }
});