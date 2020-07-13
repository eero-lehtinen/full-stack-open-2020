
import React from 'react'

const Recommend = (props) => {

	if (!props.show || !props.favoriteBooksResult.data || !props.userResult.data) {
		return null
	}

	const books = props.favoriteBooksResult.data.allBooks

	return (
		<div>
			<h2>recommendations</h2>
			<div>books in your favorite genre <strong>{props.userResult.data.me.favoriteGenre}</strong></div>
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
		</div>
	)
}

export default Recommend