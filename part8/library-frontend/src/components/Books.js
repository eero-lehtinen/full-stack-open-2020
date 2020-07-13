import React, { useState, useEffect } from 'react'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useQuery, useLazyQuery } from '@apollo/client'

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState('all genres')
  const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS)
  const genresResult = useQuery(ALL_GENRES)

  useEffect(() => {
    if (genreFilter === 'all genres' || genreFilter === '') {
      getBooks()
    }
    else {
      getBooks({ variables: { genre: genreFilter }, cachePolicy: 'network-only' })
    }
  }, [genreFilter]) // eslint-disable-line

  if (!props.show || booksResult.loading) {
    return null
  }

  const books = booksResult.data.allBooks

  let genres = []
  for (const book of genresResult.data.allBooks) {
    for (const genre of book.genres) {
      if (!genres.includes(genre))
        genres.push(genre)
    }
  }

  return (
    <div>
      <h2>books</h2>
      <div>in genre <strong>{genreFilter}</strong></div>
      <table>
        <tbody>
          <tr>
            <th></th><th>author</th><th>published</th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genres.map(genre => <button key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>)}
        <button onClick={() => setGenreFilter('all genres')}>all genres</button>
      </div>
    </div>
  )
}

export default Books