document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    
    const globalDeadline = document.getElementById("globalDeadline");
    const countdownDisplay = document.getElementById("countdownDisplay");

    let countdownInterval;

    // --- FUNCTION 1: LIVE COUNTDOWN LOGIC ---
    function updateCountdown() {
        const deadlineTime = globalDeadline.value;
        if (!deadlineTime) {
            countdownDisplay.textContent = "No deadline set";
            return;
        }

        const now = new Date();
        const target = new Date();
        
        // Split input hours and minutes
        const [hours, minutes] = deadlineTime.split(":");
        target.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If the deadline set has already passed today, target tomorrow's time
        if (target <= now) {
            target.setDate(target.getDate() + 1);
        }

        const timeDiff = target - now;

        // Turn difference into Hours, Minutes, and Seconds
        const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000);

        // Pad with zeros for clean look (04:02:09)
        const displayHours = String(hoursLeft).padStart(2, '0');
        const displayMinutes = String(minutesLeft).padStart(2, '0');
        const displaySeconds = String(secondsLeft).padStart(2, '0');

        countdownDisplay.textContent = `⏳ ${displayHours}:${displayMinutes}:${displaySeconds} Remaining`;
    }

    // Start the live ticker whenever the user chooses a target time
    globalDeadline.addEventListener("input", () => {
        clearInterval(countdownInterval);
        updateCountdown();
        countdownInterval = setInterval(updateCountdown, 1000);
    });


    // --- FUNCTION 2: ADDING TASKS WITH INLINE TIME ---
    function addTask() {
        const taskText = taskInput.value.trim();
        const startVal = startTime.value;
        const endVal = endTime.value;

        if (taskText === "") {
            alert("Please enter an activity first!");
            return;
        }

        // Create main list element
        const li = document.createElement("li");
        
        // Span wrapper for task text
        const textSpan = document.createElement("span");
        textSpan.classList.add("task-text");
        textSpan.textContent = taskText;
        li.appendChild(textSpan);

        // Append time badge NEXT to item if parameters exist
        if (startVal || endVal) {
            const timeBadge = document.createElement("span");
            timeBadge.classList.add("task-time-badge");
            
            if (startVal && endVal) {
                timeBadge.textContent = `${startVal} - ${endVal}`;
            } else if (startVal) {
                timeBadge.textContent = `Start: ${startVal}`;
            } else {
                timeBadge.textContent = `End: ${endVal}`;
            }
            li.appendChild(timeBadge);
        }

        // Cross out functionality
        li.addEventListener("click", () => {
            li.classList.toggle("completed");
        });

        taskList.appendChild(li);

        // Clear individual item inputs
        taskInput.value = "";
        startTime.value = "";
        endTime.value = "";
    }

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });
});