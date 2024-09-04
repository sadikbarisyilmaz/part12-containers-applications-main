import React from "react"
import { render, screen } from "@testing-library/react"
import TodoHeader from "../Todos/TodoHeader"

test("renders h1 correctly", () => {
    render(<TodoHeader />);

    const element = screen.getByText('Todos')

    expect(element).toBeInTheDocument();
})
