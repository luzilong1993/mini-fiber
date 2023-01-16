import React, { render, Component } from './react';

const root = document.getElementById('root');

const jsx = (
    <div>
        <p>Hello React</p>
        <p>Hi Fiber</p>
    </div>
)

// render(jsx,root)

class Greating extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <p>hhhh</p>
            </div>
        );
    }
}

render(<Greating />, root)