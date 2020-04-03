import React, { Component } from 'react';

const KEY_CODE_ENTER = 13;
const KEY_CODE_ESCAPE = 27;
const KEY_CODE_UP_ARROW = 38;
const KEY_CODE_DOWN_ARROW = 40;
const KEY_CODE_FULL_STOP = 190;

export class PinsScriptEditor extends Component{
    
    constructor(props){
        super(props);
        this.textAreaRef = React.createRef();
        this.mirrorDivRef = React.createRef();
        this.mirrorSpanRef = React.createRef();
        this.state = {
            suggestions: [
                'appellant','applicationDate','applicationTitle'
            ],
            style : {
                fontFamily: props.fontFamily || 'Lucida Console' ,
                fontSize: props.fontSize || 12,
                padding: "0px",
                margin: "0px"
            },
            mirrorStyle: {
                whiteSpace: "pre-wrap",
                fontFamily: props.fontFamily || 'Lucida Console' ,
                fontSize: props.fontSize || 12,
            },
            hintStyle : {
                top:  0 ,
                left: 0 ,
                display: "none",
                margin: "0px",
                padding: "0px"
            },
            textToCarat: '',
            textAfterCarat: ' ',
            selectedHintId: 0
        }
    }

    onchange=(e)=>{
        this.setMirrorText(e);
    }

    onkeydown=(e)=>{
        if(this.state.hintStyle.display==="flex"){
            if(e.keyCode===KEY_CODE_ENTER || e.keyCode===KEY_CODE_UP_ARROW || e.keyCode===KEY_CODE_DOWN_ARROW ){
                e.preventDefault();
                return false;
            }
        }
    }
    
    onkeyup=(e)=>{
        e.preventDefault();
        if(e.keyCode===KEY_CODE_FULL_STOP){
            this.displayAndPositionSuggestions(e);
        }
        else if (e.keyCode===KEY_CODE_DOWN_ARROW){
            this.changeSelectedHint(e.keyCode);
        }
        else if (e.keyCode===KEY_CODE_UP_ARROW){
            this.changeSelectedHint(e.keyCode);
        }
        else if (e.keyCode===KEY_CODE_ENTER){
            if(this.state.hintStyle.display==="flex"){
                this.addSelectionToTextArea();
                this.hideHint();
            }
        }
        else if (e.keyCode===KEY_CODE_ESCAPE){
            this.hideHint();
        }
        return false;
    }

    addSelectionToTextArea(){
        let caratPos = this.textAreaRef.current.selectionStart;
        let valueUpToCarat = this.textAreaRef.current.value.substring(0,caratPos);
        let valueFromCaratToEnd = this.textAreaRef.current.value.substring(caratPos,this.textAreaRef.current.value.length);
        let newContent = valueUpToCarat + this.state.suggestions[this.state.selectedHintId] + valueFromCaratToEnd;
        this.textAreaRef.current.value = newContent;
    }

    changeSelectedHint(keyCode){
        if (keyCode===KEY_CODE_UP_ARROW){
            this.setState( (state)=> {
                return { selectedHintId : state.selectedHintId > 0 ? state.selectedHintId -1 : 0 };
            }  );
        }
        else if (keyCode===KEY_CODE_DOWN_ARROW){
            this.setState( (state)=> {
                return { selectedHintId : state.selectedHintId < state.suggestions.length -1 ? state.selectedHintId + 1 : state.suggestions.length -1 };
            }  );
        }
    }

    displayAndPositionSuggestions=(e)=>{
        this.setMirrorText(e);
        this.positionHintBox(e);
    }

    hideHint(){
        this.setState( (state) => { 
            return { hintStyle : { display: "none" }} 
        });
    }
    
    displayHint(){
        this.setState( (state) => { 
            return { hintStyle : { display: "flex" }} 
        });
    }
    
    getSuggestions=()=>{
        return this.state.suggestions;
    }
    
    setMirrorText=(e)=>{
        let caratPos = e.target.selectionStart;
        let currentText = e.target.value;
        this.setState( (state) => {
            return { 
                        textToCarat: currentText.substring( 0, caratPos ),
                        textAfterCarat: currentText.substring( caratPos, currentText.length )
                    }
                } 
        );
    }
    
    positionHintBox=(e)=>{
        const textAreaComputedStyle = getComputedStyle( this.textAreaRef.current );
        const offsetTop = this.mirrorSpanRef.current.offsetTop - this.textAreaRef.current.offsetHeight 
            - ( parseInt(textAreaComputedStyle.borderTopWidth) + parseInt(textAreaComputedStyle.borderBottomWidth));
        const offsetLeft = this.mirrorSpanRef.current.offsetLeft;
        this.setState((state)=>{
            return {hintStyle:{ 
                top : offsetTop, 
                left: offsetLeft,
                display: "flex"
            }}
        });
    }
    
    render(){
        return(
            <div>
                <textarea 
                    ref = { this.textAreaRef }
                    onChange = { this.onchange } 
                    onKeyDown = { this.onkeydown }
                    onKeyUp = { this.onkeyup } 
                    rows = { this.props.rows }
                    cols = { this.props.cols } 
                    style={ this.state.style }
                    >
                    </textarea>
                <div style={ this.state.hintStyle } id='hintDialog'>
                    <ul>
                        { this.state.suggestions.map((suggestion,i)=>{
                        return <li className = { this.state.selectedHintId===i ? 'highlighted' : '' } key={i}>{ suggestion }</li>;
                        })}
                    </ul>
                </div>
                <div 
                    id = 'mirror' 
                    style = { this.state.mirrorStyle }
                    ref = { this.mirrorDivRef }
                    >
                    { this.state.textToCarat }
                    <span ref={ this.mirrorSpanRef } id='textAfterCaret'>
                        { this.state.textAfterCarat }
                    </span>
                </div>
            </div>
        );
    }
}