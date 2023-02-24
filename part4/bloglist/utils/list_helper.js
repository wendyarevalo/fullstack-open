const lodashTools = require('lodash');

const totalLikes = (blogs) => {

    const initialValue = 0;
    return blogs.reduce(
        (accumulator, item) => accumulator + item["likes"],
        initialValue
    )
}

const favoriteBlog = (blogs) => {
    blogs.sort((a, b) => b["likes"] - a["likes"]);
    return blogs[0];
}

const mostBlogs = (blogs) => {
    const totalByAuthor = lodashTools.countBy(blogs, 'author')
    const entries = Object.entries(totalByAuthor);
    entries.sort((a, b) => b[1] - a[1]);
    return( blogs.length > 0 ? { 'author': entries[0][0], 'blogs': entries[0][1] } : {})
}

const mostLikes = (blogs) => {
    const blogsByAuthor = lodashTools.groupBy(blogs, 'author')
    const blogsByLikes = lodashTools.mapValues(blogsByAuthor, totalLikes)
    const entries = Object.entries(blogsByLikes);
    entries.sort((a, b) => b[1] - a[1]);
    return( blogs.length > 0 ? { 'author': entries[0][0], 'likes': entries[0][1] } : {})
}


const dummy = (blogs) => {
    return 1
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}