import express from 'express'

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!')
})

export const runServer = () =>
	app.listen(3000, () => {
		console.log(`Example app listening`)
	})