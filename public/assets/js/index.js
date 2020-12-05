$(".modalClose").each(btn => $(this).click(() => { $("#filter").val(""); }));

let employees;
let results;
$.getJSON("public/assets/employees.json", json => {
    employees = json.results;

    let reducer = (acc, current) => {
        return acc + `<option>${current}</option>`;
    };

    let states = new Set();
    let depts = new Set();
    let jobs = new Set();
    employees.map(employee => states.add(employee.location.state));
    employees.map(employee => depts.add(employee.department));
    employees.map(employee => jobs.add(employee.job_title));
    
    // Passing in the reducer function
    $("#stateFilter").html([...states].sort().reduce(reducer,"<option>None</option>"));
    $("#deptFilter").html([...depts].sort().reduce(reducer,"<option>None</option>"));
    $("#jobFilter").html([...jobs].sort().reduce(reducer,"<option>None</option>"));
});

let displayTable = () => {
    let term = $("#searchBox").val();
    results = employees.filter(employee => `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`.includes(term.toLowerCase()));

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
        table = table + `<tr>
                            <td><img src="${employee.headshot.medium}" /> ${employee.name.title} ${employee.name.first} ${employee.name.last}</td>
                            <td>${employee.job_title}</td>
                            <td>${employee.department}</td>
                        </tr>`;
    });

    table = table + "</tbody></table>";
    $("#results").html(table);
};