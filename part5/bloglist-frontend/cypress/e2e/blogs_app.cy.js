describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
      username: 'jdoe',
      name: 'Jane Doe',
      password: 'jdoe123'
    }).then(
      (response) => {
        expect(response.body).to.have.property('name', 'Jane Doe') // true
      }
    )
    cy.visit('')
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
      })

      it('can be liked', function () {
        cy.get('.blogCollapsedDiv').contains('view').click()
        cy.get('.blogExpandedDiv').should('contain', '0 likes')
        cy.get('.blogExpandedDiv').contains('like').click()
        cy.get('.blogExpandedDiv').should('contain', '1 likes')
      })

      it('can be deleted by same author', function () {
        cy.get('.blogCollapsedDiv').contains('view').click()
        cy.get('.blogExpandedDiv').contains('remove').click()
        cy.get('.divBlogs').should('not.contain', 'A new great blog')
      })

      it('cannot delete other\'s author blog', function () {
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, {
          username: 'ndoe',
          name: 'No Doe',
          password: 'jdoe123'
        })
        cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
          username: 'ndoe', password: 'jdoe123'
        }).then(response => {
          cy.request({
            url: `${Cypress.env('BACKEND')}/blogs`,
            method: 'POST',
            body: { title:'Not Jane Doe blog', author:'Not Jane Doe', url:'www.example.com' },
            headers: {
              'Authorization': `Bearer ${response.body.token}`
            }
          })
        })
        cy.visit('')
        cy.get('.divBlogs').contains('Not Jane Doe')
          .contains('view').click().should('not.contain', 'remove')
      })

      it('shows blogs in likes order', function () {
        for (let i = 1; i <= 2; i++) {
          cy.request({
            url: `${Cypress.env('BACKEND')}/blogs`,
            method: 'POST',
            body: { title:`Blog ${i}`,
              author:'Not Jane Doe',
              url:'www.example.com',
              likes: i
            },
            headers: {
              'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
            }
          })
        }
        cy.request({
          url: `${Cypress.env('BACKEND')}/blogs`,
          method: 'POST',
          body: { title:'The title with the most likes',
            author:'Not Jane Doe',
            url:'www.example.com',
            likes: 1000
          },
          headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogappUser')).token}`
          }
        })
        cy.visit('')
        console.log(cy.get('.divBlogs'))
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'Blog 2')
        cy.get('.blog').eq(2).should('contain', 'Blog 1')
        cy.get('.blog').eq(3).should('contain', 'A new great blog')
      })
    })
  })
})