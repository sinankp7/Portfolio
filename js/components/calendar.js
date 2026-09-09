!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendy — Your Friendly Calendar</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --bg: #0f172a;
            --surface: #1e293b;
            --surface-alt: #334159;
            --primary: #3b82f6;
            --primary-hover: #2563eb;
            --accent: #a78bfa;
            --success: #22c55e;
            --warning: #f59e0b;
            --danger: #ef4444;
            --text: #e2e8f0;
            --text-secondary: #94a3b8;
            --border: #475569;
            --today: #3b82f6;
            --today-bg: rgba(59, 130, 246, 0.15);
            --radius-lg: 16px;
            --radius-md: 12px;
            --radius-sm: 8px;
            --shadow: 0 10px 25px rgba(0,0,0,0.3);
            --shadow-hover: 0 15px 35px rgba(0,0,0,0.4);
            --transition: all 0.3s ease;
        }
        body {
            font-family: 'Inter', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.5;
        }
        .app-container { max-width: 1100px; margin: 0 auto; }
        header {
            background: linear-gradient(135deg, var(--surface), var(--surface-alt));
            border-radius: var(--radius-lg);
            padding: 24px 32px;
            margin-bottom: 24px;
            box-shadow: var(--shadow);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        header h1 {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .header-left { display: flex; align-items: center; gap: 16px; }
        .nav-btn {
            background: var(--primary);
            color: #fff;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .nav-btn:hover {
            background: var(--primary-hover);
            transform: scale(1.08);
            box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4);
        }
        .nav-btn:active { transform: scale(0.96); }
        .month-year {
            font-size: 1.5rem;
            font-weight: 600;
            min-width: 220px;
            text-align: center;
        }
        .today-btn {
            background: var(--surface-alt);
            color: var(--text);
            border: 1px solid var(--border);
            padding: 10px 24px;
            border-radius: var(--radius-md);
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: var(--transition);
        }
        .today-btn:hover {
            background: var(--primary);
            color: #fff;
        }
        .calendar {
            background: var(--surface);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        .day-names {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            background: var(--surface-alt);
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .day-names div {
            padding: 16px 12px;
            text-align: center;
            color: var(--text-secondary);
        }
        .day-names div:first-child { color: var(--danger); }
        .day-names div:last-child { color: var(--primary); }
        .days-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
        .day-cell {
            min-height: 110px;
            padding: 8px;
            border-bottom: 1px solid var(--border);
            border-right: 1px solid var(--border);
            cursor: pointer;
            transition: var(--transition);
            position: relative;
            vertical-align: top;
        }
        .day-cell:hover { background: var(--today-bg); }
        .day-cell:last-child { border-right: none; }
        .other-month {
            opacity: 0.35;
            cursor: default;
        }
        .other-month:hover { background: transparent; }
        .date-number { font-size: 0.95rem; font-weight: 500; }
        .today .date-number {
            color: var(--today);
            font-weight: 700;
        }
        .today::before {
            content: '';
            position: absolute;
            top: 8px;
            right: 8px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--today);
                        box-shadow: 0 0 0 2px var(--today-bg);
        }

        .event-list { margin-top: 6px; }
        .event-item {
            background: var(--primary);
            color: #fff;
            padding: 6px 10px;
            border-radius: var(--radius-sm);
            margin-bottom: 4px;
            font-size: 0.8rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .event-item:hover { transform: translateX(3px); }
        .event-time { opacity: 0.85; margin-right: 6px; font-size: 0.78rem; }
        .event-title { flex: 1; overflow: hidden; text-overflow: ellipsis; }
        .event-actions {
            display: flex;
            gap: 4px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        .event-item:hover .event-actions { opacity: 1; }
        .event-actions button {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            width: 22px;
            height: 22px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.7rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--transition);
        }
                .event-actions button:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.15);
        }
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: var(--transition);
            z-index: 100;
        }
        .modal-overlay.active { opacity: 1; visibility: visible; }
        .modal {
            background: var(--surface);
            border-radius: var(--radius-lg);
            padding: 32px;
            width: 90%;
            max-width: 500px;
            box-shadow: var(--shadow-hover);
            transform: scale(0.92);
            transition: var(--transition);
        }
        .modal-overlay.active .modal { transform: scale(1); }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .modal-header h2 { font-size: 1.5rem; font-weight: 600; }
        .modal-close {
            background: var(--surface-alt);
            border: none;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            color: var(--text-secondary);
            transition: var(--transition);
        }
        .modal-close:hover { background: var(--danger); color: #fff; }
        .form-group { margin-bottom: 20px; }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 0.95rem;
            color: var(--text-secondary);
        }
        .form-group input {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid var(--border);
            border-radius: var(--radius-md);
            background: var(--bg);
            color: var(--text);
            font-size: 1rem;
            transition: var(--transition);
        }
        .form-group input:focus {
            outline: none;
            border-color: var(--primary);
            background: var(--surface-alt);
        }
        .form-row { display: flex; gap: 16px; }
        .form-row .form-group { flex: 1; }
        .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 8px;
        }
        .btn {
            padding: 12px 28px;
            border-radius: var(--radius-md);
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            border: none;
        }
        .btn-secondary { background: var(--surface-alt); color: var(--text); }
        .btn-secondary:hover { background: var(--border); }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
        }
                .btn-danger { background: var(--danger); color: #fff; }
        .notifications {
            position: fixed;
            top: 24px;
            right: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 200;
            max-width: 400px;
        }
        .notification {
            background: var(--surface);
            border-left: 4px solid var(--primary);
            padding: 18px 22px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            transform: translateX(420px);
            opacity: 0;
            transition: all 0.4s ease;
            color: var(--text);
        }
        .notification.show { transform: translateX(0); opacity: 1; }
        .notification.show.leaving { transform: translateX(420px); opacity: 0; }
        .notification-icon { font-size: 1.4rem; min-width: 24px; margin-top: 2px; }
        .notification.success { border-left-color: var(--success); }
        .notification.success .notification-icon { color: var(--success); }
        .notification.warning { border-left-color: var(--warning); }
        .notification.warning .notification-icon { color: var(--warning); }
        .notification.error { border-left-color: var(--danger); }
        .notification.error .notification-icon { color: var(--danger); }
        .notification-info { border-left-color: var(--primary); }
        .notification-info .notification-icon { color: var(--primary); }
        .notification-content { flex: 1; }
        .notification-content .notif-title { font-weight: 600; margin-bottom: 2px; }
        .notification-content .notif-body {
            font-size: 0.88rem;
            color: var(--text-secondary);
        }
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.1rem;
            padding: 4px;
            transition: var(--transition);
        }
        .notification-close:hover { color: var(--danger); }
        @media (max-width: 768px) {
            body { padding: 12px; }
            header {
                flex-direction: column;
                align-items: center;
                padding: 20px;
            }
            header h1 { font-size: 1.5rem; }
            .day-names div { padding: 12px 6px; font-size: 0.75rem; }
            .day-cell { min-height: 90px; padding: 6px; }
            .date-number { font-size: 0.85rem; }
            .event-item { font-size: 0.75rem; padding: 5px 8px; }
            .modal { padding: 24px; width: 95%; }
            .form-row { flex-direction: column; gap: 0; }
            .notifications { top: 16px; right: 16px; max-width: 90%; }
        }
        @media (max-width: 480px) {
            .day-names div { font-size: 0.7rem; }
            .day-cell { min-height: 75px; }
            .date-number { font-size: 0.8rem; }
            .delete-confirmation { font-size: 0.85rem; }
        }
        @keyframes pulse-glow {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
            70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .today .date-number {
            animation: pulse-glow 2s ease-in-out 0s infinite;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <header>
            <div class="header-left">
                <button class="nav-btn" id="prevMonth" title="Previous month">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="month-year" id="monthYear">September 2025</div>
                <button class="nav-btn" id="nextMonth" title="Next month">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <button class="today-btn" id="todayBtn">
                <i class="fas fa-clock"></i> Today
            </button>
        </header>
        <div class="calendar">
            <div class="day-names">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
                        <div class="days-grid" id="daysGrid"></div>
        </div>
    </div>

    <!-- ===== EVENT MODAL ===== -->
    <div class="modal-overlay" id="eventModal">
        <div class="modal">
            <div class="modal-header">
                <h2 id="modalTitle">Add Event</h2>
                <button class="modal-close" id="modalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form id="eventForm">
                <div class="form-group">
                    <label for="eventTitle">Event Title</label>
                    <input type="text" id="eventTitle" placeholder="What's happening?" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="eventDate">Date</label>
                        <input type="date" id="eventDate" required>
                    </div>
                    <div class="form-group">
                        <label for="eventTime">Time</label>
                        <input type="time" id="eventTime" required>
                    </div>
                </div>
                <div class="delete-confirmation" id="deleteConfirmation" style="display: none;">
                    Are you sure you want to <strong>delete</strong> this event?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="button" class="btn btn-danger" id="deleteBtn" style="display: none;">
                        Delete
                    </button>
                    <button type="submit" class="btn btn-primary" id="saveBtn">Save Event</button>
                </div>
            </form>
        </div>
    </div>

    <!-- ===== NOTIFICATIONS CONTAINER ===== -->
    <div class="notifications" id="notifications"></div>

        <script>
        // ===== STATE =====
        let currentDate = new Date();
        let events = [];
        let editingEventId = null;

        // ===== UTILS =====
        function parseDate(str) {
            const [year, month, day] = str.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        function formatDate(date) {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + d;
        }

        function generateId() {
            return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        }

        function formatTimeDisplay(timeStr) {
            if (!timeStr) return '';
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 === 0 ? 12 : h % 12;
            return h12 + ':' + minutes + ' ' + ampm;
        }

        function formatDateDisplay(dateStr) {
            const date = parseDate(dateStr);
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        // ===== STORAGE =====
        function saveEvents() {
            try {
                localStorage.setItem('calendy_events', JSON.stringify(events));
            } catch (e) {
                console.error('Failed to save events:', e);
                showNotification("Oops! I had trouble saving your events. \uD83D\x99\x94", 'error');
            }
        }

        function loadEvents() {
            try {
                const stored = localStorage.getItem('calendy_events');
                events = stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('Failed to load events:', e);
                showNotification("Hmm, couldn\u2019t load your saved events. They might be corrupted. \uD83D\x98\xAC", 'error');
                events = [];
            }
                }

        // ===== NOTIFICATIONS =====
        function showNotification(message, type, title) {
            const container = document.getElementById('notifications');

            if (!title) {
                var titles = {
                    success: 'All good!',
                    warning: 'A heads-up',
                    error: 'Something went wrong',
                    info: 'Hey there!'
                };
                title = titles[type] || titles.info;
            }

            var notif = document.createElement('div');
            notif.className = 'notification ' + type;
            notif.setAttribute('data-notification-id', generateId());

            var iconMap = {
                success: 'check-circle',
                warning: 'exclamation-triangle',
                error: 'times-circle',
                info: 'info-circle'
            };

            notif.innerHTML =
                '<div class="notification-icon">' +
                    '<i class="fas fa-' + (iconMap[type] || 'info-circle') + '"></i>' +
                '</div>' +
                '<div class="notification-content">' +
                    '<div class="notif-title">' + title + '</div>' +
                    '<div class="notif-body">' + message + '</div>' +
                '</div>' +
                '<button class="notification-close" onclick="removeNotification(this)">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';

            container.appendChild(notif);

            setTimeout(function() {
                notif.classList.add('show');
            }, 10);

            var notifDelay = type === 'info' ? 4000 : 5000;
            var autoRemove = setTimeout(function() {
                removeNotification(null, notif);
            }, notifDelay);

            var closeBtn = notif.querySelector('.notification-close');
            closeBtn.addEventListener('click', function() {
                clearTimeout(autoRemove);
            });
        }

        function removeNotification(buttonEl, notificationEl) {
            var notif = notificationEl ||
                (buttonEl ? buttonEl.closest('.notification') : null);
            if (!notif) return;

            notif.classList.remove('show');
            notif.classList.add('leaving');

            notif.addEventListener('transitionend', function() {
                notif.remove();
                        }, { once: true });
        }

        // ===== CALENDAR RENDERING =====
        function renderCalendar() {
            var today = new Date();
            today.setHours(0, 0, 0, 0);

            var year = currentDate.getFullYear();
            var month = currentDate.getMonth();
            var firstDay = new Date(year, month, 1).getDay();
            var daysInMonth = new Date(year, month + 1, 0).getDate();
            var daysInPrevMonth = new Date(year, month, 0).getDate();

            var grid = document.getElementById('daysGrid');
            var monthYearLabel = document.getElementById('monthYear');

            var monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            monthYearLabel.textContent = monthNames[month] + ' ' + year;

            var html = '';

            // Previous month trailing days
            for (var i = firstDay; i > 0; i--) {
                var prevDate = new Date(year, month - 1, daysInPrevMonth - i + 1);
                var prevDateStr = formatDate(prevDate);
                html += renderDayCell(prevDate.getDate(), prevDateStr, true, 'other-month');
            }

            // Current month days
            for (var d = 1; d <= daysInMonth; d++) {
                var cellDate = new Date(year, month, d);
                var cellDateStr = formatDate(cellDate);

                var isToday = cellDate.getTime() === today.getTime();
                var classes = '';
                if (isToday) classes += 'today ';

                html += renderDayCell(d, cellDateStr, false, classes, cellDateStr);
            }

            // Next month leading days
            var totalCells = firstDay + daysInMonth;
            var remainingCells = totalCells % 7;
            var nextDays = remainingCells > 0 ? 7 - remainingCells : 0;

            for (var nd = 1; nd <= nextDays; nd++) {
                var nextDate = new Date(year, month + 1, nd);
                var nextDateStr = formatDate(nextDate);
                html += renderDayCell(nd, nextDateStr, true, 'other-month');
            }

            grid.innerHTML = html;
        }

        function renderDayCell(dayNumber, dateStr, isOtherMonth, extraClasses, eventDateStr) {
            var classes = 'day-cell ' + (extraClasses || '').trim();
            var dayEvents = eventDateStr
                ? events.filter(function(e) { return e.date === eventDateStr; })
                : [];

            var eventsHtml = '';
            var maxVisible = 3;
            var visibleEvents = dayEvents.slice(0, maxVisible);
            var remainingCount = dayEvents.length - visibleEvents.length;

            var colors = ['#3b82f6', '#22c55e', '#a78bfa', '#f59e0b', '#ef4444'];

            visibleEvents.forEach(function(event) {
                var colorIdx = parseInt(event.id, 36) % colors.length;
                var eventColor = colors[colorIdx];

                eventsHtml +=
                    '<div class="event-item" style="background: ' + eventColor + '"' +
                    ' data-event-id="' + event.id + '"' +
                    ' data-date="' + dateStr + '"' +
                    ' onclick="openEditEvent(\'' + event.id + '\')" title="' + event.title + '">' +
                    '<span class="event-time">' + formatTimeDisplay(event.time) + '</span>' +
                    '<span class="event-title" title="' + event.title + '">' + escapeHtml(event.title) + '</span>' +
                    '<span class="event-actions" onclick="event.stopPropagation()">' +
                    '<button onclick="openEditEvent(\'' + event.id + '\')" title="Edit event">' +
                    '<i class="fas fa-edit"></i></button>' +
                    '<button onclick="confirmDeleteEvent(\'' + event.id + '\')" title="Delete event">' +
                    '<i class="fas fa-trash"></i></button>' +
                    '</span>' +
                    '</div>';
            });

            if (remainingCount > 0) {
                eventsHtml += '<div class="event-item" style="background: var(--surface-alt); color: var(--text-secondary); font-size: 0.75rem; padding: 4px 8px;" data-date="' + dateStr + '">' +
                    '+' + remainingCount + ' more' +
                    '</div>';
            }

            var cellContent = '<span class="date-number">' + dayNumber + '</span>';
            if (eventsHtml) {
                cellContent += '<div class="event-list">' + eventsHtml + '</div>';
            }

            return '<div class="' + classes + '" data-date="' + dateStr + '">' + cellContent + '</div>';
        }

        function escapeHtml(text) {
            if (!text) return '';
            var div = document.createElement('div');
            div.textContent = text;
                        return div.innerHTML;
        }

        // ===== EVENT HANDLERS =====
        function openAddEvent(dateStr) {
            editingEventId = null;
            document.getElementById('modalTitle').textContent = 'Add an Event';
            document.getElementById('eventTitle').value = '';
            document.getElementById('eventDate').value = dateStr;
            document.getElementById('eventTime').value = '';
            document.getElementById('deleteBtn').style.display = 'none';
            document.getElementById('deleteConfirmation').style.display = 'none';
            document.getElementById('saveBtn').textContent = 'Save Event';
            document.getElementById('eventModal').classList.add('active');
            document.getElementById('eventTitle').focus();
        }

        function openEditEvent(eventId) {
            var event = events.find(function(e) { return e.id === eventId; });
            if (!event) {
                showNotification("Hmm, I couldn't find that event. It may have been deleted. \uD83D\x98\x95", 'warning');
                return;
            }

            editingEventId = eventId;
            document.getElementById('modalTitle').textContent = 'Edit Event';
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventTime').value = event.time;
            document.getElementById('deleteBtn').style.display = 'inline-flex';
            document.getElementById('deleteConfirmation').style.display = 'block';
            document.getElementById('saveBtn').textContent = 'Save Changes';
            document.getElementById('eventModal').classList.add('active');
            document.getElementById('eventTitle').focus();
        }

        function saveEvent() {
            var title = document.getElementById('eventTitle').value.trim();
            var date = document.getElementById('eventDate').value;
            var time = document.getElementById('eventTime').value;

            if (!title || !date || !time) {
                showNotification("Hold up — every event needs a title, a date, and a time! \u270D\xEF\xB8\x8F", 'warning');
                return;
            }

            if (editingEventId) {
                var eventIndex = events.findIndex(function(e) { return e.id === editingEventId; });
                if (eventIndex !== -1) {
                    events[eventIndex] = { id: editingEventId, title: title, date: date, time: time };
                    showNotification('Your event \u201c' + title + '\u201d has been updated. \u2728', 'success');
                }
            } else {
                events.push({ id: generateId(), title: title, date: date, time: time });
                showNotification(
                    'Nice! \u201c' + title + '\u201d is on the calendar for ' +
                    formatDateDisplay(date) + ' at ' + formatTimeDisplay(time) + '. \uD83C\x98\x89',
                    'success'
                );
            }

            saveEvents();
            renderCalendar();
            closeModal();
        }

        function confirmDeleteEvent(eventId) {
            closeModal();

            var event = events.find(function(e) { return e.id === eventId; });
            if (!event) return;

            var notif = document.createElement('div');
            notif.className = 'notification warning';

            notif.innerHTML =
                '<div class="notification-icon"><i class="fas fa-exclamation-triangle"></i></div>' +
                '<div class="notification-content">' +
                '<div class="notif-title">Wait a second\u2026</div>' +
                '<div class="notif-body">' +
                'You\u2019re about to delete \u201c' + escapeHtml(event.title) + '\u201d scheduled for ' +
                formatDateDisplay(event.date) + ' at ' + formatTimeDisplay(event.time) + '.' +
                ' Really sure?' +
                '</div>' +
                '</div>' +
                '<button class="notification-close" onclick="removeNotification(this)">' +
                '<i class="fas fa-times"></i></button>' +
                '<button class="btn btn-danger" style="margin-left: 8px; padding: 6px 16px; font-size: 0.85rem;"' +
                ' onclick="confirmDeleteFinal(\'' + event.id + '\'); removeNotification(null, this.closest(\'.notification\'))">' +
                'Yes, delete it</button>';

            document.getElementById('notifications').appendChild(notif);
            setTimeout(function() { notif.classList.add('show'); }, 10);
        }

        function confirmDeleteFinal(eventId) {
            var eventIndex = events.findIndex(function(e) { return e.id === eventId; });
            if (eventIndex !== -1) {
                var deleted = events.splice(eventIndex, 1)[0];
                saveEvents();
                renderCalendar();
                showNotification(
                    '\u201cP' + deleted.title + '\u201d has been removed from your calendar. \uD83D\x95\x92',
                    'success'
                );
            }
        }

        function deleteEventFromModal() {
            if (!editingEventId) return;

            var event = events.find(function(e) { return e.id === editingEventId; });
            if (!event) return;

            var eventIndex = events.findIndex(function(e) { return e.id === editingEventId; });
            events.splice(eventIndex, 1);
            saveEvents();
            renderCalendar();
            showNotification(
                '\u201c' + event.title + '\u201d was deleted. Hope it wasn\u2019t too important! \uD83D\x98\x8B',
                'info'
            );
            closeModal();
        }

                function closeModal() {
            document.getElementById('eventModal').classList.remove('active');
            editingEventId = null;
        }

        // ===== DATE NAVIGATION =====
        function prevMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        }

        function goToToday() {
            var oldMonth = currentDate.getMonth();
            currentDate = new Date();
            if (oldMonth !== currentDate.getMonth()) {
                renderCalendar();
            }
            showNotification("Back to today! \uD83D\x94\xB9", 'info');
        }

        // ===== INITIALIZATION =====
        function init() {
            loadEvents();
            renderCalendar();

            // Navigation buttons
            document.getElementById('prevMonth').addEventListener('click', prevMonth);
            document.getElementById('nextMonth').addEventListener('click', nextMonth);
            document.getElementById('todayBtn').addEventListener('click', goToToday);

            // Calendar cell click (event delegation)
            document.getElementById('daysGrid').addEventListener('click', function(e) {
                var cell = e.target.closest('.day-cell');
                if (!cell) return;
                if (cell.classList.contains('other-month')) return;
                var dateStr = cell.getAttribute('data-date');
                if (!dateStr) return;
                openAddEvent(dateStr);
            });

            // Modal buttons
            document.getElementById('cancelBtn').addEventListener('click', closeModal);
            document.getElementById('modalClose').addEventListener('click', closeModal);

            // Form submission
            document.getElementById('eventForm').addEventListener('submit', function(e) {
                e.preventDefault();
                saveEvent();
            });

            // Delete from modal
            document.getElementById('deleteBtn').addEventListener('click', deleteEventFromModal);

            // Close modal on backdrop click
            document.getElementById('eventModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeModal();
                }
            });

            // Keyboard shortcuts
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    var modal = document.getElementById('eventModal');
                    if (modal.classList.contains('active')) {
                        closeModal();
                    }
                }
                if (document.activeElement === document.body) {
                    if (e.key === 'ArrowLeft') {
                        prevMonth();
                    } else if (e.key === 'ArrowRight') {
                        nextMonth();
                    }
                }
            });

            // Welcome notification
            showNotification(
                "Welcome back! \uD83D\x9D\x8B Click any date to add events, or use the arrow keys to flip months. Your events are saved automatically. \uD83D\x92\xBE",
                'info',
                'Calendy is ready!'
            );

            // Check for events happening today and notify
            checkTodayReminders();
        }

        /** Show reminders for events happening today */
        function checkTodayReminders() {
            var today = new Date();
            var todayStr = formatDate(today);
            var todayEvents = events.filter(function(e) { return e.date === todayStr; });

            if (todayEvents.length === 0) return;

            todayEvents.forEach(function(event, index) {
                setTimeout(function() {
                    showNotification(
                        "You have \u201c" + event.title + "\u201d today at " + formatTimeDisplay(event.time) + ". Don\u2019t forget! \uD83D\x94\xB9",
                        'info',
                        'Friendly reminder'
                    );
                }, 1500 + index * 2000);
            });
        }

        // Initialize the app
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    </script>
</body>
</html>
