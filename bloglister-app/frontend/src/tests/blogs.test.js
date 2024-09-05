import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Blog } from '../components/Blog'
import userEvent from '@testing-library/user-event'




const blog =
{
    title: "Microservices and the First Law of Distributed Objects",
    author: "Martin Fowler",
    url: "https://www.google.com",
    likes: 4,
    user: { username: "username", name: "name" }
}

test("renders the blogs title and author, but does not render its URL or number of likes by default", () => {
    const { container } = render(<Blog blog={blog} />)
    const title = container.querySelector('.title')
    const author = container.querySelector('.author')
    const url = container.querySelector('.url')

    expect(title).toHaveTextContent(
        'Microservices and the First Law of Distributed Objects'
    )
    expect(author).toHaveTextContent(
        'Martin Fowler'
    )
    expect(url).toBe(null);
})

test('blogs URL and number of likes are shown when the button controlling the shown details has been clicked', async () => {

    const mockHandler = jest.fn()

    const { container } = render(
        <Blog blog={blog} view={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)
    const url = container.querySelector('.url')
    const likes = container.querySelector('.likes')

    screen.debug(button)

    expect(url).toHaveTextContent(
        "https://www.google.com"
    )
    expect(likes).toHaveTextContent(
        4
    )
})
test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {

    const mockHandler = jest.fn()

    render(
        <Blog blog={blog} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const buttonView = screen.getByText('View')
    await user.click(buttonView)
    const buttonLike = screen.getByText('Like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
