function Course(props) {
    const { course } = props

    return (
        <div>
            <h1>{course.name}</h1>
            <ul>
                {course.parts.map(part => (
                    <li key={part.id}>
                        {part.name} {part.exercises}
                    </li>
                ))}
            </ul>
        </div>
    )
}
const TotalExercises = (parts) => {
    return parts.reduce((sum, part) => sum + part.exercises, 0)
}

const App = () => {
    const course = {
        id: 1,
        name: 'Half Stack application development',
        parts: [
            {
                name: 'Fundamentals of React',
                exercises: 10,
                id: 1
            },
            {
                name: 'Using props to pass data',
                exercises: 7,
                id: 2
            },
            {
                name: 'State of a component',
                exercises: 14,
                id: 3
            }
        ]
    }

    return (
        <>
          <Course course={course} />
            <p>Total exercises: {TotalExercises(course.parts)}</p>
        </>
)

}

export default App
