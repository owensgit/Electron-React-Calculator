import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Calculator.css';

const Operations = {
  'plus':     (num1, num2) => num1 + num2,
  'minus':    (num1, num2) => num1 - num2,
  'divide':   (num1, num2) => num1 / num2,
  'multiply': (num1, num2) => num1 * num2,
}

const KeyCodes = {

}

class Display extends React.Component {
  render() {
    var displayText = this.props.displayText;
    if (displayText.length > 1 && displayText[0] === '0') {
      displayText = displayText.substring(1);
    }
    return (
      <div className={styles.display}>
        {displayText}
      </div>
    )
  }
}

class Key extends React.Component{
  render() {
    return (
      <button
        className={styles.key}
        onClick={this.props.onClick}>
        {this.props.value}
      </button>
    )
  }
}

export default class Calculator extends React.Component {
  constructor() {
    super();
    this.state = {
      currentDisplay: '0',
      storedDisplay: null,
      operation: null,
      operationJustEntered: false,
      displayingResult: false,
    }
  }
  createDigitKey(value) {
    return (
      <Key value={value} onClick={() => {this.handleDigitPress(value)}} />
    )
  }
  createOperationKey(text, operation) {
    return (
      <Key value={text} onClick={() => {this.handleOperationPress(operation)}} />
    )
  }
  createFunctionKey(text, funcName) {
    return (
      <Key value={text} onClick={() => {this[funcName]()}} />
    )
  }
  handleDigitPress(value) {
    const {operationJustEntered, displayingResult} = this.state;
    let currentDisplay = this.state.currentDisplay;

    if (displayingResult) {
      this.clearAll()
      currentDisplay = '0'
    }
    if (operationJustEntered) {
      this.setState({
        currentDisplay: value,
        storedDisplay: currentDisplay,
        operationJustEntered: false
      });
    } else {
      this.setState({
        currentDisplay: currentDisplay + value.toString()
      });
    }
  }
  handleOperationPress(operation) {
    this.setState({
      operation: operation,
      operationJustEntered: true,
      displayingResult: false
    });
  }
  calculateResult() {
    const {currentDisplay, storedDisplay, operation} = this.state;
    if (!operation || !storedDisplay) {
      return;
    }
    let num1 = parseInt(storedDisplay);
    let num2 = parseInt(currentDisplay);
    let result = Operations[operation](num1, num2);
    this.setState({
      currentDisplay: result,
      storedDisplay: null,
      operation: null,
      operationJustEntered: false,
      displayingResult: true
    });
  }
  clearAll() {
    this.setState({
      currentDisplay: '0',
      storedDisplay: null,
      operation: null,
      operationJustEntered: false,
      displayingResult: false
    });
  }
  clear() {
    let {currentDisplay} = this.state;
    currentDisplay = currentDisplay.length > 1
                     ? currentDisplay.substring(0, currentDisplay.length - 1)
                     : '0'
    this.setState({
      currentDisplay: currentDisplay,
      displayingResult: false
    });
  }
  handleKeyPress(evt) {
    //console.log('handleKeyPress - evt: %o', evt);
    const {key} = evt;
    const {currentDisplay, storedDisplay, operationJustEntered} = this.state;
    const numRegex = /^\d+$/;

    if (numRegex.test(key)) {
      this.handleDigitPress(key);
      return;
    }

    switch (key) {
      case "+":
        this.handleOperationPress('plus')
        break
      case "-":
        this.handleOperationPress('minus')
        break
      case "/":
        this.handleOperationPress('divide')
        break
      case "*":
        this.handleOperationPress('multiply')
        break
      case "Backspace":
        this.clear()
        break
      case "Escape":
        this.clearAll()
        break
      case "Enter":
        if (storedDisplay !== null && !operationJustEntered) {
          this.calculateResult();
        }
        break
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this))
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress.bind(this))
  }
  render() {
    return (
      <div className={styles.container}>
        <div>
          <Display displayText={this.state.currentDisplay}/>
        </div>
        <div>
          <div className="keyRow">
            {this.createDigitKey(7)}
            {this.createDigitKey(8)}
            {this.createDigitKey(9)}
            {this.createOperationKey('+', 'plus')}
            {this.createFunctionKey('AC', 'clearAll')}
          </div>
          <div className="keyRow">
            {this.createDigitKey(4)}
            {this.createDigitKey(5)}
            {this.createDigitKey(6)}
            {this.createOperationKey('-', 'minus')}
            {this.createFunctionKey('C', 'clear')}
          </div>
          <div className="keyRow">
            {this.createDigitKey(1)}
            {this.createDigitKey(2)}
            {this.createDigitKey(3)}
            {this.createOperationKey('*', 'multiply')}
          </div>
          <div className="keyRow">
            {this.createDigitKey(0)}
            {this.createDigitKey('.')}
            {this.createFunctionKey('=', 'calculateResult')}
            {this.createOperationKey('/', 'divide')}
          </div>
        </div>
      </div>
    );
  }
}
