describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3001/api/testing/reset')
		cy.visit('http://localhost:3000')
	})

	it('Login form is shown', function () {
		cy.contains('Log in')
		cy.get('input[name=Username]').should('exist')
		cy.get('input[name=Password]').should('exist')
		cy.get('button[type=submit]').should('exist')
	})

	describe('Login', function () {
		beforeEach(function () {
			const user = {
				name: 'As df',
				username: 'asdf',
				password: 'asdfpw'
			}
			cy.request('POST', 'http://localhost:3001/api/users/', user)
			cy.visit('http://localhost:3000')
		})

		it('succeeds with correct credentials', function () {
			cy.get('input[name=Username]').type('asdf')
			cy.get('input[name=Password]').type('asdfpw')
			cy.get('button[type=submit]').click()
			cy.contains('login success')
		})

		it('fails with wrong credentials', function () {
			cy.get('input[name=Username]').type('wrong')
			cy.get('input[name=Password]').type('wrong')
			cy.get('button[type=submit]').click()
			cy.get('.error')
				.contains('wrong username or password')
				.should('have.css', 'color', 'rgb(255, 0, 0)')
		})

		describe('When logged in', function () {
			beforeEach(function () {
				cy.login({ username: 'asdf', password: 'asdfpw' })
			})

			it('A blog can be created', function () {
				cy.contains('new blog').click()
				cy.get('input[name=Title]').type('created title')
				cy.get('input[name=Author]').type('created author')
				cy.contains('create').click()

				cy.contains('created title')
				cy.contains('created author')
			})

			describe('When a blog exists', function () {
				beforeEach(function () {
					cy.createBlog({ title: 'created title', author: 'created author', likes: 0 })
					cy.visit('http://localhost:3000')
				})

				it('A blog can be liked', function () {
					cy.contains('view').click()
					cy.contains("likes 0")
					cy.get('button.like').click()
					cy.contains("likes 1")
				})

				it('A blog can be deleted', function () {
					cy.get('div.blog').should('exist')
					cy.contains('view').click()
					cy.get('button.delete').click()
					cy.get('div.blog').should('not.exist')
				})
			})

			describe('When a multiple blogs exist', function () {
				beforeEach(function () {
					cy.createBlog({ title: 'title2', author: 'title2', likes: 0 })
					cy.createBlog({ title: 'title0', author: 'title0', likes: 2 })
					cy.createBlog({ title: 'title1', author: 'title1', likes: 1 })
					cy.visit('http://localhost:3000')
				})

				it('Blogs are sorted based on likes', function () {
					cy.contains('title0')
					cy.contains('title1')
					cy.contains('title2')
					cy.get('button.view').click({ multiple: true })
					cy.get('div.blog').then((elements) => {
						elements.each(function (index, element) {
							expect(Cypress.$(element).find('button.like').parent()).to.contain('likes ' + (2 - index))
						})
					})
				})
			})
		})
	})
})