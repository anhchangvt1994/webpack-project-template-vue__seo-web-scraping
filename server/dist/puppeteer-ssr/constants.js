'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var _constants = require('../constants')
var _InitEnv = require('../utils/InitEnv')
// import ServerConfig from '../server.config'

// NOTE - Browser Options
const WINDOW_VIEWPORT_WIDTH = 1920
exports.WINDOW_VIEWPORT_WIDTH = WINDOW_VIEWPORT_WIDTH
// export const WINDOW_VIEWPORT_HEIGHT = 2160
const WINDOW_VIEWPORT_HEIGHT = 99999
exports.WINDOW_VIEWPORT_HEIGHT = WINDOW_VIEWPORT_HEIGHT
// const _userAgent =
// ServerConfig.crawl.content === 'desktop'
// 	? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
// 	: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
const optionArgs = [
	// `--user-agent=${_userAgent}`,
	'--no-sandbox',
	'--disable-setuid-sandbox',
	`--window-size=${exports.WINDOW_VIEWPORT_WIDTH},${exports.WINDOW_VIEWPORT_HEIGHT}`,
	`--ozone-override-screen-size=${exports.WINDOW_VIEWPORT_WIDTH},${exports.WINDOW_VIEWPORT_HEIGHT}`,
	'--disable-gpu',
	'--disable-infobars',
	'--disable-software-rasterizer',
	'--hide-scrollbars',
	'--disable-translate',
	'--disable-extensions',
	'--disable-plugins',
	'--disable-web-security',
	'--no-first-run',
	'--disable-notifications',
	// '--chrome-flags',
	'--ignore-certificate-errors',
	'--ignore-certificate-errors-spki-list ',
	'--disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure,IsolateOrigins,site-per-process,BlockInsecurePrivateNetworkRequests',
	'--disable-site-isolation-trials',
	'--no-zygote',
	'--disable-accelerated-2d-canvas',
	'--disable-speech-api', // 	Disables the Web Speech API (both speech recognition and synthesis)
	'--disable-background-networking', // Disable several subsystems which run network requests in the background. This is for use 									  // when doing network performance testing to avoid noise in the measurements. ↪
	'--disable-background-timer-throttling', // Disable task throttling of timer tasks from background pages. ↪
	'--disable-backgrounding-occluded-windows',
	'--disable-breakpad',
	'--disable-client-side-phishing-detection',
	'--disable-component-update',
	'--disable-default-apps',
	'--disable-dev-shm-usage',
	'--disable-domain-reliability',
	'--disable-features=AudioServiceOutOfProcess',
	'--disable-hang-monitor',
	'--disable-ipc-flooding-protection',
	'--disable-offer-store-unmasked-wallet-cards',
	'--disable-popup-blocking',
	'--disable-print-preview',
	'--disable-prompt-on-repost',
	'--disable-renderer-backgrounding',
	'--disable-sync',
	'--ignore-gpu-blacklist',
	'--metrics-recording-only',
	'--mute-audio',
	'--no-default-browser-check',
	'--no-pings',
	'--password-store=basic',
	'--use-gl=swiftshader',
	'--use-mock-keychain',
	// '--use-gl=angle',
	// '--use-angle=gl',
	// '--enable-unsafe-webgpu',
	// '--use-angle=disabled',
	// "--shm-size=4gb",
	// '--incognito',
	'--no-experiments',
	'--disable-features=site-per-process',
]
exports.optionArgs = optionArgs

const defaultBrowserOptions = {
	headless: 'shell',
	defaultViewport: {
		width: exports.WINDOW_VIEWPORT_WIDTH,
		height: exports.WINDOW_VIEWPORT_HEIGHT,
	},
	userDataDir: `${_constants.userDataPath}/user_data`,
	args: exports.optionArgs,
	protocolTimeout: 240000, // NOTE - Handle for error protocol timeout (can test adidas site to got detail of this issue)
	ignoreDefaultArgs: false,
	// ignoreHTTPSErrors: true,
}
exports.defaultBrowserOptions = defaultBrowserOptions

// NOTE - Regex Handler
const regexRemoveScriptTag =
	/(<script(?![\s\S]type="application\/(ld\+json|xml|rdf\+xml)")(\s[^>]+)*>(.|[\r\n])*?<\/script>|<script(?![\s\S]type="application\/(ld\+json|xml|rdf\+xml)")(\s[^>]+)*\/>)|(<link\s+(?=.*(rel=["']?(dns-prefetch|preconnect|modulepreload|preload|prefetch)["']?).*?(\/|)?)(?:.*?\/?>))|<iframe\s+(?:[^>]*?\s+)?((src|id)=["']?[^"]*\b((partytown|insider-worker)(?:-[a-z]+)?)\b[^"]*["']|\bvideo\b)?[^>]*>(?:[^<]*|<(?!\/iframe>))*<\/iframe>/g
exports.regexRemoveScriptTag = regexRemoveScriptTag
const regexRemoveStyleTag =
	/(<style(\s[^>]+)*>(.|[\r\n])*?<\/style>|<style(\s[^>]+)*\/>|<link\s+(?=.*(rel=["']?(stylesheet|shortcut icon)["']?|href=["']?.*?(css|style).*?["']?).*?(\/|)?)(?:.*?\/?>))|style=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)|class=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)/g
exports.regexRemoveStyleTag = regexRemoveStyleTag
const regexRemoveSpecialTag =
	/(<link\s+(?=.*(rel=["']?(dns-prefetch|preconnect|modulepreload|preload|prefetch)["']?).*?(\/|)?)(?:.*?\/?>))|<iframe\s+(?:[^>]*?\s+)?((src|id)=["']?[^"]*\b((partytown|insider-worker)(?:-[a-z]+)?)\b[^"]*["']|\bvideo\b)?[^>]*>(?:[^<]*|<(?!\/iframe>))*<\/iframe>|(<style(\s[^>]+)*>(.|[\r\n])*?<\/style>|<style(\s[^>]+)*\/>|<link\s+(?=.*(rel=["']?(stylesheet|shortcut icon)["']?|href=["']?.*?(css|style).*?["']?).*?(\/|)?)(?:.*?\/?>))/g
exports.regexRemoveSpecialTag = regexRemoveSpecialTag
const regexFullOptimizeBody =
	/<video(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/video>|<audio(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/audio>|<(video|audio)(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*\/>|<form(\s[^>]+)*>(.|[\r\n])*?<\/form>|<input(?![^>]*\b(?:type=['"](?:button|submit)['"]|type=(?:button|submit)\b)[^>]*>)[^>]*>|<textarea(\s[^>]+)*\/>|<textarea(\s[^>]+)*>(.|[\r\n])*?<\/textarea>|<label\s+(?=.*(for=["']?.*?["']?).*?(\/|)?)(?:.*?\/?>)|<svg(\s[^>]+)*>(.|[\r\n])*?<\/svg>|<span\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/span>))*<\/span>|<i\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/i>))*<\/i>|<img\s+(?=.*class=["']?.*?\b(fa-|material-icons|icon(-\w*)|ri-).*?["']?.*?(\/|)?)(?:.*?\/?>)|<img\s+(?=.*alt=["']?.*?\b(icon(-\w*)*(?:-[a-z]+)?)\b.*?["']?.*?(\/|)?)(?:.*?\/?>)|style=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)|class=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)|(<div(>|[\s\S]*?(>))|<\/div>)(?:[\s\S]*?|$)/g
exports.regexFullOptimizeBody = regexFullOptimizeBody
// const regexRemoveDivTag =
// 	/<div(>|[\s\S](?!only-dev)[\s\S]*?(>))[\s\S]*?<\/div>(?:[\s\S]*?|$)/g
// export const regexRemoveDivTag: RegExp =
// 	/(<div(>|[\s\S]*?(>))|<\/div>)(?:[\s\S]*?|$)/g
const regexRemoveIconTagFirst =
	/<img\s+(?=.*alt=["']?.*?\b(icon(-\w*)*(?:-[a-z]+)?)\b.*?["']?.*?(\/|)?)(?:.*?\/?>)/g
exports.regexRemoveIconTagFirst = regexRemoveIconTagFirst
const regexRemoveIconTagSecond =
	/<img\s+(?=.*class=["']?.*?\b(fa-|material-icons|icon(-\w*)|ri-).*?["']?.*?(\/|)?)(?:.*?\/?>)/g
exports.regexRemoveIconTagSecond = regexRemoveIconTagSecond
const regexRemoveClassAndStyleAttrs =
	/style=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)|class=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)/g
exports.regexRemoveClassAndStyleAttrs = regexRemoveClassAndStyleAttrs
const regexHandleAttrsImageTag = /<(source|img)([^>]*)(\/|)>/g
exports.regexHandleAttrsImageTag = regexHandleAttrsImageTag
const regexHandleAttrsHtmlTag = /<(html)([^>]*)>/g
exports.regexHandleAttrsHtmlTag = regexHandleAttrsHtmlTag
const regexHalfOptimizeBody =
	/<video(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/video>|<audio(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/audio>|<(video|audio)(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*\/>|<form(\s[^>]+)*>(.|[\r\n])*?<\/form>|<input(?![^>]*\b(?:type=['"](?:button|submit)['"]|type=(?:button|submit)\b)[^>]*>)[^>]*>|<textarea(\s[^>]+)*\/>|<textarea(\s[^>]+)*>(.|[\r\n])*?<\/textarea>|<label\s+(?=.*(for=["']?.*?["']?).*?(\/|)?)(?:.*?\/?>)|<svg(\s[^>]+)*>(.|[\r\n])*?<\/svg>|<span\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/span>))*<\/span>|<i\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/i>))*<\/i>|(<div(>|[\s\S]*?(>))|<\/div>)(?:[\s\S]*?|$)/g
exports.regexHalfOptimizeBody = regexHalfOptimizeBody
// export const regexHandleAttrsInteractiveTag: RegExp =
// 	/<(a|button|input)(?![^>]*rel="nofollow")([^>]*)(\/|)>([\s\S]*?)<\/(a|button)>/g
const regexHandleAttrsInteractiveTag =
	/<(a|button|input)([^>]*)(\/|)>([\s\S]*?)<\/(a|button)>/g
exports.regexHandleAttrsInteractiveTag = regexHandleAttrsInteractiveTag
const regexQueryStringSpecialInfo =
	/botInfo=(?<botInfo>[^&]*)&deviceInfo=(?<deviceInfo>[^&]*)&localeInfo=(?<localeInfo>[^&]*)&environmentInfo=(?<environmentInfo>[^&]*)/
exports.regexQueryStringSpecialInfo = regexQueryStringSpecialInfo

// NOTE - shallow optimize
const regexShallowOptimize =
	/(<script(?![\s\S]type="application\/(ld\+json|xml|rdf\+xml)")(\s[^>]+)*>(.|[\r\n])*?<\/script>|<script(?![\s\S]type="application\/(ld\+json|xml|rdf\+xml)")(\s[^>]+)*\/>)|(<link\s+(?=.*(rel=["']?(dns-prefetch|preconnect|modulepreload|preload|prefetch)["']?).*?(\/|)?)(?:.*?\/?>))|<iframe\s+(?:[^>]*?\s+)?((src|id)=["']?[^"]*\b((partytown|insider-worker)(?:-[a-z]+)?)\b[^"]*["']|\bvideo\b)?[^>]*>(?:[^<]*|<(?!\/iframe>))*<\/iframe>|(<style(\s[^>]+)*>(.|[\r\n])*?<\/style>|<style(\s[^>]+)*\/>|<link\s+(?=.*(rel=["']?(stylesheet|shortcut icon)["']?|href=["']?.*?(css|style).*?["']?).*?(\/|)?)(?:.*?\/?>))|<img\s+(?=.*alt=["']?.*?\b(icon(-\w*)*(?:-[a-z]+)?)\b.*?["']?.*?(\/|)?)(?:.*?\/?>)|<img\s+(?=.*class=["']?.*?\b(fa-|material-icons|icon(-\w*)|ri-).*?["']?.*?(\/|)?)(?:.*?\/?>)|<svg(\s[^>]+)*>(.|[\r\n])*?<\/svg>|<span\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/span>))*<\/span>|<i\s+(?:[^>]*?\s+)?class=["']?[^"]*\b((fa-|material-icons|icon(-\w*)*|ri-)(?:-[a-z]+)?)\b[^"]*["']?[^>]*>(?:[^<]*|<(?!\/i>))*<\/i>|<video(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/video>|<audio(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*>(.|[\r\n])*?<\/audio>|<(video|audio)(?![\s\S]*seo-tag=("|'|)true("|'|\s))(\s[^>]+)*\/>|<form(\s[^>]+)*>(.|[\r\n])*?<\/form>|<input(?![^>]*\b(?:type=['"](?:button|submit)['"]|type=(?:button|submit)\b)[^>]*>)[^>]*>|<textarea(\s[^>]+)*\/>|<textarea(\s[^>]+)*>(.|[\r\n])*?<\/textarea>|<label\s+(?=.*(for=["']?.*?["']?).*?(\/|)?)(?:.*?\/?>)|(<div(>|[\s\S]*?(>))|<\/div>)(?:[\s\S]*?|$)|style=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)|class=(?:("|'|)([^"']+)("|'|\s)[^>\s]*)/g
exports.regexShallowOptimize = regexShallowOptimize

const MAX_WORKERS = _InitEnv.PROCESS_ENV.MAX_WORKERS
	? Number(_InitEnv.PROCESS_ENV.MAX_WORKERS)
	: 7
exports.MAX_WORKERS = MAX_WORKERS
const DURATION_TIMEOUT = _constants.SERVER_LESS
	? 5000
	: _InitEnv.PROCESS_ENV.DURATION_TIMEOUT
	? Number(_InitEnv.PROCESS_ENV.DURATION_TIMEOUT)
	: 20000
exports.DURATION_TIMEOUT = DURATION_TIMEOUT

const DISABLE_COMPRESS_HTML = !!_InitEnv.PROCESS_ENV.DISABLE_COMPRESS_HTML
exports.DISABLE_COMPRESS_HTML = DISABLE_COMPRESS_HTML
const DISABLE_DEEP_OPTIMIZE = !!_InitEnv.PROCESS_ENV.DISABLE_DEEP_OPTIMIZE
exports.DISABLE_DEEP_OPTIMIZE = DISABLE_DEEP_OPTIMIZE
const DISABLE_OPTIMIZE = !!_InitEnv.PROCESS_ENV.DISABLE_OPTIMIZE
exports.DISABLE_OPTIMIZE = DISABLE_OPTIMIZE

const NOT_FOUND_PAGE_ID = _InitEnv.PROCESS_ENV.NOT_FOUND_PAGE_ID || '404-page'
exports.NOT_FOUND_PAGE_ID = NOT_FOUND_PAGE_ID
const regexNotFoundPageID = new RegExp(
	`id=["']?${exports.NOT_FOUND_PAGE_ID}["']?`
)
exports.regexNotFoundPageID = regexNotFoundPageID

const CACHEABLE_STATUS_CODE = { 200: true, 302: true }
exports.CACHEABLE_STATUS_CODE = CACHEABLE_STATUS_CODE

const chromiumPath =
	'https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar'
exports.chromiumPath = chromiumPath

const canUseLinuxChromium =
	_InitEnv.PROCESS_ENV.PLATFORM.toLowerCase() === 'linux' ||
	['true', 'TRUE', '1'].includes(process.env.USE_CHROME_AWS_LAMBDA || '')
exports.canUseLinuxChromium = canUseLinuxChromium

const puppeteer = (() => {
	if (exports.canUseLinuxChromium) return require('puppeteer-core')
	return require('puppeteer')
})()
exports.puppeteer = puppeteer

const DISABLE_SSR_CACHE = Boolean(_InitEnv.PROCESS_ENV.DISABLE_SSR_CACHE)
exports.DISABLE_SSR_CACHE = DISABLE_SSR_CACHE
const PM2_PROCESS_NAME = 'puppeteer-ssr'
exports.PM2_PROCESS_NAME = PM2_PROCESS_NAME
