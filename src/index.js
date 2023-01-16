import React, { render, Component } from './react';

const root = document.getElementById('root');

const jsx = (
    <div>
        <p>Hello React</p>
        <p>Hi Fiber</p>
    </div>
)

// render(jsx, root)

// setTimeout(() => {
//     const jsx = (
//         <div>
//             {/* <p>奥利给</p> */}
//             <div>奥利给</div>
//             {/* <p>Hi Fiber</p> */}
//         </div>
//     )
//     render(jsx, root);
// }, 2000)

class Greating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '张三'
        }
    }

    render() {
        return (
            <div>
                <p>{this.props.title}hhhh{this.state.name}</p>
                <button onClick={() => this.setState({ name: '李四' })}>button</button>
            </div>
        );
    }
}

render(<Greating title='title' />, root)

function FnComponent(props) {
    return <div>{props.title}FnComponent</div>
}

// render(<FnComponent title='hello'/>, root)