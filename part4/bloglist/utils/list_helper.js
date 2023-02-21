const totalLikes = (blogs) => {

    const initialValue = 0;
    return blogs.reduce(
        (accumulator, item) => accumulator + item["likes"],
        initialValue
    )
}

const dummy = (blogs) => {
    return 1
}

module.exports = {
    dummy,
    totalLikes
}