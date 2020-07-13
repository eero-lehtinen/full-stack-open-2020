
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useApolloClient, useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from './queries'

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const client = useApolloClient()
  const userResult = useQuery(ME)
  const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  useEffect(() => {
    fetchFavorites()
  }, [userResult.data]) // eslint-disable-line

  const fetchFavorites = () => {
    if (userResult.data) {
      if (booksResult.data) {
        booksResult.refetch()
      }
      else {
        getBooks({ variables: { genre: userResult.data.me.favoriteGenre }, fetchPolicy: 'network-only' })
      }
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token &&
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={() => logout()}>logout</button>
          </>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors
        show={page === 'authors'} token={token}
      />

      <Books
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'} fetchFavorites={fetchFavorites}
      />

      <Recommend
        show={page === 'recommend'} favoriteBooksResult={booksResult} userResult={userResult}
      />

      <Login
        show={page === 'login'} setToken={setToken}
      />

    </div>
  )
}

export default App