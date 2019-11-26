import React, {Component} from 'react';
import './App.css';
const SIZE = 20;

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isRunning: true,
      field: this.generateRandomField(),
      fps: 30,
    };
  }

  setFps(value) {
    this.setState({
      fps: value,
    });
  }

  clearField() {
    this.setState({
      isRunning: false,
      field: new Array(SIZE*SIZE).fill(false),
    });
  }

  setRandomField() {
    this.setState({field: this.generateRandomField()});
  }

  generateRandomField() {
    return ([...new Array(SIZE*SIZE)]
      .map(() => Boolean(Math.round(Math.random()*0.7))));
  }

  toggleIsRunning() {
    this.setState({
      isRunning: !this.state.isRunning,
    });
  }

  toggleCellByIndex(index) {
    const { field } = this.state;
    const newField = [...field];
    newField[index] = !field[index];
    this.setState({
      isRunning: false,
      field: newField,
    });
  }

  getNewCellValue(field, index, value) {
    const neighboursCount = this.getAliveNeighbours(field,index % SIZE, Math.floor(index / SIZE));
    if (value === false && neighboursCount === 3) {
      return true;
    }
    if (value === true) {
      if (neighboursCount === 2 || neighboursCount === 3) {
        return true;
      }
    }
    return false;
  }

  getAliveNeighbours(field, x, y) {
    return this.getNeighbours(field, x, y).filter(x => Boolean(x)).length;
  }

  getNeighbours(field, x, y) {
    return [
      this.getCell(field, x - 1,y - 1),
      this.getCell(field, x,y - 1),
      this.getCell(field, x + 1,y - 1),
      this.getCell(field, x - 1,y),
      this.getCell(field, x + 1,y),
      this.getCell(field, x - 1,y + 1),
      this.getCell(field, x,y + 1),
      this.getCell(field, x + 1,y + 1),
    ];
  }

  getCell(field, x = 0, y = 0) {
    if (x < 0) {
      x = SIZE + x;
    }
    if (y < 0) {
      y = SIZE + y;
    }
    x = Math.abs(x % SIZE);
    y = Math.abs(y % SIZE);
    return field[x + y*SIZE];
  }

  tick() {
    const { isRunning } = this.state;
    clearTimeout(this.timer);
    if (isRunning) {
      this.prepareNextField();
    }
  }

  prepareNextField() {
    const { field } = this.state;
    let newField;
    newField = [];
    for (let i = 0; i < SIZE*SIZE; i++) {
      newField[i] = this.getNewCellValue(field, i, field[i]);
    }
    this.timer = setTimeout(
      this.setState.bind(this,{
        field: newField,
      }), 1000/this.fps)
  }

  componentDidMount() {
    this.tick();
  }

  componentDidUpdate() {
    this.tick();
  }

  render(){
    const { isRunning, field, fps } = this.state;
    return <>
      <div className="app" style={{width: SIZE*20}}>
        {
          field.map(
            (value,index) =>
              <Cell
                onMouseDown={this.toggleCellByIndex.bind(this, index)}
                isAlive={value}
                title={`${index%SIZE},${Math.floor(index/SIZE)}`}
                key={index}
              />
          )
        }
      </div>
      <button onClick={this.toggleIsRunning.bind(this)}>{isRunning ? 'Stop' : 'Start'}</button>
      <button onClick={this.clearField.bind(this)}>Clear</button>
      <button onClick={this.setRandomField.bind(this)}>Random</button>
      <input type='range' min={1} max={60} onChange={e => {this.setFps(e.target.value)}} value={fps}/>{fps}
    </>
  }
}

class Cell extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.isAlive !== nextProps.isAlive;
  }

  render() {
    const { isAlive, title, onMouseDown } = this.props;
    return <div
      onMouseDown={onMouseDown}
      className={`cell ${isAlive ? 'alive':''}`}
      title={title}
    />
  }
}

export default App;
