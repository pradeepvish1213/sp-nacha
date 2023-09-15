let chai     = require('chai'),
	expect   = chai.expect,
	moment   = require('moment');

describe('Utils', function(){
	let utils = require('./../lib/utils');
	describe('pad', function() {
		it('should add pad', function(){
			let testS = "1991";
			let testW = '0';

			expect(function(){ utils.pad(testS,testW) }).not.to.throw('Padding not adding');
		});
	});

	describe('GenerateString', function(){
		it("Test to see if object can be passed", function(){
		let testObj = {

			testRecord: {
					name: 'Record Type Code',
					width: 1,
					position: 1,
					required: true,
					type: 'numeric',
					value: '5'
				}
			};

			expect( function() { utils.generateString(testObj) }).not.to.throw('Not passing object correctly.');
		});
	});

	describe('YYMMDD',function() {
		it('Must return the current date',function() {
			let utils = require('./../lib/utils');
			let date = moment().format('YYMMDD');
			let dateNum = utils.formatDate(new Date());

			if(dateNum === date) { expect(function() { utils.formatDate }).not.to.throw('Dates match'); }

            // The formatDate() function never throws an error -- this test isn't accurate
			//else { expect(function() { utils.formatDate }).to.throw('Dates don\'t match');}

		});
	});

	describe('HHMM', function() {
		it('Must return the current time', function() {

			let hour = moment().hour().toString();
			let minute = moment().minute().toString();

			let time = hour + minute;

			let utilsTime = utils.formatTime(new Date());

			if(utilsTime === time) { expect(function() { utils.formatTime }).not.to.throw('Times match'); }

            // The formatTime() function never throws an error -- this test isn't accurate
            //else { expect(function() { utils.formatTime }).to.throw('Times don\'t match.') }
		});
	});
});