
function MomentUtil (){

	var moment = require(AT.path + '../node_modules/moment');

	this.getNumOfWeek = function(dateStr){
		var date = moment(dateStr, "YYYY-MM-DD HH:mm:ss");

		var dOfweek = parseInt(date.format('d'));

		var startOfMonth = date.startOf("month");
		var wOfmonth = startOfMonth.format('d');

		var add_ = dOfweek-parseInt(wOfmonth);

		// console.log("add_:"+add_);

		// first of w
		var date1 = startOfMonth.add(add_,'days')
		// now
		var date2  = moment(dateStr, "YYYY-MM-DD HH:mm:ss");

		// console.log("date1:"+date1.month())
		// console.log("date2:"+date2.month())

		var offset = date2.diff(date1,"days") /7;
		return 1+offset + date1.month() -date2.month();

	}
}
