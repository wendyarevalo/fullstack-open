describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'jdoe',
      name: 'Jane Doe',
      password: 'jdoe123'
    }).then(
      (response) => {
        expect(response.body).to.have.property('name', 'Jane Doe') // true
      }
    )
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Blogs')
    cy.contains('log in').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('jdoe')
      cy.get('#password').type('jdoe123')
      cy.get('#login-btn').click()

      cy.contains('Jane Doe logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('ndoe')
      cy.get('#password').type('jdoe123')
      cy.get('#login-btn').click()

      cy.get('.error')
        .should('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Jane Doe logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jdoe', password: 'jdoe123' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('A great blog')
      cy.get('#author').type('Nobody')
      cy.get('#url').type('www.example.com')
      cy.get('.createButton').click()
      cy.get('.notification')
        .should('contain', 'A new blog "A great blog" by Nobody added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('.blogCollapsedDiv')
        .should('contain', 'A great blog')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'A new great blog',
          author: 'Nobody',
          url: 'www.example.com'
        })
        cy.get('.blogCollapsedDiv').contains('view').click()
      })

      it('can be liked', function () {
        cy.get('.blogExpandedDiv').should('contain', '0 likes')
        cy.get('.blogExpandedDiv').contains('like').click()
        cy.get('.blogExpandedDiv').should('contain', '1 likes')
      })

      it('can be deleted by same author', function () {
        cy.get('.blogExpandedDiv').contains('remove').click()
        cy.get('.divBlogs').should('not.contain', 'A new great blog')
      })
    })
  })
})