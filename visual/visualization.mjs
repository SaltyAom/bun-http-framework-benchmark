const logoFiles = {
	uws: 'uws.png',
	elysia: 'elysia.png',
	h3: 'h3.png',
	bun: 'bun.png',
	hono: 'hono.png',
	deno: 'deno.png',
	node: 'node.png',
	effect: 'effect.png',
	fastify: 'fastify.png',
	express: 'express.png',
	koa: 'koa.png',
	adonis: 'adonis.png',
	nest: 'nest.png',
	oak: 'oak.png',
	acorn: 'acorn.png'
}
const logoAliases = {
	'elysia-aot': 'elysia',
	'bun-web-standard': 'bun',
	'deno-web-standard': 'deno'
}
const logoInitials = {
	uws: 'UW',
	'ultimate-express': 'UE',
	'hyper-express': 'HE',
	acorn: 'AC'
}

export function frameworkLogo(framework) {
	const canonical = Object.hasOwn(logoAliases, framework)
		? logoAliases[framework]
		: framework
	const file = Object.hasOwn(logoFiles, canonical)
		? logoFiles[canonical]
		: null
	const initials = Object.hasOwn(logoInitials, canonical)
		? logoInitials[canonical]
		: canonical
				.replace(/[^a-z]/gi, '')
				.slice(0, 2)
				.toUpperCase()
				.padEnd(2, 'X')
	return { file, initials }
}

function createLogo(framework) {
	const { file, initials } = frameworkLogo(framework)
	const icon = document.createElement('span')
	icon.className = 'logo'
	icon.setAttribute('aria-hidden', 'true')
	icon.textContent = initials
	if (file) {
		const image = document.createElement('img')
		image.alt = ''
		image.src = new URL(`./logos/${file}`, import.meta.url).href
		if (file === 'effect.png') image.className = 'effect-logo'
		image.addEventListener('error', () => image.replaceWith(initials), {
			once: true
		})
		icon.replaceChildren(image)
	}
	return icon
}

export const metrics = ['Average', 'Ping', 'Query', 'Body', 'Video']
const storageKey = 'bun-http-benchmark:visual-options'

export function visualOptions(rows, saved, reducedMotion = false) {
	if (typeof saved === 'string') {
		try {
			saved = JSON.parse(saved)
		} catch {
			saved = null
		}
	}
	if (!saved || typeof saved !== 'object' || Array.isArray(saved)) saved = {}
	const presets = ['all', ...new Set(rows.map((row) => row.runtime))]
	if (presets.includes('node')) presets.push('node-http')
	const custom =
		Array.isArray(saved.selection) &&
		saved.selection.every((id) => typeof id === 'string')
	const preset = custom
		? 'custom'
		: presets.includes(saved.selection)
			? saved.selection
			: 'all'
	const selectedIds = new Set(custom ? saved.selection : [])
	const included = rows.filter((row) =>
		custom
			? selectedIds.has(`${row.runtime}/${row.framework}`)
			: preset === 'all' ||
				(preset === 'node-http'
					? row.runtime === 'node' &&
						!['uws', 'hyper-express', 'ultimate-express'].includes(
							row.framework
						)
					: row.runtime === preset)
	)
	return {
		metric: metrics.includes(saved.metric) ? saved.metric : 'Ping',
		memorySort: ['before', 'after', 'name'].includes(saved.memorySort)
			? saved.memorySort
			: 'after',
		memoryView: ['both', 'before', 'after'].includes(saved.memoryView)
			? saved.memoryView
			: 'both',
		speed:
			Number.isFinite(saved.speed) &&
			saved.speed >= 0.25 &&
			saved.speed <= 64 &&
			Number.isInteger(saved.speed * 4)
				? saved.speed
				: 1,
		paused: reducedMotion || saved.paused === true,
		preset,
		included
	}
}

export function parseResults(markdown) {
	const lines = markdown.split(/\r?\n/)
	const cells = (line) =>
		line
			.trim()
			.replace(/^\|/, '')
			.replace(/\|$/, '')
			.split('|')
			.map((cell) => cell.trim())
	const headerIndex = lines.findIndex(
		(line) =>
			line.trim().startsWith('|') &&
			cells(line).includes('Framework') &&
			cells(line).includes('Runtime')
	)
	if (headerIndex < 0) throw new Error('Missing results table')
	const headers = cells(lines[headerIndex])
	if (
		new Set(headers).size !== headers.length ||
		['Framework', 'Runtime', ...metrics].some(
			(header) => !headers.includes(header)
		)
	)
		throw new Error('Missing or duplicate results columns')
	const separator = cells(lines[headerIndex + 1] || '')
	if (
		separator.length !== headers.length ||
		separator.some((cell) => !/^:?-{3,}:?$/.test(cell))
	)
		throw new Error('Invalid results table separator')
	const rows = []
	const identities = new Set()
	for (const line of lines.slice(headerIndex + 2)) {
		if (!line.trim().startsWith('|')) break
		const values = cells(line)
		if (values.length !== headers.length)
			throw new Error('Invalid results row width')
		const record = Object.fromEntries(
			headers.map((header, index) => [header, values[index]])
		)
		const framework = record.Framework
		const runtime = record.Runtime
		const identity = JSON.stringify([runtime, framework])
		if (!framework || !runtime || identities.has(identity))
			throw new Error('Missing or duplicate runtime/framework')
		identities.add(identity)
		const throughput = {}
		const display = {}
		for (const metric of metrics) {
			const text = record[metric]
			if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(text))
				throw new Error(
					`Invalid ${metric} throughput for ${runtime}/${framework}`
				)
			const value = Number(text.replaceAll(',', ''))
			if (!Number.isFinite(value))
				throw new Error(
					`Invalid ${metric} throughput for ${runtime}/${framework}`
				)
			throughput[metric] = value
			display[metric] = text
		}
		let memory = null
		const memoryText = record['Memory Before/After']
		if (memoryText !== undefined && memoryText !== 'n/a') {
			const pair = /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?) MB$/.exec(
				memoryText
			)
			if (
				!pair ||
				!Number.isFinite(Number(pair[1])) ||
				!Number.isFinite(Number(pair[2]))
			)
				throw new Error(
					`Invalid memory before/after for ${runtime}/${framework}`
				)
			memory = {
				before: Number(pair[1]),
				after: Number(pair[2]),
				displayBefore: pair[1],
				displayAfter: pair[2]
			}
		}
		rows.push({ framework, runtime, throughput, display, memory })
	}
	if (!rows.length) throw new Error('Results table is empty')
	return rows
}

export function memoryScale(rows) {
	const highest = Math.max(
		0,
		...rows.flatMap((row) =>
			row.memory ? [row.memory.before, row.memory.after] : []
		)
	)
	if (highest === 0) return { maximum: 50, step: 10 }
	const unit = 10 ** Math.floor(Math.log10(highest / 6))
	const step =
		[1, 2, 5, 10].find((multiple) => multiple * unit >= highest / 6) * unit
	const maximum = Math.ceil(highest / step) * step
	return Number.isFinite(maximum)
		? { maximum, step }
		: { maximum: highest, step: highest / 5 }
}

export function sortMemory(rows, sort = 'after') {
	return [...rows].sort((a, b) => {
		const difference =
			sort === 'name'
				? 0
				: (a.memory?.[sort] ?? Infinity) -
					(b.memory?.[sort] ?? Infinity)
		return (
			difference ||
			a.framework.localeCompare(b.framework) ||
			a.runtime.localeCompare(b.runtime)
		)
	})
}

export function ballPosition(elapsedMs, throughput, maximum, travel) {
	if (maximum === 0 || travel <= 0) return 0
	const phase = (((elapsedMs / 6000) * throughput) / maximum) % 2
	return (phase <= 1 ? phase : 2 - phase) * travel
}

export function playbackElapsed(elapsed, startedAt, now, speed) {
	return elapsed + (startedAt === null ? 0 : (now - startedAt) * speed)
}

async function mount() {
	const metric = document.querySelector('#metric')
	const preset = document.querySelector('#preset')
	const speed = document.querySelector('#speed')
	const speedValue = document.querySelector('#speed-value')
	const frameworks = document.querySelector('#frameworks')
	const selection = document.querySelector('#selection')
	const pause = document.querySelector('#pause')
	const restart = document.querySelector('#restart')
	const field = document.querySelector('#field')
	const status = document.querySelector('#status')
	const memorySection = document.querySelector('#memory')
	const memoryChart = document.querySelector('#memory-chart')
	const memoryAxis = document.querySelector('#memory-axis')
	const memoryGroups = document.querySelector('#memory-groups')
	const memoryLegend = document.querySelector('.memory-legend')
	const memoryScroll = document.querySelector('.memory-scroll')
	const memoryEmpty = document.querySelector('#memory-empty')
	const memorySort = document.querySelector('#memory-sort')
	const memoryView = document.querySelector('#memory-view')
	const beforeLegend = document.querySelector('#memory-before-legend')
	const afterLegend = document.querySelector('#memory-after-legend')
	const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
	try {
		const response = await fetch('../results/results.md', {
			cache: 'no-store'
		})
		if (!response.ok)
			throw new Error(`Results request failed (${response.status})`)
		const rows = parseResults(await response.text())
		const scale = memoryScale(rows)
		memoryGroups.style.setProperty(
			'--grid-step',
			`${(scale.step / scale.maximum) * 100}%`
		)
		for (let value = 0; value <= scale.maximum; value += scale.step) {
			const tick = document.createElement('span')
			tick.textContent = Number(value.toPrecision(3)).toString()
			tick.style.bottom = `${(value / scale.maximum) * 100}%`
			memoryAxis.append(tick)
		}
		memorySection.hidden = false
		let saved = null
		try {
			saved = localStorage.getItem(storageKey)
		} catch {}
		const options = visualOptions(rows, saved, reduceMotion.matches)
		metric.value = options.metric
		memorySort.value = options.memorySort
		memoryView.value = options.memoryView
		speed.value = options.speed
		speedValue.value = `${options.speed}×`
		let included = new Set(options.included)
		const choices = rows.map((row) => {
			const label = document.createElement('label')
			const checkbox = document.createElement('input')
			checkbox.type = 'checkbox'
			checkbox.checked = included.has(row)
			label.append(
				checkbox,
				createLogo(row.framework),
				`${row.runtime}/${row.framework}`
			)
			frameworks.append(label)
			checkbox.addEventListener('change', () => {
				if (checkbox.checked) included.add(row)
				else included.delete(row)
				preset.value = 'custom'
				render()
				saveOptions()
			})
			return { row, checkbox }
		})
		for (const name of [
			...new Set(rows.map((row) => row.runtime))
		].sort()) {
			const option = document.createElement('option')
			option.value = name
			option.textContent =
				{ bun: 'Bun', node: 'Node', deno: 'Deno' }[name] || name
			preset.append(option)
			if (name === 'node') {
				const nativeHttp = document.createElement('option')
				nativeHttp.value = 'node-http'
				nativeHttp.textContent = 'Node HTTP'
				preset.append(nativeHttp)
			}
		}
		const custom = document.createElement('option')
		custom.value = 'custom'
		custom.textContent = 'Custom'
		custom.disabled = true
		preset.append(custom)
		preset.value = options.preset
		let paused = options.paused
		let rate = options.speed
		let elapsed = 0
		let startedAt = null
		let frame = null
		let balls = []
		let maximum = 0
		let travel = 0
		const colors = [
			'#6299cd',
			'#9a522c',
			'#eeac45',
			'#b72ae4',
			'#50c8de',
			'#dc8eaa',
			'#26ae48',
			'#363636',
			'#16b4e8',
			'#8b86bb',
			'#e84a2b',
			'#2566dc',
			'#f3d851'
		]
		function saveOptions() {
			try {
				localStorage.setItem(
					storageKey,
					JSON.stringify({
						metric: metric.value,
						memorySort: memorySort.value,
						memoryView: memoryView.value,
						speed: rate,
						paused,
						selection:
							preset.value === 'custom'
								? [...included].map(
										(row) =>
											`${row.runtime}/${row.framework}`
									)
								: preset.value
					})
				)
			} catch {}
		}
		function paint(time) {
			for (const { ball, value } of balls)
				ball.style.transform = `translateX(${ballPosition(time, value, maximum, travel)}px)`
		}
		function tick(now) {
			paint(playbackElapsed(elapsed, startedAt, now, rate))
			frame = requestAnimationFrame(tick)
		}
		function syncMotion() {
			elapsed = playbackElapsed(
				elapsed,
				startedAt,
				performance.now(),
				rate
			)
			cancelAnimationFrame(frame)
			startedAt = null
			frame = null
			paint(elapsed)
			pause.textContent = paused ? 'Resume' : 'Pause'
			if (!paused && !document.hidden) {
				startedAt = performance.now()
				frame = requestAnimationFrame(tick)
			}
		}
		function measure() {
			const lane = field.querySelector('.lane')
			travel = lane ? Math.max(0, lane.clientWidth - 36) : 0
			paint(playbackElapsed(elapsed, startedAt, performance.now(), rate))
		}
		function measureMemoryLegend() {
			const lastGroup = memoryGroups.lastElementChild
			if (!lastGroup) {
				memoryLegend.style.removeProperty('width')
				return
			}
			const left = memoryLegend.getBoundingClientRect().left
			const right = Math.min(
				lastGroup.getBoundingClientRect().right,
				memoryScroll.getBoundingClientRect().right
			)
			memoryLegend.style.width = `${Math.max(0, right - left)}px`
		}
		function renderMemory(selected) {
			beforeLegend.hidden = memoryView.value === 'after'
			afterLegend.hidden = memoryView.value === 'before'
			memoryChart.hidden = selected.length === 0
			memoryEmpty.hidden = selected.length !== 0
			memoryGroups.replaceChildren(
				...sortMemory(selected, memorySort.value).map((row) => {
					const group = document.createElement('li')
					group.className = 'memory-group'
					const name = document.createElement('div')
					name.className = 'memory-name'
					name.textContent = row.framework
					const runtime = document.createElement('span')
					runtime.textContent = row.runtime
					name.append(runtime)
					const bars = document.createElement('div')
					bars.className = 'memory-bars'
					if (row.memory) {
						for (const [key, label, display] of [
							['before', 'Before', 'displayBefore'],
							['after', 'After', 'displayAfter']
						]) {
							if (
								memoryView.value !== 'both' &&
								memoryView.value !== key
							)
								continue
							const column = document.createElement('div')
							column.className = `memory-column ${key}`
							column.style.height = `${(row.memory[key] / scale.maximum) * 100}%`
							const value = document.createElement('span')
							value.className = 'memory-value'
							const labelText = document.createElement('span')
							labelText.className = 'visually-hidden'
							labelText.textContent = `${label} `
							value.append(labelText, `${row.memory[display]} MB`)
							const bar = document.createElement('span')
							bar.className = 'memory-bar'
							bar.setAttribute('aria-hidden', 'true')
							column.append(value, bar)
							bars.append(column)
						}
					} else bars.textContent = 'Unavailable'
					group.append(name, bars)
					return group
				})
			)
			measureMemoryLegend()
		}
		function render(reset = false) {
			elapsed = reset
				? 0
				: playbackElapsed(elapsed, startedAt, performance.now(), rate)
			cancelAnimationFrame(frame)
			startedAt = null
			maximum = Math.max(
				...rows.map((row) => row.throughput[metric.value])
			)
			const selected = rows
				.filter((row) => included.has(row))
				.sort(
					(a, b) =>
						b.throughput[metric.value] - a.throughput[metric.value]
				)
			renderMemory(selected)
			field.replaceChildren()
			balls = selected.map((row) => {
				const item = document.createElement('div')
				item.className = 'row'
				const name = document.createElement('div')
				name.className = 'name'
				const framework = document.createElement('span')
				framework.className = 'framework'
				framework.textContent = row.framework
				const runtimeName = document.createElement('span')
				runtimeName.className = 'runtime'
				runtimeName.textContent = row.runtime
				framework.append(runtimeName)
				const value = document.createElement('span')
				value.className = 'value'
				value.textContent = `${row.display[metric.value]} req/s`
				name.append(framework, value)
				const lane = document.createElement('div')
				lane.className = 'lane'
				lane.setAttribute('aria-hidden', 'true')
				const ball = document.createElement('div')
				ball.className = 'ball'
				ball.style.setProperty(
					'--color',
					colors[rows.indexOf(row) % colors.length]
				)
				lane.append(ball)
				const logo = createLogo(row.framework)
				const runtime = createLogo(row.runtime)
				runtime.classList.add('runtime-badge')
				logo.append(runtime)
				item.append(logo, name, lane)
				field.append(item)
				return { ball, value: row.throughput[metric.value] }
			})
			selection.textContent = `Choose frameworks (${included.size}/${rows.length})`
			status.textContent = selected.length
				? `${selected.length} results · ${metric.value} · Speed is proportional to req/s. Position changes after each bounce.`
				: 'No frameworks selected. Choose frameworks or a runtime preset to show results.'
			measure()
			syncMotion()
		}
		metric.addEventListener('change', () => {
			render(true)
			saveOptions()
		})
		for (const control of [memorySort, memoryView])
			control.addEventListener('change', () => {
				renderMemory(rows.filter((row) => included.has(row)))
				saveOptions()
			})
		preset.addEventListener('change', () => {
			if (preset.value === 'custom') return
			included = new Set(
				visualOptions(rows, { selection: preset.value }).included
			)
			for (const { row, checkbox } of choices)
				checkbox.checked = included.has(row)
			render()
			saveOptions()
		})
		speed.addEventListener('input', () => {
			syncMotion()
			rate = Number(speed.value)
			speedValue.value = `${rate}×`
			saveOptions()
		})
		pause.addEventListener('click', () => {
			paused = !paused
			syncMotion()
			saveOptions()
		})
		restart.addEventListener('click', () => render(true))
		document.addEventListener('visibilitychange', syncMotion)
		reduceMotion.addEventListener('change', () => {
			if (reduceMotion.matches) paused = true
			syncMotion()
		})
		new ResizeObserver(measure).observe(field)
		new ResizeObserver(measureMemoryLegend).observe(memoryScroll)
		memoryScroll.addEventListener('scroll', measureMemoryLegend, {
			passive: true
		})
		for (const control of [
			metric,
			preset,
			speed,
			pause,
			restart,
			memorySort,
			memoryView
		])
			control.disabled = false
		render(true)
	} catch (error) {
		status.textContent = `${error.message}. Serve the repository over HTTP and check results/results.md, then reload.`
		field.hidden = true
	}
}

if (typeof document !== 'undefined') mount()
