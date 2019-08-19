'use strict'

module.exports = function({shifts, employees}) {
    // Format the shift data
    shifts = formatShifts(shifts)
    // Format the employee data
    employees = formatEmployees(employees)
    // Validate it is possible to give all employees minimum hours given total hours
    if(shifts.hours < employees.totalMinHours)
        return { error: 'It is not possible to give everyone enough hours due to not enough weekly hours.' }
    // Validate it is possible to fill all shifts given total hours
    if(shifts.hours[0] < shifts.totalShiftHours[0] || (shifts.hours[0] === shifts.totalShiftHours[0] && shifts.hours[1] < shifts.totalShiftHours[1]))
        return { error: 'It is not possible to fill all shifts due to not enough weekly hours.' }
}
// Function for formatting shifts
function formatShifts(shifts) {
    const totalShiftHours = [0, 0]
    // Handle Sunday-Monday
    Object.keys(shifts).forEach(key => {
        // Exit if the key is not a day of the week
        if(key.indexOf('day') === -1)
            return
        // Loop through each shift and format it
        shifts[key].forEach((shift, i) => {
            let start, end
            // If the shift is passed in as a string
            if(typeof shift === 'string') {
                // Format the string
                shift = shift.trim().split('-').map(str => str.trim().replace(':', ''))
                // Convert the hour strings into arrays
                start = hourStrToNum(shift[0])
                end = hourStrToNum(shift[1])
            // If the shift is passed in as an object
            } else if (shift.start && shift.end) {
                start = hourStrToNum('' + shift.start)
                end = hourStrToNum('' + shift.end)
            }
            // Calculate total hours
            let hours = end[0] - start[0]
            let mins
            if(end[1] < start[1]) {
                hours--
                mins = start[1] - end[1]
            } else
                mins = end[1] - start[1]

            const people = shift.people || 1
            // Add the calculated hours to the total
            totalShiftHours[0] += hours * people
            totalShiftHours[1] += mins * people
            // Return the shift properly formatted [hour, minute]
            return shifts[key][i] = {
                start,
                end,
                hours: [hours, mins],
                people
            }
        })
    })
    // Format input hours for shifts
    if(shifts.hours)
        shifts.hours = hourStrToNum('' + shifts.hours)
    // Save the total hours to the formatted shift array
    shifts.totalShiftHours = totalShiftHours
    // Return the full formatted array
    return shifts
}
// Function for formatting employees
function formatEmployees(employees) {
    const totalMinHours = [0, 0]
    // Handle Each Employee
    employees.forEach(({availability, hours}, i) => {
        totalMinHours[0] += hours
        // Loop through each shift and format it
        Object.keys(availability).forEach((key) => {
            // Exit if the key is not a day of the week
            if(key.indexOf('day') === -1)
                return
            availability[key].forEach((shift, j) => {
                let start, end
                // If the shift is passed in as a string
                if(typeof shift === 'string') {
                    // Format the string
                    shift = shift.trim().split('-').map(str => str.trim().replace(':', ''))
                    // Convert the hour strings into arrays
                    start = hourStrToNum(shift[0])
                    end = hourStrToNum(shift[1])
                // If the shift is passed in as an object
                } else if (shift.start && shift.end) {
                    start = hourStrToNum('' + shift.start)
                    end = hourStrToNum('' + shift.end)
                } else
                    throw new Error('Invalid shift format')
                // Return the shift properly formatted [hour, minute]
                return employees[i].availability[key][j] = {
                    start,
                    end
                }
            })
        })

        // Save the total hours to the formatted shift array
        employees[i].totalMinHours = totalMinHours
    })
    // Return the full formatted array
    return {
        totalMinHours, 
        employees
    }
}

function hourStrToNum(str) {
    // Find the set of numbers in the string
    const nums = str.search(/[A-Za-z]/g) === -1 ? str : str.slice(0, str.search(/[A-Za-z]/g)).trim()
    // Find the hour value
    let hour = nums.length % 2 == 0 ? nums[0] + nums[1] : nums[0]
    // Find the minute value
    let min = nums.length < 3 ? '00' : nums[nums.length - 1] + nums[nums.length - 2]
    // Convert hour/minute
    hour = Number.parseInt(hour)
    min = Number.parseInt(min)
    // Add am/pm
    if(str[str.length - 2] + str[str.length - 1] === 'pm')
        hour += 12
    // Return hour and minute properly formatted
    return [hour, min]
}