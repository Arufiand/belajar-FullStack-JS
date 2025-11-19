import {useState} from "react";


const Button = ({onClick, text}) => {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    )
}

// Moved History out of the App component to a top-level declaration
const History = (props) => {
    if (!props.allClicks || props.allClicks.length === 0) {
        return (
            <div>
                the app is used by pressing the buttons
            </div>
        )
    }

    return (
        <div>
            button press history: {props.allClicks.join(' ')}
        </div>
    )
}

const App = () => {
    const [left, setLeft] = useState(0);
    const [right, setRight] = useState(0);
    const [allClicks, setAll] = useState([]);

    const handleLeftClick = () => {
        setAll(allClicks.concat('L'));
        const updatedLeft = left + 1;
        setLeft(updatedLeft);
    }

    const handleRightClick = () => {
        setAll(allClicks.concat('R'));
        const updatedRight = right + 1;
        setRight(updatedRight);
    }

    return (
        <>
            <div>
                {left}
                <Button onClick={handleLeftClick} text="left" />
                <Button onClick={handleRightClick} text="right" />
                {right}
                <History allClicks={allClicks} />
            </div>
        </>
    );
}


export default App;


// const Header = (props) => {
//     return <h1>{props.course}</h1>
// }
//
// const Part = (props) => {
//
//     return (
//         <p>
//             {props.name} {props.exercises}
//         </p>
//     )
// }
//
// const Content = (props) => {
//     console.log(JSON.stringify(props, null, 2));
//     return (
//         <div>
//             <Part name={props.part[0].name} exercises={props.part[0].exercises} />
//             <Part name={props.part[1].name} exercises={props.part[1].exercises} />
//             <Part name={props.part[2].name} exercises={props.part[2].exercises}/>
//         </div>
//     )
// }
//
// const Total = (props) => {
//     return (
//         <p>
//             Number of exercises {props.exercises[0].exercises + props.exercises[1].exercises + props.exercises[2].exercises}
//         </p>
//     )
// }
//
// const App = () => {
//     const course = {
//         name: 'Half Stack application development',
//         parts: [
//             {
//                 name: 'Fundamentals of React',
//                 exercises: 10
//             },
//             {
//                 name: 'Using props to pass data',
//                 exercises: 7
//             },
//             {
//                 name: 'State of a component',
//                 exercises: 14
//             }
//         ]
//     }
//
//     return (
//         <div>
//             <Header course={course.name} />
//             <Content
//                 part={course.parts}
//             />
//             <Total
//                 exercises={course.parts}
//             />
//         </div>
//     )
// }
//
// export default App
