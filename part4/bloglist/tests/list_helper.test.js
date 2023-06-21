const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
test('dummy returns one', () => {
    const result = listHelper.dummy(helper.blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes([helper.blogs[0]])
        expect(result).toBe(7)
    })

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(helper.blogs)
        expect(result).toBe(36)
    })

})

describe('favorite blogs', () => {

    test('when list has only one blog, the favorite is that one', () => {
        const result = listHelper.favoriteBlog([helper.blogs[0]])
        expect(result).toEqual(helper.blogs[0])
    })

    test('of empty list is none', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual(undefined)
    })

    test('of a bigger list is chosen right', () => {
        const blogsToOrder = [...helper.blogs];
        const result = listHelper.favoriteBlog(blogsToOrder)
        expect(result).toEqual(helper.blogs[2])

    })

})

describe('author with most blogs', () => {

    test('when list has only one blog, the author is the same', () => {
        const result = listHelper.mostBlogs([helper.blogs[0]])
        expect(result).toEqual({ 'author': helper.blogs[0]['author'], 'blogs': 1 })
    })

    test('of empty list is none', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual({})
    })

    test('of a bigger list is chosen right', () => {
        const blogsToOrder = [...helper.blogs];
        const result = listHelper.mostBlogs(blogsToOrder)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })

    })
})

describe('author with most likes', () => {

    test('when list has only one blog, the author is the same', () => {
        const result = listHelper.mostLikes([helper.blogs[0]])
        expect(result).toEqual({ 'author': helper.blogs[0]['author'], 'likes': helper.blogs[0]['likes'] })
    })

    test('of empty list is none', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual({})
    })

    test('of a bigger list is chosen right', () => {
        const result = listHelper.mostLikes(helper.blogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })

    })
})


