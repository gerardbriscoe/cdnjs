/**
 * @package		PickMeUp - jQuery datepicker plugin
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @author		Stefan Petre <www.eyecon.ro>
 * @copyright	Copyright (c) 2013-2014, Nazar Mokrynskyi
 * @copyright	Copyright (c) 2008-2009, Stefan Petre
 * @license		MIT License, see license.txt
 */
(function (d) {
	function getMaxDays () {
		var tmpDate	= new Date(this.toString()),
			d		= 28,
			m		= tmpDate.getMonth();
		while (tmpDate.getMonth() == m) {
			++d;
			tmpDate.setDate(d);
		}
		return d - 1;
	}
	d.addDays		= function (n) {
		this.setDate(this.getDate() + n);
	};
	d.addMonths	= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setMonth(this.getMonth() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.addYears		= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setFullYear(this.getFullYear() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.getDayOfYear	= function() {
		var now		= new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
		var then	= new Date(this.getFullYear(), 0, 0, 0, 0, 0);
		var time	= now - then;
		return Math.floor(time / 24*60*60*1000);
	};
})(Date.prototype);
(function ($) {
	$.pickmeup = $.extend($.pickmeup || {}, {
		date			: new Date,
		flat			: false,
		first_day		: 1,
		prev			: '&#9664;',
		next			: '&#9654;',
		mode			: 'single',
		view			: 'days',
		calendars		: 1,
		format			: 'd-m-Y',
		position		: 'bottom',
		trigger_event	: 'click',
		class_name		: '',
		separator		: ' - ',
		hide_on_select	: false,
		min				: null,
		max				: null,
		render			: function () {},
		change			: function () {return true;},
		before_show		: function () {return true;},
		show			: function () {return true;},
		hide			: function () {return true;},
		locale			: {
			days		: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			daysShort	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			daysMin		: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			months		: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthsShort	: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		}
	});
	var	views	= {
			years	: 'pmu-view-years',
			months	: 'pmu-view-months',
			days	: 'pmu-view-days'
		},
		tpl		= {
			wrapper	: '<div class="pickmeup" />',
			head	: function (d) {
				var result	= '';
				for (var i = 0; i < 7; ++i) {
					result	+= '<div>' + d.day[i] + '</div>'
				}
				return '<div class="pmu-instance">' +
					'<nav>' +
						'<div class="pmu-prev pmu-button">' + d.prev + '</div>' +
						'<div class="pmu-month pmu-button" />' +
						'<div class="pmu-next pmu-button">' + d.next + '</div>' +
					'</nav>' +
					'<nav class="pmu-day-of-week">' + result + '</nav>' +
				'</div>';
			},
			days	: function (days) {
				var result	= '';
				for (var i = 0; i < 42; ++i) {
					result	+= '<div class="' + days[i].class_name + ' pmu-button">' + days[i].text + '</div>'
				}
				return '<div class="pmu-days">' + result + '</div>';
			},
			months	: function (d) {
				var result	= '';
				for (var i = 0; i < 12; ++i) {
					result	+= '<div class="pmu-button">' + d.data[i] + '</div>'
				}
				return '<div class="' + d.class_name + '">' + result + '</div>';
			}
		};
	function fill () {
		var options		= $(this).data('pickmeup-options'),
			pickmeup	= this.pickmeup,
			current_cal	= Math.floor(options.calendars / 2),
			date,
			data,
			header,
			year,
			day,
			month,
			count		= 0,
			days,
			html,
			instance,
			today		= (new Date).setHours(0,0,0,0).valueOf();
		/**
		 * Remove old content except header navigation
		 */
		pickmeup.find('.pmu-instance > :not(nav)').remove();
		/**
		 * If several calendars should be shown
		 */
		for (var i = 0; i < options.calendars; i++) {
			date		= new Date(options.current);
			instance	= pickmeup.find('.pmu-instance').eq(i);
			if (pickmeup.hasClass('pmu-view-years')) {
				date.addYears((i - current_cal) * 12);
				header = (date.getFullYear() - 6) + ' - ' + (date.getFullYear()+5);
			} else if (pickmeup.hasClass('pmu-view-months')) {
				date.addYears(i - current_cal);
				header = date.getFullYear();
			} else if (pickmeup.hasClass('pmu-view-days')) {
				date.addMonths(i - current_cal);
				header = formatDate(date, 'B, Y', options.locale);
			}
			instance
				.find('.pmu-month')
				.text(header);
			year		= date.getFullYear() - 6;
			data		= {
				data		: [],
				class_name	: 'pmu-years'
			};
			for (var j = 0; j < 12; j++) {
				data.data.push(year + j);
			}
			html		= tpl.months(data);
			date.setDate(1);
			data		= [];
			month		= date.getMonth();
			day			= (date.getDay() - options.first_day) % 7;
			date.addDays(-(day + (day < 0 ? 7 : 0)));
			count		= 0;
			while (count < 42) {
				day	= {
					text		: date.getDate(),
					class_name	: []
				};
				if (month != date.getMonth()) {
					day.class_name.push('pmu-not-in-month');
				}
				if (date.getDay() == 0) {
					day.class_name.push('pmu-sunday');
				} else if (date.getDay() == 6) {
					day.class_name.push('pmu-saturday');
				}
				var from_user	= options.render(date) || {},
					val			= date.valueOf(),
					disabled	= (options.min && options.min > date) || (options.max && options.max < date);
				if (
					!disabled &&
					(
						from_user.selected ||
						options.date == val ||
						$.inArray(val, options.date) > -1 ||
						(
							options.mode == 'range' && val >= options.date[0] && val <= options.date[1]
						)
					)
				) {
					day.class_name.push('pmu-selected');
				}
				if (val == today) {
					day.class_name.push('pmu-today');
				}
				if (from_user.disabled || disabled) {
					day.class_name.push('pmu-disabled');
				}
				if (from_user.class_name) {
					day.class_name.push(from_user.class_name);
				}
				day.class_name = day.class_name.join(' ');
				data.push(day);
				date.addDays(1);
				count++;
			}
			html	= tpl.days(data) + html;
			data	= {
				data		: options.locale.monthsShort,
				class_name	: 'pmu-months'
			};
			html	= tpl.months(data) + html;
			instance.append(html);
		}
	}
	function parseDate (date, format, separator) {
		if (date.constructor == Date) {
			return date;
		}
		var splitted_date	= date.split(separator);
		if (splitted_date.length > 1) {
			splitted_date.forEach(function (element, index, array) {
				array[index]	= parseDate(element, format, separator);
			});
			return splitted_date;
		}
		var parts	= date.split(/\W+/),
			against	= format.split(/\W+/),
			d,
			m,
			y,
			h,
			min,
			now = new Date();
		for (var i = 0; i < parts.length; i++) {
			switch (against[i]) {
				case 'd':
				case 'e':
					d = parseInt(parts[i],10);
				break;
				case 'm':
					m = parseInt(parts[i], 10)-1;
				break;
				case 'Y':
				case 'y':
					y = parseInt(parts[i], 10);
					y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
				break;
				case 'H':
				case 'I':
				case 'k':
				case 'l':
					h = parseInt(parts[i], 10);
				break;
				case 'P':
				case 'p':
					if (/pm/i.test(parts[i]) && h < 12) {
						h += 12;
					} else if (/am/i.test(parts[i]) && h >= 12) {
						h -= 12;
					}
				break;
				case 'M':
					min = parseInt(parts[i], 10);
				break;
			}
		}
		return new Date(
			y === undefined ? now.getFullYear() : y,
			m === undefined ? now.getMonth() : m,
			d === undefined ? now.getDate() : d,
			h === undefined ? now.getHours() : h,
			min === undefined ? now.getMinutes() : min,
			0
		);
	}
	function formatDate (date, format, locale) {
		var m = date.getMonth();
		var d = date.getDate();
		var y = date.getFullYear();
		var w = date.getDay();
		var s = {};
		var hr = date.getHours();
		var pm = (hr >= 12);
		var ir = (pm) ? (hr - 12) : hr;
		var dy = date.getDayOfYear();
		if (ir == 0) {
			ir = 12;
		}
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var parts = format.split(''), part;
		for (var i = 0; i < parts.length; i++) {
			part = parts[i];
			switch (part) {
				case 'a':
					part = locale.daysShort[w];
				break;
				case 'A':
					part = locale.days[w];
				break;
				case 'b':
					part = locale.monthsShort[m];
				break;
				case 'B':
					part = locale.months[m];
				break;
				case 'C':
					part = 1 + Math.floor(y / 100);
				break;
				case 'd':
					part = (d < 10) ? ("0" + d) : d;
				break;
				case 'e':
					part = d;
				break;
				case 'H':
					part = (hr < 10) ? ("0" + hr) : hr;
				break;
				case 'I':
					part = (ir < 10) ? ("0" + ir) : ir;
				break;
				case 'j':
					part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
				break;
				case 'k':
					part = hr;
				break;
				case 'l':
					part = ir;
				break;
				case 'm':
					part = (m < 9) ? ("0" + (1+m)) : (1+m);
				break;
				case 'M':
					part = (min < 10) ? ("0" + min) : min;
				break;
				case 'p':
				case 'P':
					part = pm ? "PM" : "AM";
				break;
				case 's':
					part = Math.floor(date.getTime() / 1000);
				break;
				case 'S':
					part = (sec < 10) ? ("0" + sec) : sec;
				break;
				case 'u':
					part = w + 1;
				break;
				case 'w':
					part = w;
				break;
				case 'y':
					part = ('' + y).substr(2, 2);
				break;
				case 'Y':
					part = y;
				break;
			}
			parts[i] = part;
		}
		return parts.join('');
	}
	function click (e) {
		var el	= $(e.target);
		if (el.hasClass('pmu-button')) {
			if (el.hasClass('pmu-disabled')) {
				return false;
			}
			var	$this			= $(this),
				options			= $this.data('pickmeup-options'),
				instance		= el.parents('.pmu-instance').eq(0),
				root			= instance.parent(),
				instance_index	= $('.pmu-instance', root).index(instance),
				current_date	= new Date(options.current),
				val;
			if (el.parent().is('nav')) {
				if (el.hasClass('pmu-month')) {
					current_date.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (root.hasClass('pmu-view-years')) {
						root.removeClass('pmu-view-years').addClass('pmu-view-days');
						el.text(formatDate(current_date, 'B, Y', options.locale));
					} else if (root.hasClass('pmu-view-months')) {
						root.removeClass('pmu-view-months').addClass('pmu-view-years');
						el.text((current_date.getFullYear() - 6) + ' - ' + (current_date.getFullYear()+5));
					} else if (root.hasClass('pmu-view-days')) {
						root.removeClass('pmu-view-days').addClass('pmu-view-months');
						el.text(current_date.getFullYear());
					}
				} else {
					var prev	= el.hasClass('pmu-prev');
					if (root.hasClass('pmu-view-years')) {
						options.current.addYears(prev ? -12 : 12);
					} else if (root.hasClass('pmu-view-months')) {
						options.current.addYears(prev ? -1 : 1);
					} else if (root.hasClass('pmu-view-days')) {
						options.current.addMonths(prev ? -1 : 1);
					}
				}
			} else if (!el.hasClass('pmu-disabled')) {
				if (root.hasClass('pmu-view-years')) {
					options.current.setFullYear(parseInt(el.text(), 10));
					root.removeClass('pmu-view-years').addClass('pmu-view-months');
				} else if (root.hasClass('pmu-view-months')) {
					options.current.setMonth(instance.find('.pmu-months .pmu-button').index(el));
					options.current.setFullYear(parseInt(instance.find('.pmu-month').text(), 10));
					options.current.addMonths(Math.floor(options.calendars / 2) - instance_index);
					root.removeClass('pmu-view-months').addClass('pmu-view-days');
				} else {
					val	= parseInt(el.text(), 10);
					current_date.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (el.hasClass('pmu-not-in-month')) {
						current_date.addMonths(val > 15 ? -1 : 1);
					}
					current_date.setDate(val);
					switch (options.mode) {
						case 'multiple':
							val = (current_date.setHours(0,0,0,0)).valueOf();
							if ($.inArray(val, options.date) > -1) {
								$.each(options.date, function (nr, dat){
									if (dat == val) {
										options.date.splice(nr,1);
										return false;
									}
									return true;
								});
							} else {
								options.date.push(val);
							}
							break;
						case 'range':
							if (!options.lastSel) {
								options.date[0]	= (current_date.setHours(0,0,0,0)).valueOf();
							}
							val				= (current_date.setHours(23,59,59,0)).valueOf();
							if (val < options.date[0]) {
								options.date[1]	= options.date[0] + 86399000;
								options.date[0]	= val - 86399000;
							} else {
								options.date[1]	= val;
							}
							options.lastSel	= !options.lastSel;
							break;
						default:
							options.date	= current_date.valueOf();
							break;
					}
					(function (prepared_date) {
						if ($this.is('input')) {
							$this.val(options.mode == 'single' ? prepared_date[0] : prepared_date[0].join(options.separator));
						}
						options.change.apply(this, prepared_date);
					})(prepareDate(options));
					if (
						options.hide_on_select &&
						(
							options.mode != 'range' ||
							!options.lastSel
						)
					) {
						options.binded.hide();
						return false;
					}
				}
			}
			options.binded.fill();
		}
		return false;
	}
	function prepareDate (options) {
		var result;
		if (options.mode == 'single') {
			result = new Date(options.date);
			return [formatDate(result, options.format, options.locale), result];
		} else {
			result = [[],[]];
			$.each(options.date, function(nr, val){
				var date = new Date(val);
				result[0].push(formatDate(date, options.format, options.locale));
				result[1].push(date);
			});
			return result;
		}
	}
	function show (force) {
		var pickmeup	= this.pickmeup;
		if (force || !pickmeup.is(':visible')) {
			var $this		= $(this),
				options		= $this.data('pickmeup-options'),
				pos			= $this.offset(),
				viewport	= {
					l : document.documentElement.scrollLeft,
					t : document.documentElement.scrollTop,
					w : document.documentElement.clientWidth,
					h : document.documentElement.clientHeight
				},
				top			= pos.top,
				left		= pos.left;
			options.binded.fill();
			if ($this.is('input')) {
				$this.pickmeup('set_date', parseDate($this.val(), options.format, options.separator));
			}
			options.before_show();
			switch (options.position){
				case 'top':
					top -= pickmeup.outerHeight();
					break;
				case 'left':
					left -= pickmeup.outerWidth();
					break;
				case 'right':
					left += this.offsetWidth;
					break;
				case 'bottom':
					top += this.offsetHeight;
					break;
			}
			if (top + pickmeup.offsetHeight > viewport.t + viewport.h) {
				top = pos.top  - pickmeup.offsetHeight;
			}
			if (top < viewport.t) {
				top = pos.top + this.offsetHeight + pickmeup.offsetHeight;
			}
			if (left + pickmeup.offsetWidth > viewport.l + viewport.w) {
				left = pos.left - pickmeup.offsetWidth;
			}
			if (left < viewport.l) {
				left = pos.left + this.offsetWidth
			}
			if (options.show() == false) {
				return;
			}
			pickmeup.css({
				display	: 'inline-block',
				top		: top + 'px',
				left	: left + 'px'
			});
			$(document)
				.on(
					'mousedown',
					options.binded.hide
				)
				.on(
					'resize',
					[
						true
					],
					options.binded.forced_show
				);
		}
	}
	function forced_show () {
		show.call(this, true);
	}
	function hide (e) {
		if (
			!e ||
			!e.target ||														//Called directly
			(
				e.target != this &&												//Clicked not on element itself
				!(this.pickmeup.get(0).compareDocumentPosition(e.target) & 16)	//And not o its children
			)
		) {
			var pickmeup	= this.pickmeup,
				options		= $(this).data('pickmeup-options');
			if (options.hide() != false) {
				pickmeup.hide();
				$(document)
					.off('mousedown', options.binded.hide)
					.off('resize', options.binded.forced_show);
				options.date[1]	= options.date[0];
				options.lastSel	= false;
			}
		}
	}
	function update () {
		var	options	= $(this).data('pickmeup-options');
		$(document)
			.off('mousedown', options.binded.hide)
			.off('resize', options.binded.forced_show);
		options.binded.forced_show();
	}
	function clear () {
		var options = $(this).data('pickmeup-options');
		if (options.mode != 'single') {
			options.date = [];
			options.binded.fill();
		}
	}
	function get_date (formatted) {
		return prepareDate($(this).data('pickmeup-options'))[formatted ? 0 : 1];
	}
	function set_date (date) {
		var options = $(this).data('pickmeup-options');
		options.date = date;
		if (typeof options.date === 'string') {
			options.date = parseDate(options.date, options.format, options.separator).setHours(0,0,0,0);
		} else if (options.date.constructor == Date) {
			options.date.setHours(0,0,0,0);
		}
		if (!options.date) {
			options.date = new Date;
			options.date.setHours(0,0,0,0);
		}
		if (options.mode != 'single') {
			if (options.date.constructor != Array) {
				options.date = [options.date.valueOf()];
				if (options.mode == 'range') {
					options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
				}
			} else {
				for (var i = 0; i < options.date.length; i++) {
					options.date[i] = (parseDate(options.date[i], options.format, options.separator).setHours(0,0,0,0)).valueOf();
				}
				if (options.mode == 'range') {
					options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
				}
			}
		} else {
			options.date = options.date.valueOf();
		}
		options.current = new Date (options.mode != 'single' ? options.date[0] : options.date);
		options.binded.fill();
	}
	$.fn.pickmeup	= function (initial_options) {
		if (typeof initial_options === 'string') {
			var data,
				parameters	= Array.prototype.slice.call(arguments, 1);
			switch (initial_options) {
				case 'hide':
				case 'show':
				case 'clear':
				case 'update':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options]();
						}
					});
				break;
				case 'get_date':
					data	= this.data('pickmeup-options');
					if (data) {
						return data.binded.get_date(parameters[0]);
					} else {
						return null;
					}
				break;
				case 'set_date':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options].apply(this, parameters);
						}
					});
			}
			return this;
		}
		return this.each(function () {
			var	$this			= $(this);
			if ($this.data('pickmeup-options')) {
				return;
			}
			var i,
				option,
				options	= $.extend({}, $.pickmeup, initial_options || {});
			for (i in options) {
				option	= $this.data('pmu-' + i);
				if (typeof option !== 'undefined') {
					options[i]	= option;
				}
			}
			options.calendars	= Math.max(1, parseInt(options.calendars, 10) || 1);
			options.mode		= /single|multiple|range/.test(options.mode) ? options.mode : 'single';
			if (typeof options.min === 'string') {
				options.min = parseDate(options.min, options.format, options.separator).setHours(0,0,0,0);
			} else if (options.min && options.min.constructor == Date) {
				options.min.setHours(0,0,0,0);
			}
			if (typeof options.max === 'string') {
				options.max = parseDate(options.max, options.format, options.separator).setHours(23,59,59,0);
			} else if (options.max && options.max.constructor == Date) {
				options.max.setHours(23,59,59,0);
			}
			if (typeof options.date === 'string') {
				options.date = parseDate(options.date, options.format, options.separator).setHours(0,0,0,0);
			} else if (options.date.constructor == Date) {
				options.date.setHours(0,0,0,0);
			}
			if (!options.date) {
				options.date = new Date;
				options.date.setHours(0,0,0,0);
			}
			if (options.mode != 'single') {
				if (options.date.constructor != Array) {
					options.date = [options.date.valueOf()];
					if (options.mode == 'range') {
						options.date.push(((new Date(options.date[0])).setHours(23,59,59,0)).valueOf());
					}
				} else {
					for (i = 0; i < options.date.length; i++) {
						options.date[i] = (parseDate(options.date[i], options.format, options.separator).setHours(0,0,0,0)).valueOf();
					}
					if (options.mode == 'range') {
						options.date[1] = ((new Date(options.date[1])).setHours(23,59,59,0)).valueOf();
					}
				}
				options.current	= new Date(options.date[0]);
			} else {
				options.date	= options.date.valueOf();
				options.current	= new Date(options.date);
			}
			options.current.setDate(1);
			options.current.setHours(0,0,0,0);
			var cnt,
				pickmeup = $(tpl.wrapper);
			this.pickmeup	= pickmeup;
			if (options.class_name) {
				pickmeup.addClass(options.class_name);
			}
			var html = '';
			for (i = 0; i < options.calendars; i++) {
				cnt		= options.first_day;
				html	+= tpl.head({
					prev	: options.prev,
					next	: options.next,
					day		: [
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7]
					]
				});
			}
			$this.data('pickmeup-options', options);
			for (i in options) {
				if ($.inArray(i, ['render', 'change', 'before_show', 'show', 'hide']) != -1) {
					options[i]	= options[i].bind(this);
				}
			}
			options.binded	= {
				fill		: fill.bind(this),
				click		: click.bind(this),
				show		: show.bind(this),
				forced_show	: forced_show.bind(this),
				hide		: hide.bind(this),
				update		: update.bind(this),
				clear		: clear.bind(this),
				get_date	: get_date.bind(this),
				set_date	: set_date.bind(this)
			};
			pickmeup
				.on('click', options.binded.click)
				.addClass(views[options.view])
				.append(html)
				.on(
					$.support.selectstart ? 'selectstart' : 'mousedown',
					function(e){
						e.preventDefault();
					}
				);
			options.binded.fill();
			if (options.flat) {
				pickmeup.appendTo(this).css({
					position	: 'relative',
					display		: 'inline-block'
				});
			} else {
				pickmeup.appendTo(document.body);
				$this.on(options.trigger_event, options.binded.show);
			}
		});
	};
})(jQuery);
