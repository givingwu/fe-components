import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'antd/lib/icon';
import './styles.scss';


export default class Calendar extends React.Component {
  static defaultProps = {
    minDate: '',
    maxDate: '',
    onItemClick: () => {},
  }

  static propTypes = {
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    onItemClick: PropTypes.func,
  }

  static WeekDays = ['日', '一', '二', '三', '四', '五', '六']

  static Head = CalendarHead
  static Body = CalendarBody

  state = {
    year: '',
    month: '',
    days: '', // all valid days in the given date range
    date: '',
  }

  componentWillMount() {
    let { minDate, maxDate } = this.props;

    this.setState({
      current: minDate
    });

    minDate = toValidDate(toValidDate(minDate).setHours(0, 0, 0, 0));
    maxDate = toValidDate(toValidDate(maxDate).setHours(23, 59, 59, 999));

    this.minDate = {
      year: minDate.getFullYear(),
      month: minDate.getMonth(),
      date: minDate.getDate(),
      valueOf() {
        return +minDate;
      }
    };

    this.maxDate = {
      year: maxDate.getFullYear(),
      month: maxDate.getMonth(),
      date: maxDate.getDate(),
      valueOf() {
        return +maxDate;
      }
    };

    this.geneValidDays();
  }

  preventCalendar = (ele) => {
    this.calender = ele;

    // 阻止页面滚动
    this.calender.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, false);
  }

  /**
   * generates days
   * @param {Boolean}  operate (true => 'plus') or (false => 'minus')
   */
  geneValidDays = (operate = undefined) => {
    let { year, month, date } = this.minDate;

    this.setState(prevState => {
      const { year: prevYear, month: prevMonth } = prevState;

      // handle the left or right toggle of the pannel
      if (`${operate}` && operate !== undefined) {
        year = prevYear !== undefined ? prevYear : year;
        month = prevMonth !== undefined ? prevMonth : month;

        if (operate) {
          if (month + 1 > 11) {
            year += 1;
            month = 0;
          } else {
            month += 1;
          }
        } else if (operate === false) {
          if (month - 1 < 0) {
            year -= 1;
            month = 11;
          } else {
            month -= 1;
          }
        }
      }

      // generates the all days of current month
      let days = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
        const dayVal = i + 1;
        const dateVal = new Date(year, month, dayVal);

        return {
          disabled: !validRange(+dateVal, [+this.minDate, +this.maxDate]),
          currentMonth: true,
          value: +dateVal,
          date: dateVal,
          valueOf() {
            return dayVal;
          },
          toString() {
            return date;
          }
        };
      });

      // all empty date cells at current month start pos
      const startDay = days[0].date.getDay();
      // all empty date cells at current month end pos
      const restDayLen = 42 - startDay - days.length;

      days = [
        ...Array(startDay).fill(null),
        ...days,
        ...Array(restDayLen < 7 ? restDayLen : restDayLen - 7).fill(null)
      ];

      return ({
        year,
        month,
        days,
        date,
      });
    });
  }

  handleItemClick = (t) => {
    const { onDateClick } = this.props;
    const { current } = this.state;

    if (t.disabled) return null;
    else if (current !== t.value) {
      this.setState({
        current: t.value
      }, () => {
        onDateClick && typeof onDateClick === 'function' && onDateClick(t.value);
      });
    }
  }

  render() {
    return (
      <div className="calendar">
        <Calendar.Head {...this.state} onArrowClick={this.geneValidDays} />
        <Calendar.Body {...this.state} onItemClick={this.handleItemClick} />
      </div>
    );
  }
}

/**
 * toValidDate
 * @param {*} param
 */
function toValidDate(param) {
  if (!param) throw new TypeError();

  if (!(param instanceof Date)) {
    param = new Date(param);
  }

  return param;
}

/**
 * validRange
 * @param {*} current
 * @param {*} range [start, end)
 */
const validRange = (
  current,
  range = [0, Infinity]
) => {
  range = range.map(t => +t);
  const min = Math.min(...range);
  const max = Math.max(...range);

  return (current >= min && current < max);
};


function CalendarHead({ year, month, onArrowClick }) {
  return (
    <div className="calendar-head">
      <div className="calendar-head__date">
        <Icon type="left" onClick={() => onArrowClick(false)} />
        <div className="calendar-head__date__time">
          {`${year}年${month + 1}月`}
        </div>
        <Icon type="right" onClick={() => onArrowClick(true)} />
      </div>

      <div className="calendar-head__week">
        {
          Calendar.WeekDays.map(t => (
            <div key={t} className="calendar-head__week__cell">{t}</div>
          ))
        }
      </div>
    </div>
  );
}


function CalendarBody({ current, days, onItemClick }) {
  return (
    <div className="calendar-body">
      {
        days.map((t, i) => {
          const classNames = ['calendar-body__cell__item'];

          if (t && typeof t === 'object') {
            (t.disabled) && classNames.push('disabled');

            (+current >= t.value && +current < t.date.setHours(23, 59, 59, 999)) && classNames.push('current');
          }

          return (
            <div key={t ? t.value : i} className="calendar-body__cell">
              <div className={classNames.join(' ')} onClick={() => onItemClick(t)}>
                {t && +t}
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
