
define([
    "assert",
    "tape-compat",
    "javascript-natural-sort",
    "lodash/extend"
], function(assert, test, naturalSort, extend) {

	function wrapTest(origArray, sortArray, message) {
		assert.deepEqual(extend([], origArray).sort(naturalSort), sortArray, (message ? message + ' - ' : '') + JSON.stringify(origArray));
	}
		test('different values types', function () {
			wrapTest(
				['a',1],
				[1,'a'],
				'number always comes first');
			wrapTest(
				['1',1],
				['1',1],
				'number vs numeric string - should remain unchanged (error in chrome)');
			wrapTest(
				['02',3,2,'01'],
				['01','02',2,3],
				'padding numeric string vs number');
		});
		test('datetime', function () {
                        /* duktape
			wrapTest(
				['10/12/2008','10/11/2008','10/11/2007','10/12/2007'],
				['10/11/2007','10/12/2007','10/11/2008','10/12/2008'],
				'similar dates');
                        */
			wrapTest(
				['01/01/2008','01/10/2008','01/01/1992','01/01/1991'],
				['01/01/1991','01/01/1992','01/01/2008','01/10/2008'],
				'similar dates');
			wrapTest(
				[
					'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)',
					'Thu Dec 31 2009 00:00:00 GMT-0800 (Pacific Standard Time)',
					'Wed Jan 01 2010 00:00:00 GMT-0500 (Eastern Standard Time)'
				],[
					'Thu Dec 31 2009 00:00:00 GMT-0800 (Pacific Standard Time)',
					'Wed Jan 01 2010 00:00:00 GMT-0500 (Eastern Standard Time)',
					'Wed Jan 01 2010 00:00:00 GMT-0800 (Pacific Standard Time)'
				], 'javascript toString(), different timezones');
                        /* duktape
			wrapTest(
				[
					'Saturday, July 3, 2010',
					'Monday, August 2, 2010',
					'Monday, May 3, 2010'
				],[
					'Monday, May 3, 2010',
					'Saturday, July 3, 2010',
					'Monday, August 2, 2010'
				], 'Date.toString(), Date.toLocaleString()');
			wrapTest(
				[
					'Mon, 15 Jun 2009 20:45:30 GMT',
					'Mon, 3 May 2010 17:45:30 GMT',
					'Mon, 15 Jun 2009 17:45:30 GMT'
				],[
					'Mon, 15 Jun 2009 17:45:30 GMT',
					'Mon, 15 Jun 2009 20:45:30 GMT',
					'Mon, 3 May 2010 17:45:30 GMT'
				], 'Date.toUTCString()');
			wrapTest(
				[
					'Saturday, July 3, 2010 1:45 PM',
					'Saturday, July 3, 2010 1:45 AM',
					'Monday, August 2, 2010 1:45 PM',
					'Monday, May 3, 2010 1:45 PM'
				],[
					'Monday, May 3, 2010 1:45 PM',
					'Saturday, July 3, 2010 1:45 AM',
					'Saturday, July 3, 2010 1:45 PM',
					'Monday, August 2, 2010 1:45 PM'
				], '');
			wrapTest(
				[
					'Saturday, July 3, 2010 1:45:30 PM',
					'Saturday, July 3, 2010 1:45:29 PM',
					'Monday, August 2, 2010 1:45:01 PM',
					'Monday, May 3, 2010 1:45:00 PM'
				],[
					'Monday, May 3, 2010 1:45:00 PM',
					'Saturday, July 3, 2010 1:45:29 PM',
					'Saturday, July 3, 2010 1:45:30 PM',
					'Monday, August 2, 2010 1:45:01 PM'
				], '');
                        */
			wrapTest(
				[
					'2/15/2009 1:45 PM',
					'1/15/2009 1:45 PM',
					'2/15/2009 1:45 AM'
				],[
					'1/15/2009 1:45 PM',
					'2/15/2009 1:45 AM',
					'2/15/2009 1:45 PM'
				], '');
			wrapTest(
				[
					'2010-06-15T13:45:30',
					'2009-06-15T13:45:30',
					'2009-06-15T01:45:30.2',
					'2009-01-15T01:45:30'
				],[
					'2009-01-15T01:45:30',
					'2009-06-15T01:45:30.2',
					'2009-06-15T13:45:30',
					'2010-06-15T13:45:30'
				], 'ISO8601 Dates');
			wrapTest(
				[
					'2010-06-15 13:45:30',
					'2009-06-15 13:45:30',
					'2009-01-15 01:45:30'
				],[
					'2009-01-15 01:45:30',
					'2009-06-15 13:45:30',
					'2010-06-15 13:45:30'
				], 'ISO8601-ish YYYY-MM-DDThh:mm:ss - which does not parse into a Date instance');
                        /* duktape
			wrapTest(
				[
					'Mon, 15 Jun 2009 20:45:30 GMT',
					'Mon, 15 Jun 2009 20:45:30 PDT',
					'Mon, 15 Jun 2009 20:45:30 EST',
				],[
					'Mon, 15 Jun 2009 20:45:30 GMT',
					'Mon, 15 Jun 2009 20:45:30 EST',
					'Mon, 15 Jun 2009 20:45:30 PDT'
				], 'RFC1123 testing different timezones');
                        */
			wrapTest(
				[
					'1245098730000',
					'14330728000',
					'1245098728000'
				],[
					'14330728000',
					'1245098728000',
					'1245098730000'
				], 'unix epoch, Date.getTime()');
		});
		test('version number strings', function () {
			wrapTest(
				['1.0.2','1.0.1','1.0.0','1.0.9'],
				['1.0.0','1.0.1','1.0.2','1.0.9'],
				'close version numbers');
			wrapTest(
				['1.0.03','1.0.003','1.0.002','1.0.0001'],
				['1.0.0001','1.0.002','1.0.003','1.0.03'],
				'multi-digit branch release');
			wrapTest(
				['1.1beta','1.1.2alpha3','1.0.2alpha3','1.0.2alpha1','1.0.1alpha4','2.1.2','2.1.1'],
				['1.0.1alpha4','1.0.2alpha1','1.0.2alpha3','1.1.2alpha3','1.1beta','2.1.1','2.1.2'],
				'close version numbers');
			wrapTest(
				['myrelease-1.1.3','myrelease-1.2.3','myrelease-1.1.4','myrelease-1.1.1','myrelease-1.0.5'],
				['myrelease-1.0.5','myrelease-1.1.1','myrelease-1.1.3','myrelease-1.1.4','myrelease-1.2.3'],
				'string first');
		});
		test('numerics', function () {
			wrapTest(
				['10',9,2,'1','4'],
				['1',2,'4',9,'10'],
				'string vs number');
			wrapTest(
				['0001','002','001'],
				['0001','001','002'],
				'0 left-padded numbers');
			wrapTest(
				[2,1,'1','0001','002','02','001'],
				['0001','001','002','02',1,'1',2],
				'0 left-padded numbers and regular numbers');
			wrapTest(
				['10.0401',10.022,10.042,'10.021999'],
				['10.021999',10.022,'10.0401',10.042],
				'decimal string vs decimal, different precision');
			wrapTest(
				['10.04',10.02,10.03,'10.01'],
				['10.01',10.02,10.03,'10.04'],
				'decimal string vs decimal, same precision');
			wrapTest(
				['10.04f','10.039F','10.038d','10.037D'],
				['10.037D','10.038d','10.039F','10.04f'],
				'float/decimal with \'F\' or \'D\' notation');
			wrapTest(
				['10.004Z','10.039T','10.038ooo','10.037g'],
				['10.004Z','10.037g','10.038ooo','10.039T'],
				'not foat/decimal notation');
			wrapTest(
				['1.528535047e5','1.528535047e7','1.52e15','1.528535047e3','1.59e-3'],
				['1.59e-3','1.528535047e3','1.528535047e5','1.528535047e7','1.52e15'],
				'scientific notation');
			wrapTest(
				['-1','-2','4','-3','0','-5'],
				['-5','-3','-2','-1','0','4'],
				'negative numbers as strings');
			wrapTest(
				[-1,'-2',4,-3,'0','-5'],
				['-5',-3,'-2',-1,'0',4],
				'negative numbers as strings - mixed input type, string + numeric');
			wrapTest(
				[-2.01,-2.1,4.144,4.1,-2.001,-5],
				[-5,-2.1,-2.01,-2.001,4.1,4.144],
				'negative floats - all numeric');
		});
		test('IP addresses', function () {
			wrapTest(
				[
					'192.168.0.100',
					'192.168.0.1',
					'192.168.1.1',
					'192.168.0.250',
					'192.168.1.123',
					'10.0.0.2',
					'10.0.0.1'
				],
				[
					'10.0.0.1',
					'10.0.0.2',
					'192.168.0.1',
					'192.168.0.100',
					'192.168.0.250',
					'192.168.1.1',
					'192.168.1.123'
				]);
		});
		test('filenames', function () {
			wrapTest(
				['img12.png','img10.png','img2.png','img1.png'],
				['img1.png','img2.png','img10.png','img12.png'],
				'simple image filenames');
			wrapTest(
				['car.mov','01alpha.sgi','001alpha.sgi','my.string_41299.tif','organic2.0001.sgi'],
				['001alpha.sgi','01alpha.sgi','car.mov','my.string_41299.tif','organic2.0001.sgi'],
				'complex filenames');
			wrapTest([
					'./system/kernel/js/01_ui.core.js',
					'./system/kernel/js/00_jquery-1.3.2.js',
					'./system/kernel/js/02_my.desktop.js'
				],[
					'./system/kernel/js/00_jquery-1.3.2.js',
					'./system/kernel/js/01_ui.core.js',
					'./system/kernel/js/02_my.desktop.js'
				], 'unix filenames');
		});
		test('space(s) as first character(s)', function () {
			wrapTest(
				['alpha',' 1','  3',' 2',0],
				[0,' 1',' 2','  3','alpha']);
		});
		test('empty strings and space character', function () {
			wrapTest(
				['10023','999','',2,5.663,5.6629],
				['',2,5.6629,5.663,'999','10023']);
			wrapTest(
				[0,'0',''],
				[0,'0','']);
		});
		test('hex', function () {
			wrapTest(
				[ '0xA','0x9','0x99' ],
				[ '0x9','0xA','0x99'],
				'real hex numbers');
			wrapTest(
				[ '0xZZ','0xVVV','0xVEV','0xUU' ],
				[ '0xUU','0xVEV','0xVVV','0xZZ' ],'fake hex numbers');
		});
		test('unicode', function () {
			wrapTest(
				[ '\u0044', '\u0055', '\u0054', '\u0043' ],
				[ '\u0043', '\u0044', '\u0054', '\u0055' ],
				'basic latin');
		});
		test('sparse array sort', function () {
			var sarray = [3, 2]
			sarrayOutput = [1, 2, 3];
			sarray[10] = 1;
			for (var i=0; i < 8; i++)
				sarrayOutput.push(undefined);
			wrapTest(sarray, sarrayOutput,'simple sparse array');
		});
		test('case insensitive support', function () {
			naturalSort.insensitive = true;
			wrapTest(
				['A', 'b', 'C', 'd', 'E', 'f'],
				['A', 'b', 'C', 'd', 'E', 'f'],
				'case sensitive pre-sorted array');
			wrapTest(
				['A', 'C', 'E', 'b', 'd', 'f'],
				['A', 'b', 'C', 'd', 'E', 'f'],
				'case sensitive un-sorted array');
			naturalSort.insensitive = false;
			wrapTest(
				['A', 'C', 'E', 'b', 'd', 'f'],
				['A', 'C', 'E', 'b', 'd', 'f'],
				'case sensitive pre-sorted array');
			wrapTest(
				['A', 'b', 'C', 'd', 'E', 'f'],
				['A', 'C', 'E', 'b', 'd', 'f'],
				'case sensitive un-sorted array');
		});
		test('contributed tests', function () {
			wrapTest(
				['T78','U17','U10','U12','U14','745','U7','01','485','S16','S2','S22','1081','S25','1055','779','776','771','44','4','87','1091','42','480','952','951','756','1000','824','770','666','633','619','1','991','77H','PIER-7','47','29','9','77L','433'],
				['01','1','4','9','29','42','44','47','77H','77L','87','433','480','485','619','633','666','745','756','770','771','776','779','824','951','952','991','1000','1055','1081','1091','PIER-7','S2','S16','S22','S25','T78','U7','U10','U12','U14','U17'],
				'contributed by Bob Zeiner');
			wrapTest(
				[
					'FSI stop, Position: 5',
					'Mail Group stop, Position: 5',
					'Mail Group stop, Position: 5',
					'FSI stop, Position: 6',
					'FSI stop, Position: 6',
					'Newsstand stop, Position: 4',
					'Newsstand stop, Position: 4',
					'FSI stop, Position: 5'
				],[
					'FSI stop, Position: 5',
					'FSI stop, Position: 5',
					'FSI stop, Position: 6',
					'FSI stop, Position: 6',
					'Mail Group stop, Position: 5',
					'Mail Group stop, Position: 5',
					'Newsstand stop, Position: 4',
					'Newsstand stop, Position: 4'
				],'contributed by Scott');
		wrapTest(
			[2, 10, 1, 'azd', undefined, 'asd'],
			[1, 2, 10, 'asd', 'azd', undefined],
			'issue #2 - undefined support - jarvinen pekka');
                /* jsc
		wrapTest(
			[undefined, undefined, undefined, 1, undefined],
			[1, undefined, undefined, undefined],
			'issue #2 - undefined support - jarvinen pekka');
                */
		wrapTest(
			['-1', '-2', '4', '-3', '0', '-5'],
			['-5', '-3', '-2', '-1', '0', '4'],
			'issue #3 - invalid numeric string sorting - guilermo.dev');
                /* v8
		naturalSort.insensitive = true;
		wrapTest(
			['9','11','22','99','A','aaaa','bbbb','Aaaa','aAaa','aa','AA','Aa','aA','BB','bB','aaA','AaA','aaa'],
			['9', '11', '22', '99', 'A', 'aa', 'AA', 'Aa', 'aA', 'aaA', 'AaA', 'aaa', 'aaaa', 'Aaaa', 'aAaa', 'BB', 'bB', 'bbbb'],
			'issue #5 - invalid sort order - Howie Schecter');
		naturalSort.insensitive = false;
                */
		wrapTest(
			['9','11','22','99','A','aaaa','bbbb','Aaaa','aAaa','aa','AA','Aa','aA','BB','bB','aaA','AaA','aaa'],
			['9', '11', '22', '99', 'A', 'AA', 'Aa', 'AaA', 'Aaaa', 'BB', 'aA', 'aAaa', 'aa', 'aaA', 'aaa', 'aaaa', 'bB', 'bbbb'],
			'issue #5 - invalid sort order - Howie Schecter');
		wrapTest(
			['5D','1A','2D','33A','5E','33K','33D','5S','2C','5C','5F','1D','2M'],
			['1A','1D','2C','2D','2M','5C','5D','5E','5F','5S','33A','33D','33K'],
			'alphanumeric - number first');
		});
});
