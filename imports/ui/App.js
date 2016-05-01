import React, { Component } from 'react';
import { toJS, fromJS, Map, List, OrderedSet } from 'immutable'; 
// App component - represents the whole app
export default class App extends Component {
	constructor(props){
		super(props);
		[	
			'optionsChange',
			'settingsWord',
			'keyDetected',
			'focusOut',
		    'focusWrite'
		].forEach( (method) => this[method] = this[method].bind(this) );

		this.state = {
			pressCode : Bk.keyBk.pressCode,
			keyBk : Bk.keyBk.defaultWords,
			upCode : [8],
			options : {
				deleteUpper : false,
				changeTheme : 'black',
				realtimeHidden : false
			},
			practice : {
				word : 'tHere is no spoon',
				wordSplit : [],
				wordIndex : 0,
				keyCode : [],
				index : null,
				active : false,
				cpmStatus : {
					startTime : null,
					cpm : 0,
					cpmTotal : 0,
					cpmAvg : 0,
				}
			},
		};
	}

	optionsChange(type = this.state.options.changeTheme){
		var newOptions = this.state.options = {
			changeTheme : type,
			deleteUpper : this.refs.deleteUpper.checked,
			realtimeHidden : this.refs.realtimeHidden.checked
		};
		newOptions.changeTheme = type;
		this.setState({options : newOptions});
		this.settingsWord(undefined, this.refs.deleteUpper.checked)
	}

	componentWillMount() {
		var newData = this.state.practice;
		newData.word = Random.choice(this.state.keyBk);
		this.settingsWord(newData);
		this.setState({practice : newData});
	}

	settingsWord(newData = this.state.practice){
		if(this.state.options.deleteUpper){
			newData.wordSplit = newData.word.toLowerCase().split("");
		}else {
			newData.wordSplit = newData.word.split("");
		};
		// newData.word = newData.word.replace(/ /gi, "␣");
	    // console.log('getTextWidth, type, d, glb, text, zoom', type, d, glb, text, zoom);
		newData.keyCode = [];
		newData.wordSplit.map((chunk, index) => {
			newData.keyCode.push(this.state.pressCode[chunk]);
		});
		newData.index = 0;
		if(newData.wordIndex > 0){
			newData.cpmStatus.cpmTotal += newData.cpmStatus.cpm;
			newData.cpmStatus.cpmAvg = Math.floor(newData.cpmStatus.cpmTotal / newData.wordIndex);
		};

		newData.wordIndex++;
		return newData;
	}

	keyDetected(e){
		console.log('keyDetected', e.charCode)
		var code = this.state.upCode.indexOf(e.keyCode) !== -1 ? e.keyCode : undefined || e.charCode === 0 ? undefined : e.charCode,
			newData = this.state.practice;
		if(code === undefined) {
			return false;
		}
		if(newData.keyCode[newData.index] !== code){
			//틀림
			if(code === 8){
				$('#real-word').children('div.mis-typing').last().remove();
			}else {
				$(this.refs[`chunk-${newData.index}`]).before(`<div class="mis-typing">${String.fromCharCode(code) === " " ? "&nbsp" : String.fromCharCode(code)}</div>`)
			};

		}else if(!$('#real-word').children('div').hasClass('mis-typing')){
			//맞음
			if(newData.index === 0){
				//첫진입이므로 시간 체크 시작
				newData.cpmStatus.startTime = new Date().getTime();
			}else {
				//속도는 일단 cpm기준으로 index / 시간
				//시간은 첫 스타트 타임에서 항상 뺀값 거기에 per min이니 나누기 60

 				newData.cpmStatus.cpm  = Math.floor(newData.index / ((Math.abs(newData.cpmStatus.startTime - new Date().getTime()) / 1000) / 60));


			};
			newData.index++;

		};
		if(newData.wordSplit.length === newData.index){
			newData.word = Random.choice(this.state.keyBk);
			newData = this.settingsWord(newData);
		};
		console.log('newData', newData);
		this.setState({practice : newData});
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
            <div className={"container " + (this.state.options.changeTheme)}>
	            <form>
	            	<div className="form-group">
	            		<div id="options">
	            			<div id="change-theme" className="text-center">
	            				<span className="theme-select">
	            					<button type="button" 
	            						className={"btn btn-xs btn-default black " + (this.state.options.changeTheme === 'white' ? " " : "active")}
	            						onClick={this.optionsChange.bind(null, 'black')}
	            					/>
	            				</span>
	            				<span className="theme-select">
	            					<button type="button" 
		            					className={"btn btn-xs btn-default white " + (this.state.options.changeTheme ==='white' ? "active" : " ")}
										onClick={this.optionsChange.bind(null, 'white')}
		            				/>
	            				</span>
	            			</div>
	            			<div id="delete-upper" className="checkbox" >
	            				<label onClick={this.optionsChange}>
	            				  <input ref="deleteUpper" type="checkbox"/>
	            					  짜증나는 대문자 없애기
	            				</label>
	            			</div>
	            			<div id="delete-upper" className="checkbox" >
	            				<label onClick={this.optionsChange}>
	            				  <input ref="realtimeHidden" type="checkbox"/>
	            					  실시간 속도 가리기
	            				</label>
	            			</div>
	            		</div>
	            	</div>
	            </form>
				<div id="virtual-write" ref="writeThis"
					contentEditable
					onKeyPress={this.keyDetected}
					onKeyUp={this.keyDetected}
				/>
				<div id="test" onClick={this.focusOut} className={this.state.practice.active ? "active" : ""}>
					<div id="status" className="text-center">
						<div>{this.state.practice.cpmStatus.cpmAvg}</div>
						<div className={this.state.options.realtimeHidden ? "hidden" : " "}>{this.state.practice.cpmStatus.cpm}</div>
					</div>
					<div id="virtual-view" ref="virtualView" className={this.state.practice.active ? "active" : ""} 
						onClick={this.focusWrite}
					>
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