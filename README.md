# scheduling
A website for making quick and easy schedules for employees.

Algorithm design:

Purpose: To generate a schedule for an employer given employee and store needs.

Inputs: Employee availability, Employee roles, Employee min/max hours, Shifts possible in a given week, What roles can work what shifts and total hours available in a week.

Outputs: A schedule listing employee schedules for a given week.

Steps:
- Take in input
- Validate
    - All employees can get at least minimum hours.
    - All shifts can be filled.
- Format shifts into a schedule of the week.
- Starting with Sunday, assign all possible employees to all possible shifts of the week.
- Find employees who's available hours equal min hours and add them to the schedule.
- Fill all shifts with only one person available.
- Fill full time employees (max hours equal min hours)
- Randomly select employees for other shifts, starting with the shifts with fewest people who can work them