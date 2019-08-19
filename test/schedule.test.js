'use strict'
/* globals before describe it */

const { expect } = require('chai')
const schedule = require('../app/schedule.js')
const data = require('./sample_data.json')

describe('Schedule creation algorithm', () => {

    before(() => {
        // This constructs different data sets by combining employee and shift data
        data.insufficientHours = {
            shifts: data.insufficientHoursShifts,
            employees: data.baseEmployees
        }
        data.insufficientEmployees = {
            shifts: data.baseShifts,
            employees: data.insufficientEmployeeHours
        }
        data.simple = {
            shifts: data.baseShifts,
            employees: data.baseEmployees
        }
        data.fullTime = {
            shifts: data.baseShifts,
            employees: data.baseEmployees
        }
        data.partTime = {
            shifts: data.baseShifts,
            employees: data.baseEmployees
        }
        data.oneRole = {}
        data.manyRoles = {}
    })

    it('throws an error if it is not possible to fill all shifts based on hours', () => {
        const generatedSchedule = schedule(data.insufficientHours)

        expect(generatedSchedule.error).to.equal('It is not possible to fill all shifts due to not enough weekly hours.')
    })

    it('throws an error if it is not possible for all employees to get enough hours', () => {
        const generatedSchedule = schedule(data.insufficientEmployees)

        expect(generatedSchedule.error).to.equal('It is not possible to give everyone enough hours due to not enough weekly hours.')
    })

    xit('generates a schedule from data with only one possible output', () => {
        const generatedSchedule = schedule(data.simple)
    })

    xit('generates a schedule with only full time employees', () => {
        const generatedSchedule = schedule(data.fullTime)
    })

    xit('generates a schedule with only part time employees', () => {
        const generatedSchedule = schedule(data.partTime)
    })

    xit('generates a schedule divided by roles', () => {
        const generatedSchedule = schedule(data.oneRole)
    })

    xit('generates a schedule with employees potentially filling multiple roles', () => {
        const generatedSchedule = schedule(data.manyRoles)
    })

})

