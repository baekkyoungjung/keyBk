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
			pressCode : Bk.keyBk.pressCode,
			keyBk : Bk.keyBk.defaultWords,
			upCode : [8],
			practice : {
				word : 'tHere is no spoon',
				wordSplit : [],
				keyCode : [],
				index : null,
				active : false
			},

		};
	}

	componentWillMount() {
		var newData = this.settingsWord(this.state);
		this.setState(newData);
	}

	componentDidMount() {

	}

	settingsWord(newData){
		newData.practice.word = Random.choice(this.state.keyBk);
		newData.practice.wordSplit = newData.practice.word.split("");
		newData.practice.keyCode = [];
		newData.practice.wordSplit.map((chunk, index) => {
			newData.practice.keyCode.push(this.state.pressCode[chunk]);
		});
		newData.practice.index = 0;
		return newData;
	}

	keyDetected(e){
		console.log('keyDetected', e.charCode)
		var code = this.state.upCode.indexOf(e.keyCode) !== -1 ? e.keyCode : undefined || e.charCode === 0 ? undefined : e.charCode,
			newData = this.state;
		if(code === undefined) {
			return false;
		};
		if(newData.practice.keyCode[newData.practice.index] !== code){
			//틀림
			if(code === 8){
				$('#real-word').children('div.mis-typing').last().remove();
			}else {
				$(this.refs[`chunk-${this.state.practice.index}`]).before(`<div class="mis-typing">${String.fromCharCode(code) === " " ? "&nbsp" : String.fromCharCode(code)}</div>`)
			}

		}else if(!$('#real-word').children('div').hasClass('mis-typing')){
			//맞음
			newData.practice.index++;

		};
		if(newData.practice.wordSplit.length === newData.practice.index){
			newData = this.settingsWord(newData);
		};
		this.setState(newData);
	}

	focusOut(e){
		
		var toggleActive = this.state.practice;
		toggleActive.active = false;
		this.setState({practice : toggleActive});
	}

	focusWrite(e){
		e.preventDefault();
		e.stopPropagation();
		this.refs.writeThis.focus();
		var toggleActive = this.state.practice;
		toggleActive.active = true;
		this.setState({practice : toggleActive});

	}
 
    render() {
        return (
            <div className="container">
				<div id="virtual-write" ref="writeThis"
					contentEditable
					onKeyPress={this.keyDetected}
					onKeyUp={this.keyDetected}
				/>
				<div id="test" onClick={this.focusOut} className={this.state.practice.active ? "active" : ""}>
					<div id="status">aoneuth</div>
					<div id="virtual-view" ref="virtualView" className={this.state.practice.active ? "active" : ""} onClick={this.focusWrite}>
						<div id="virtual-view-overlay" className={this.state.practice.active ? " " : "active"}>Click Me</div>
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