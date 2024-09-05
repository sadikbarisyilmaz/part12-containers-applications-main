describe('Blog List', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'test-user-name',
      username: 'test-user-username',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in to application')
  })

  describe('Login', function () {
    it('fails with wrong credentials', function () {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.fail')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'test-user-name logged in')
      cy.contains('test-user-name logged in').should('not.exist')
    })
    it('succeeds with correct credentials', function () {
      // cy.get('#username').type('test-user-username')
      // cy.get('#password').type('sekret')
      // cy.get('#login-button').click()
      cy.login({ username: 'test-user-username', password: 'sekret' })
      cy.contains('test-user-name logged in')

    })


  })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'test-user-username', password: 'sekret' })
      cy.contains('test-user-name logged in')

    })

    it('a new blog can be created', function () {
      cy.contains('New Blog').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('www.test-url.com')
      cy.contains('Submit').click()
      cy.contains('test title - test author')
    })


    describe('after creating a blog', function () {
      beforeEach(function () {
        cy.contains('New Blog').click()
        cy.get('#title').type('test title')
        cy.get('#author').type('test author')
        cy.get('#url').type('www.test-url.com')
        cy.contains('Submit').click()
        cy.contains('test title - test author')
      })

      it('a new blog can be liked', function () {

        cy.contains('test title - test author')
        cy.contains('View').click()
        cy.contains('Like').click()
        cy.get(".likes").contains('1')

      })
      it('a new blog can be deleted', function () {

        cy.contains('test title - test author')
        cy.contains('View').click()
        cy.contains('Remove').click()
        cy.contains('test title - test author').should('not.exist')

      })

      it(' only the creator can see the delete button of a blog, not anyone else', function () {

        cy.contains('Logout').click()

        const user = {
          name: 'test-user-name2',
          username: 'test-user-username2',
          password: 'sekret'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)

        cy.login({ username: 'test-user-username2', password: 'sekret' })

        cy.contains('test title - test author')
        cy.contains('View').click()
        cy.contains('Remove').should('not.exist')

      })

      it('blogs are ordered according to likes with the blog with the most likes being first', function () {

        cy.contains('New Blog').click()
        cy.get('#title').type('The title with the most likes')
        cy.get('#author').type('most like author')
        cy.get('#url').type('www.most-like-url.com')
        cy.contains('Submit').click()
        cy.contains('The title with the most likes - most like author')
        cy.contains('View').click()
        cy.contains(/^Like$/).click()
        cy.wait(500)
        cy.contains(/^Like$/).click()
        cy.wait(500)
        cy.contains('View').click()
        cy.contains('Hide').click()

        cy.contains(/^Like$/).click()
        cy.wait(500)
        cy.contains(/^Like$/).click()
        cy.wait(500)

        cy.contains(/^Like$/).click()
        cy.wait(500)

        cy.get('.blog>.indv-blog').eq(0).should('contain', 'The title with the most likes - most like author')
        cy.get('.blog>.indv-blog').eq(1).should('contain', 'test title - test author')


      })
    })



  })

})