import { Page } from 'puppeteer-core'
import WorkerPool from 'workerpool'
import { ENV, resourceExtension, userDataPath } from '../../constants'
import ServerConfig from '../../server.config'
import Console from '../../utils/ConsoleHandler'
import {
	BANDWIDTH_LEVEL,
	CACHEABLE_STATUS_CODE,
	DURATION_TIMEOUT,
	MAX_WORKERS,
	POWER_LEVEL,
	POWER_LEVEL_LIST,
	regexNotFoundPageID,
	regexQueryStringSpecialInfo,
} from '../constants'
import { ISSRResult } from '../types'
import BrowserManager, { IBrowser } from './BrowserManager'
import CacheManager from './CacheManager'

const browserManager = (() => {
	if (ENV === 'development') return undefined as unknown as IBrowser
	if (POWER_LEVEL === POWER_LEVEL_LIST.THREE)
		return BrowserManager(() => `${userDataPath}/user_data_${Date.now()}`)
	return BrowserManager()
})()

interface IISRHandlerParam {
	startGenerating: number
	isFirstRequest: boolean
	url: string
}

const getRestOfDuration = (startGenerating, gapDuration = 0) => {
	if (!startGenerating) return 0

	return DURATION_TIMEOUT - gapDuration - (Date.now() - startGenerating)
} // getRestOfDuration

const fetchData = async (
	input: RequestInfo | URL,
	init?: RequestInit | undefined,
	reqData?: { [key: string]: any }
) => {
	try {
		const params = new URLSearchParams()
		if (reqData) {
			for (const key in reqData) {
				params.append(key, reqData[key])
			}
		}

		const response = await fetch(
			input + (reqData ? `?${params.toString()}` : ''),
			init
		).then(async (res) => ({
			status: res.status,
			data: await res.text(),
		}))

		const data = /^{(.|[\r\n])*?}$/.test(response.data)
			? JSON.parse(response.data)
			: response.data

		return {
			...response,
			data,
		}
	} catch (error) {
		Console.error(error)
		return {
			status: 500,
			data: '',
		}
	}
} // fetchData

const waitResponse = async (page: Page, url: string, duration: number) => {
	let response
	try {
		response = await new Promise(async (resolve, reject) => {
			const result = await new Promise<any>((resolveAfterPageLoad) => {
				page
					.goto(url.split('?')[0], {
						waitUntil: 'domcontentloaded',
					})
					.then((res) => {
						setTimeout(
							() => resolveAfterPageLoad(res),
							BANDWIDTH_LEVEL > 1 ? 250 : 500
						)
					})
					.catch((err) => {
						reject(err)
					})
			})

			const html = await page.content()

			if (regexNotFoundPageID.test(html)) return resolve(result)

			await new Promise((resolveAfterPageLoadInFewSecond) => {
				const startTimeout = (() => {
					let timeout
					return (duration = BANDWIDTH_LEVEL > 1 ? 200 : 500) => {
						if (timeout) clearTimeout(timeout)
						timeout = setTimeout(resolveAfterPageLoadInFewSecond, duration)
					}
				})()

				startTimeout()

				page.on('requestfinished', () => {
					startTimeout()
				})
				page.on('requestservedfromcache', () => {
					startTimeout(100)
				})
				page.on('requestfailed', () => {
					startTimeout(100)
				})

				setTimeout(resolveAfterPageLoadInFewSecond, 10000)
			})

			resolve(result)
		})
	} catch (err) {
		throw err
	}

	return response
} // waitResponse

const gapDurationDefault = 1500

const ISRHandler = async ({ isFirstRequest, url }: IISRHandlerParam) => {
	const startGenerating = Date.now()
	if (getRestOfDuration(startGenerating, gapDurationDefault) <= 0) return

	const cacheManager = CacheManager()

	Console.log('Bắt đầu tạo page mới')

	let restOfDuration = getRestOfDuration(startGenerating, gapDurationDefault)

	if (restOfDuration <= 0) {
		if (!isFirstRequest) {
			const tmpResult = await cacheManager.achieve(url)

			return tmpResult
		}
		return
	}

	let html = ''
	let status = 200

	if (ServerConfig.crawler) {
		const requestParams = {
			startGenerating,
			isFirstRequest: true,
			url,
		}

		if (ServerConfig.crawlerSecretKey) {
			requestParams['crawlerSecretKey'] = ServerConfig.crawlerSecretKey
		}

		try {
			const result = await fetchData(
				ServerConfig.crawler,
				{
					method: 'GET',
					headers: new Headers({
						Accept: 'text/html; charset=utf-8',
					}),
				},
				requestParams
			)

			if (result) {
				status = result.status
				html = result.data
			}
		} catch (err) {
			Console.log('Page mới đã bị lỗi')
			Console.error(err)
		}
	}

	if (!ServerConfig.crawler || status === 500) {
		const page = await browserManager.newPage()

		if (!page) {
			if (!page && !isFirstRequest) {
				const tmpResult = await cacheManager.achieve(url)

				return tmpResult
			}
			return
		}

		let isGetHtmlProcessError = false

		try {
			await page.waitForNetworkIdle({ idleTime: 150 })
			await page.setRequestInterception(true)
			page.on('request', (req) => {
				const resourceType = req.resourceType()

				if (resourceType === 'stylesheet') {
					req.respond({ status: 200, body: 'aborted' })
				} else if (
					/(socket.io.min.js)+(?:$)|data:image\/[a-z]*.?\;base64/.test(url) ||
					/font|image|media|imageset/.test(resourceType)
				) {
					req.abort()
				} else {
					req.continue()
				}
			})

			const specialInfo = regexQueryStringSpecialInfo.exec(url)?.groups ?? {}

			await page.setExtraHTTPHeaders({
				...specialInfo,
				service: 'puppeteer',
			})

			await new Promise(async (res) => {
				Console.log(`Bắt đầu crawl url: ${url}`)

				let response

				try {
					response = await waitResponse(page, url, restOfDuration)
				} catch (err) {
					if (err.name !== 'TimeoutError') {
						isGetHtmlProcessError = true
						res(false)
						await page.close()
						return Console.error(err)
					}
				} finally {
					status = response?.status?.() ?? status
					Console.log('Crawl thành công!')
					Console.log(`Response status là: ${status}`)

					res(true)
				}
			})
		} catch (err) {
			Console.log('Page mới đã bị lỗi')
			Console.error(err)
			await page.close()
			return {
				status: 500,
			}
		}

		if (isGetHtmlProcessError)
			return {
				status: 500,
			}

		try {
			html = await page.content() // serialized HTML of page DOM.
			await page.close()
		} catch (err) {
			Console.error(err)
			return
		}

		status = html && regexNotFoundPageID.test(html) ? 404 : 200
	}

	Console.log('Số giây còn lại là: ', restOfDuration / 1000)
	Console.log('Tạo page mới thành công')

	restOfDuration = getRestOfDuration(startGenerating)

	let result: ISSRResult
	if (CACHEABLE_STATUS_CODE[status]) {
		const optimizeHTMLContentPool = WorkerPool.pool(
			__dirname + `/OptimizeHtml.worker.${resourceExtension}`,
			{
				minWorkers: 2,
				maxWorkers: MAX_WORKERS,
			}
		)

		try {
			html = await optimizeHTMLContentPool.exec('optimizeContent', [html, true])
		} catch (err) {
			Console.error(err)
			return
		} finally {
			optimizeHTMLContentPool.terminate()
		}

		result = await cacheManager.set({
			html,
			url,
			isRaw: true,
		})
	} else {
		await cacheManager.remove(url)
		return {
			status,
			html: status === 404 ? 'Page not found!' : html,
		}
	}

	return result
}

export default ISRHandler
