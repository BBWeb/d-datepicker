moment = require "moment/min/moment-with-langs.min"
ViewHelpers = require("./viewHelpers").ViewHelpers
Builders = require "./builders"

module.exports = class Datepicker extends ViewHelpers
  view: __dirname + "/../views"
  name: 'd-datepicker'


  init: (model) ->
    @lang = model.get("lang") || "en"
    @builders = new Builders(@lang, moment)
    currentDate = model.get("active") || moment()
    granularity = @getAttribute 'granularity'

    if granularity is 'month' then return @gotoYearView currentDate
    @gotoMonthView currentDate
  
  create: (model, dom) ->
    global.moment = moment
    dom.on "click", (e) =>
      model.set "show", true if @parent.contains(e.target)
    dom.on "mousedown", (e) =>
      model.set "show", false unless @parent.contains(e.target)

  gotoMonthView: (date) ->
    granularity = @getAttribute 'granularity'
    return @select {fullDate: date} if granularity is 'month'
    @setCurrentDate date
    @monthView date
  
  monthView: (date) ->
    return unless date
    date = moment(date)
    weeks = @builders.buildMonthView(date)
    @model.set "weeks", weeks
    @model.set "view", "month"
  
  gotoYearView: (date) ->
    date = moment(date, "YYYY-MM-DD")
    @setCurrentDate date, "YYYY-MM-DD"
    @yearView date
  
  yearView: (date) ->
    months = @builders.buildYearView(date)
    @model.set "months", months
    @model.set "view", "year"
  
  nextYear: ->
    # get current month
    currentDate = moment(@getCurrentDate())
  
    # calculate previous year from date
    nextYearDate = currentDate.add("years", 1)
    @gotoYearView nextYearDate
  
  prevYear: ->
    # get current month
    currentDate = moment(@getCurrentDate())
  
    # calculate previous year from date
    prevYearDate = currentDate.subtract("years", 1)
    @gotoYearView prevYearDate
  
  gotoDecadeView: (date) ->
    date = moment(date)
    @setCurrentDate date
    @decadeView date
  
  decadeView: (date) ->
    years = @builders.buildDecadeView(date)
    @model.set "years", years
    @model.set "view", "decade"
  
  prevDecade: ->
    currentDate = moment(@getCurrentDate())
    prevDecadeDate = currentDate.subtract("years", 10)
    @gotoDecadeView prevDecadeDate
  
  nextDecade: ->
    currentDate = moment(@getCurrentDate())
    nextDecadeDate = currentDate.add("years", 10)
    @gotoDecadeView nextDecadeDate
  
  select: (selectedDate) ->
    date = moment(selectedDate.fullDate)
    selectedMonth = date.month()
    currentDate = moment(@getCurrentDate())
    currentMonth = currentDate.month()
    granularity = @getAttribute 'granularity'
    @gotoMonthView date  if selectedMonth isnt currentMonth and granularity isnt 'month'
    @model.set "active", selectedDate.fullDate
    @model.set "show", false

  prevMonth: ->
    # get current month
    currentDate = moment(@getCurrentDate())
  
    # calculate previous month from date
    prevMonthDate = currentDate.subtract("months", 1)
    @gotoMonthView prevMonthDate
  
  nextMonth: ->
    # get current month
    currentDate = moment(@getCurrentDate())
  
    # calculate previous month from date
    nextMonthDate = currentDate.add("months", 1)
    @gotoMonthView nextMonthDate
  
  setCurrentDate: (currentDate) ->
    @model.set "currentDate", currentDate
  
  getCurrentDate: ->
    @model.get "currentDate"