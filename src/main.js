import { createApp } from 'vue'
import App from './App.vue'

const titleElement = document.querySelector('.p-title-value')

const isGameCategory = (() => {
	const breadcrumbUl = document.querySelector('ul.p-breadcrumbs')
	if (breadcrumbUl) {
		const breadcrumbs = [...breadcrumbUl.querySelectorAll(':scope > li')]
		return breadcrumbs.length === 3 && breadcrumbs[2].innerText.trim().toLowerCase().includes('games')
	}
	return false
})()

const gameInfo = titleElement ? (() => {
	const titleText = [...titleElement.childNodes].find(node => node.nodeType === Node.TEXT_NODE).textContent.trim()
	const matches = titleText.match(/^(.*?)\s*\[(.*?)\]\s*\[(.*?)\]$/)
	if (matches && matches.length === 4) {
		const ID = window.location.pathname.split('/')[2].split('.')[1]
		return {ID, name: matches[1], version: matches[2], author: matches[3] }
	}
})() : null

if (isGameCategory && gameInfo) {
	const app = createApp(App)
	app.provide('gameInfo', gameInfo)
	app.provide('titleElement', titleElement)

	app.mount(
		(() => {
			const app = document.createElement('div')
			document.body.append(app)
			return app
		})(),
	)
}
