/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */

$(function () {
    /* ######### Model #########*/
    let model = {
        course: [{
            name: [
                "Slappy the Frog",
                "Lilly the Lizard",
                "Paulrus the Walrus",
                "Gregory the Goat",
                "Adam the Anaconda",
            ]
        }, {
            daysOfCourse: 12
        }],
        daysOfCourse: 12,
        init: function () {
            if (!localStorage.attendance) {
                let attendance = {};
                let students = model.course[0].name;
                let days = model.course[1].daysOfCourse;
                students.forEach(student => {
                    let name = student;
                    attendance[name] = [];
                    let randomStudentAttendence = octapus.setRandom(days);
                    // set a random data for each student
                    attendance[name] = randomStudentAttendence;
                });
                localStorage.attendance = JSON.stringify(attendance);
            }
        },
        update: function (arr, name) {
            let students = JSON.parse(localStorage.attendance);
            students[name] = arr;
            localStorage.attendance = JSON.stringify(students);
        },
        getAllAttendance: function () {
            return JSON.parse(localStorage.attendance);
        },
    };

    /* ######### ocatpus #########*/
    let octapus = {
        getCourse: function () {
            return model.getAllAttendance();
        },
        setRandom: function (days) {
            let value = []
            for (let i = 0; i < days; i++) {
                value.push((Math.random() >= 0.5))
            }
            return value;
        },
        getDays: function () {
            return model.course[1].daysOfCourse;
        },
        setAttendence: function (arr, name) {
            model.update(arr, name);
        },

        init: function () {
            model.init();
            view.init();
        },



    };

    /* ######### view #########*/
    let view = {
        init: function () {
            let course = octapus.getCourse();
            let days = octapus.getDays();
            // creates a <table> element and a <tbody> element
            let html = "";
            // careate the <thead> section
            html += `
            <thead>    
                <tr>
                    <th class="name-col">Student Name</th>`;
            for (let i = 1; i <= days; i++) {
                html += `<th>${i}</th>`;
            }
            html += ` <th class="missed-col">Days Missed-col</th>
                    </tr>
                </thead>`;

            $("#tbl").append(html);
            /*################# */
            html = "";
            html += `<tbody>`;
            // careate the <tbody> section
            $.each(course, function (student, attendence) {
                let missedDays = 0;
                html += `<tr class="student"><td class="name-col">${student}</td>`
                for (let i = 0; i < days; i++) {
                    if (attendence[i]) {

                        html += `<td class="attend-col"><input data-student ="${student}" checked type="checkbox"></td>`;
                    } else {
                        missedDays++;
                        html += `<td class="attend-col"><input data-student ="${student}" type="checkbox"></td>`;
                    }
                }
                html += `<td class="missed-col" id=>${missedDays}</td></tr>`;
            });
            html += `</tbody>`;
            $("#tbl").append(html);
            /*################# */
            view.countMissing();
        },
        countMissing: function () {
            $('input').change(function (e) {
                let studentRow = $(this).parent().parent()[0];
                let studentName = $(this).parent().parent().children('.name-col')[0].textContent;
                console.log(studentName);
                let value = [];
                dayChecks = $(studentRow).children('.attend-col').children('input');
                dayChecks.each(function () {
                    value.push(this.checked);
                });
                octapus.setAttendence(value, studentName);
                $("#tbl").html("");
                view.init();
            });
        }
    };

    octapus.init();
    octapus.getDays();
});