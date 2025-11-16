const Header = (props) => {
    return <h1>{props.course}</h1>
}

const Part = (props) => {
    console.log(JSON.stringify(props, null, 2));
    return (
        <p>
            {props.name} {props.exercises}
        </p>
    )
}

const Content = (props) => {
    return (
        <div>
            <Part name={props.part[0].name} exercises={props.part[0].exercises} />
            <Part name={props.part[1].name} exercises={props.part[1].exercises} />
            <Part name={props.part[2].name} exercises={props.part[2].exercises}/>
        </div>
    )
}

const Total = (props) => {
    return (
        <p>
            Number of exercises {props.exercises[0].exercises + props.exercises[1].exercises + props.exercises[2].exercises}
        </p>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const parts = [
        {
            name: 'Fundamentals of React',
            exercises: 10
        },
        {
            name: 'Using props to pass data',
            exercises: 7
        },
        {
            name: 'State of a component',
            exercises: 14
        }
    ]

    return (
        <div>
            <Header course={course} />
            <Content
                part={parts}
            />
            <Total
                exercises={parts}
            />
        </div>
    )
}

export default App