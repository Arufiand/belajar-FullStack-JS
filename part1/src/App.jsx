import {useState} from "react";

const Display = ({counter}) => {
    return (
        <div>{counter}</div>
    )
}

const Button = ({onClick, text}) => {
    return (
        <button onClick={onClick}>
            {text}
        </button>
    )
}

const App = () => {
    const [ counter, setCounter ] = useState(0);
    console.log(`App: counter is now ${counter }`);
    const increaseByOne = () => {
        console.log(`increasing counter to ${counter }`);
        setCounter(counter + 1);
    }

    const decreaseByOne = () => {
        console.log(`decreasing counter to ${counter }`);
        setCounter(counter - 1);
    }

    const setToZero = () => {
        console.log(`setting counter to 0`);
        setCounter(0);
    }


    return (
        <div>
            <Display counter={counter}/>
            <Button onClick={increaseByOne} text="plus" />
            <Button onClick={decreaseByOne} text="minus" />
            <Button onClick={setToZero} text="zero" />
        </div>
    )
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


