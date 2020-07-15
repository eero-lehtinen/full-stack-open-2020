
import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useLazyQuery, useSubscription, useMutation } from '@apollo/client'
import { ALL_BOOKS, ME, BOOK_ADDED, ALL_AUTHORS, LOGIN } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const [getFavoriteBooks, favoriteBooksResult] = useLazyQuery(ALL_BOOKS)
  const [getUser, userResult] = useLazyQuery(ME, {
    onCompleted: (data) => getFavoriteBooks({ variables: { genre: data.me.favoriteGenre } })
  })
  const [getAuthors] = useLazyQuery(ALL_AUTHORS, { fetchPolicy: "network-only" })
  const [logged, setLogged] = useState(false)

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem('phonenumbers-user-token', data.login.value)
      setLogged(true)
      getUser()
    },
    onError: (error) => console.error(error)
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const bookAdded = subscriptionData.data.bookAdded

      window.alert(`added book ${bookAdded.title}`)

      getAuthors()

      if (bookAdded.author)
        if (userResult) {
          addBookToCache(bookAdded)
          for (const genre of bookAdded.genres) {
            addBookToCache(bookAdded, { genre: genre })
          }
        }
    }
  })


  const addBookToCache = (bookData, variables = undefined) => {
    try {
      const oldData = client.readQuery({
        query: ALL_BOOKS,
        variables: variables
      })

      client.writeQuery({
        query: ALL_BOOKS,
        variables: variables,
        data: {
          allBooks: [...oldData.allBooks, bookData]
        }
      })
    }
    catch (error) {
      return
    }
  }

  const logout = () => {
    setLogged(false)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {logged &&
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </>}
        {!logged && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors
        show={page === 'authors'} authorsResult
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommend
        show={page === 'recommend'} favoriteBooksResult={favoriteBooksResult} userResult={userResult}
      />

      <Login
        show={page === 'login'} login={login}
      />

    </div>
  )
}

export default App