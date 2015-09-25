(function() {
  var Builders, addExtraDaysFromNextMonth, addExtraDaysFromPrevMonth, getDateObj, getDaysInCurrentMonth;

  module.exports = Builders = (function() {
    function Builders(lang, moment) {
      this.lang = lang;
      this.moment = moment;
    }

    Builders.prototype.buildYearView = function(date) {
      var i, month, months, _i;
      months = [];
      month = this.moment(date).lang(this.lang).month(0);
      for (i = _i = 1; _i <= 12; i = ++_i) {
        months.push({
          abbr: month.format("MMM"),
          date: month.format("YYYY-MM")
        });
        month.add("months", 1);
      }
      return months;
    };

    Builders.prototype.buildDecadeView = function(date) {
      var currentYear, i, year, yearInDecade, years, yearsIntoDecade, _i;
      years = [];
      date = this.moment(date);
      currentYear = date.year();
      yearsIntoDecade = currentYear % 10;
      year = date.subtract("years", yearsIntoDecade + 1);
      for (i = _i = 0; _i <= 11; i = ++_i) {
        yearInDecade = i > 0 && i < 11;
        years.push({
          year: year.year(),
          inDecade: yearInDecade
        });
        year.add("years", 1);
      }
      return years;
    };

    Builders.prototype.buildMonthView = function(date) {
      var allDates, datesFromNextMonth, datesFromPrevMonth, datesInCurrentMonth, weeks;
      date = this.moment(date);
      datesFromPrevMonth = addExtraDaysFromPrevMonth(date.clone());
      datesInCurrentMonth = getDaysInCurrentMonth(date.clone());
      datesFromNextMonth = addExtraDaysFromNextMonth(date.clone());
      allDates = datesFromPrevMonth.concat(datesInCurrentMonth, datesFromNextMonth);
      weeks = [];
      while (allDates.length > 0) {
        weeks.push(allDates.splice(0, 7));
      }
      return weeks;
    };

    return Builders;

  })();

  getDaysInCurrentMonth = function(currentDate) {
    var date, dates, i, nrDaysInMonth;
    dates = [];
    date = currentDate.date(1);
    nrDaysInMonth = currentDate.daysInMonth();
    i = 1;
    while (i <= nrDaysInMonth) {
      dates.push(getDateObj(date, true));
      date.add("days", 1);
      i++;
    }
    return dates;
  };

  addExtraDaysFromPrevMonth = function(currentDate) {
    var dates, firstDateOfMonth, firstDayOfMonth, i, prevDay;
    dates = [];
    firstDateOfMonth = currentDate.clone().date(1);
    firstDayOfMonth = firstDateOfMonth.day();
    i = 0;
    while (i < firstDayOfMonth) {
      prevDay = firstDateOfMonth.subtract("days", 1);
      dates.unshift(getDateObj(prevDay, false));
      i++;
    }
    return dates;
  };

  addExtraDaysFromNextMonth = function(currentDate) {
    var dates, daysInMonth, i, lastDastDayOfMonth, nextDay;
    dates = [];
    daysInMonth = currentDate.daysInMonth();
    lastDastDayOfMonth = currentDate.date(daysInMonth);
    i = lastDastDayOfMonth.day();
    while (i < 6) {
      nextDay = lastDastDayOfMonth.add("days", 1);
      dates.push(getDateObj(nextDay, false));
      i++;
    }
    return dates;
  };

  getDateObj = function(date, isCurrentMonth) {
    return {
      date: date.date(),
      fullDate: date.format("YYYY-MM-DD"),
      thisMonth: isCurrentMonth
    };
  };

}).call(this);