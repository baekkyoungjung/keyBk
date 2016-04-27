import React, { Component } from 'react';
 
// App component - represents the whole app
export default class App extends Component {
	constructor(props){
		super(props);
		[	
			'componentDidMount',
			'settingsWord',
			'keyDetected',
			'focusOut',
		    'focusWrite'
		].forEach( (method) => this[method] = this[method].bind(this) );

		this.state = {
			pressCode : {
				' ' :   32,
				'!'	: 	33,
				'"'	: 	34,
				'#'	: 	35,
				'$'	: 	36,
				'%'	: 	37,
				'&'	: 	38,
				"'"	: 	39,
				'('	: 	40,
				')'	: 	41,
				'*'	: 	42,
				'+'	: 	43,
				','	: 	44,
				'-'	: 	45,
				'.'	: 	46,
				'/'	: 	47,
				'{'	: 	123,
				'|'	: 	124,
				'}'	: 	125,
				'~'	: 	126,
				':'	: 	58,
				';'	: 	59,
				'<'	: 	60,
				'='	: 	61,
				'>'	: 	62,
				'?'	: 	63,
				'@'	: 	64,
				']'	: 	91,
				']'	: 	93,
				'^'	: 	94,
				'_'	: 	95,
				'`'	: 	96,
				0	: 	48,
				1	: 	49,
				2	: 	50,
				3	: 	51,
				4	: 	52,
				5	: 	53,
				6	: 	54,
				7	: 	55,
				8	: 	56,
				9	: 	57,
				A	: 	65,
				B	: 	66,
				C	: 	67,
				D	: 	68,
				E	: 	69,
				F	: 	70,
				G	: 	71,
				H	: 	72,
				I	: 	73,
				J	: 	74,
				K	: 	75,
				L	: 	76,
				M	: 	77,
				N	: 	78,
				O	: 	79,
				P	: 	80,
				Q	: 	81,
				R	: 	82,
				S	: 	83,
				T	: 	84,
				U	: 	85,
				V	: 	86,
				W	: 	87,
				X	: 	88,
				Y	: 	89,
				Z	: 	90,
				a	: 	97,
				b	: 	98,
				c	: 	99,
				d	: 	100,
				e	: 	101,
				f	: 	102,
				g	: 	103,
				h	: 	104,
				i	: 	105,
				j	: 	106,
				k	: 	107,
				l	: 	108,
				m	: 	109,
				n	: 	110,
				o	: 	111,
				p	: 	112,
				q	: 	113,
				r	: 	114,
				s	: 	115,
				t	: 	116,
				u	: 	117,
				v	: 	118,
				w	: 	119,
				x	: 	120,
				y	: 	121,
				z	: 	122,
				
			},
			upCode : [8],
			defaultWords : ['there is no spoon', 'i see dead people'],
			practice : {
				word : 'tHere is no spoon',
				wordSplit : [],
				keyCode : [],
				index : null
			}
		};
	}

	componentWillMount() {
		var newData = this.settingsWord(this.state);
		this.setState(newData);
		
	}

	componentDidMount() {

	}

	settingsWord(newData){
		newData.practice.word = Random.choice(this.state.defaultWords);
		newData.practice.wordSplit = newData.practice.word.split("");
		newData.practice.keyCode = [];
		newData.practice.wordSplit.map((chunk, index) => {
			newData.practice.keyCode.push(this.state.pressCode[chunk]);
		});
		newData.practice.index = 0;
		return newData;
	}

	keyDetected(string, e){
		var code = this.state.upCode.indexOf(e.keyCode) !== -1 ? e.keyCode : undefined || e.charCode === 0 ? undefined : e.charCode,
			newData = this.state;
		if(code === undefined) {
			return false;
		};
		if(newData.practice.keyCode[newData.practice.index] !== code){
			//틀림
			if(code === 8){
				$('#real-word').children('span.mis-typing').last().remove();
			}else {
				$(this.refs[`chunk-${this.state.practice.index}`]).before(`<span class="mis-typing">${String.fromCharCode(code) === " " ? "&nbsp" : String.fromCharCode(code)}</span>`)
			}

		}else if(!$('#real-word').children('span').hasClass('mis-typing')){
			//맞음
			newData.practice.index++;

		};
		if(newData.practice.wordSplit.length === newData.practice.index){
			newData = this.settingsWord(newData);
		};
		this.setState(newData);
	}

	focusOut(e){
		e.preventDefault();
		e.stopPropagation();
		$(this.refs.virtualView).removeClass('active');
	}

	focusWrite(e){
		e.preventDefault();
		e.stopPropagation();
		this.refs.writeThis.focus();
		$(this.refs.virtualView).addClass('active');

	}
 
    render() {
        return (
            <div className="container">
				<div id="virtual-write" ref="writeThis"
					contentEditable
					onKeyPress={this.keyDetected.bind(null, 'press')}
					onKeyUp={this.keyDetected.bind(null, 'up')}
				/>
				<div id="test" onClick={this.focusOut}>
					<div id="virtual-view" ref="virtualView" onClick={this.focusWrite}>
						<div id="real-word">
							{this.state.practice.wordSplit.map((chunk, index) => {
								return (
									<div key={index} ref={`chunk-${index}`} className={this.state.practice.index === index ? " eat-this " : this.state.practice.index > index ? " eated " : " "}>{chunk}</div>
								)	
							
							})}
						</div>
					</div>
				</div>
            </div>
        )
    }
}