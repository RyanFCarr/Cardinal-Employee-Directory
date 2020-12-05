$("#filterReset").click(() => { 
    $(".filterDropdown.selectpicker").each(function() {
        $(this).val("none").change();
    });
});

let employees;
let results;
$.getJSON("public/assets/employees.json", json => {
    employees = json.results;

    let reducer = (acc, current) => {
        return acc + `<option value='${current}'>${current}</option>`;
    };

    let states = new Set();
    let depts = new Set();
    let jobs = new Set();
    employees.map(employee => states.add(employee.location.state));
    employees.map(employee => depts.add(employee.department));
    employees.map(employee => jobs.add(employee.job_title));
    
    // Passing in the reducer function
    $("#stateFilter").html([...states].sort().reduce(reducer,"<option value='none'>None</option>"));
    $("#deptFilter").html([...depts].sort().reduce(reducer,"<option value='none'>None</option>"));
    $("#jobFilter").html([...jobs].sort().reduce(reducer,"<option value='none'>None</option>"));
});

let displayTable = () => {
    let term = $("#searchBox").val();
    let jobFilter = $('#jobFilter').val()
    let stateFilter = $('#stateFilter').val()
    let deptFilter = $('#deptFilter').val()
    results = employees.filter(employee =>
        `${employee.name.first} ${employee.name.last}`.toLowerCase().includes(term.toLowerCase()) // Search name
        && (jobFilter === "none" || jobFilter === employee.job_title)
        && (stateFilter === "none" || stateFilter === employee.location.state)
        && (deptFilter === "none"  || deptFilter === employee.department)
        );

    let table = `
        <table id="searchResults" class="table table-striped">
            <thead>
                <th>Name</th>
                <th>Job Title</th>
                <th>Department</th>
            </thead>
            <tbody>
    `;

    results.forEach(employee => {
        table = table + `<tr data-toggle="modal" data-target="#detailModal" onclick="displayDetail(event)" data-employeeid=${employee.id}>
                            <td><img src="${employee.headshot.medium}" /> ${employee.name.title} ${employee.name.first} ${employee.name.last}</td>
                            <td>${employee.job_title}</td>
                            <td>${employee.department}</td>
                        </tr>`;
    });

    table = table + "</tbody></table>";
    $("#results").html(table);
};

let displayDetail = (event) => {
    let employeeId = event.currentTarget.getAttribute("data-employeeid");
    let employee = results.filter(e => e.id == employeeId)[0];
    $("#headshot").attr("src", employee.headshot.large);
    $("#employeeName").text(`${employee.name.title} ${employee.name.first} ${employee.name.last}`);
    $("#employeeDept").text(employee.department);
    $("#employeeTitle").text(employee.job_title);
};
