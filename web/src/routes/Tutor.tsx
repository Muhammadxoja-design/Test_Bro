import React from 'react'
import { aiTutor, listUniversities } from '../api'
import Page from '../components/Page'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'

export default function Tutor() {
	const [message, setMessage] = React.useState('')
	const [context, setContext] = React.useState<'SAT' | 'Admissions'>('SAT')
	const [loading, setLoading] = React.useState(false)
	const [history, setHistory] = React.useState<
		{ role: 'user' | 'assistant'; text: string }[]
	>([])
	const [disclaimer, setDisclaimer] = React.useState('')
	const [universityId, setUniversityId] = React.useState<string | undefined>(
		undefined,
	)
	const [universities, setUniversities] = React.useState<
		{ id: string; name: string }[]
	>([])

	React.useEffect(() => {
		listUniversities({ limit: 50 })
			.then(data =>
				setUniversities(data.map(u => ({ id: u.id, name: u.name }))),
			)
			.catch(() => {})
	}, [])

	const send = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!message.trim()) return
		setLoading(true)
		const current = message
		setHistory(prev => [...prev, { role: 'user', text: current }])
		setMessage('')

		try {
			const res = await aiTutor({
				message: current,
				context,
				university_id: universityId,
			})
			setHistory(prev => [...prev, { role: 'assistant', text: res.reply }])
			setDisclaimer(res.disclaimer)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page className='space-y-8'>
			<div className='space-y-2' data-animate='fade'>
				<p className='text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground'>
					AI tutor
				</p>
				<h1 className='text-4xl font-semibold'>Ask a focused question.</h1>
				<p className='text-muted-foreground'>
					Text-only guidance for SAT prep and admissions planning.
				</p>
			</div>

			<Card data-animate='card'>
				<CardHeader>
					<CardTitle>Chat</CardTitle>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='flex flex-col gap-3 text-sm'>
						{history.length === 0 ? (
							<div className='text-muted-foreground'>
								Ask a question to get started.
							</div>
						) : (
							history.map((item, idx) => (
								<div
									key={idx}
									className={`rounded-2xl border border-white/60 p-4 ${
										item.role === 'assistant' ? 'bg-muted/60' : 'bg-white/80'
									}`}
								>
									<div className='text-xs uppercase tracking-[0.2em] text-muted-foreground'>
										{item.role}
									</div>
									<div className='mt-2'>{item.text}</div>
								</div>
							))
						)}
					</div>

					<form className='space-y-3' onSubmit={send}>
						<div className='flex flex-wrap gap-3'>
							<Select
								value={context}
								onValueChange={value =>
									setContext(value as 'SAT' | 'Admissions')
								}
							>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Context' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='SAT'>SAT</SelectItem>
									<SelectItem value='Admissions'>Admissions</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={universityId ?? 'none'}
								onValueChange={value =>
									setUniversityId(value === 'none' ? undefined : value)
								}
							>
								<SelectTrigger className='w-[240px]'>
									<SelectValue placeholder='Attach a university (optional)' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>No university</SelectItem>
									{universities.map(uni => (
										<SelectItem key={uni.id} value={uni.id}>
											{uni.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Textarea
							value={message}
							onChange={e => setMessage(e.target.value)}
							placeholder='Ask a question...'
							required
						/>
						<Button disabled={loading}>
							{loading ? 'Thinking...' : 'Send'}
						</Button>
					</form>

					<p className='text-xs text-muted-foreground'>
						{disclaimer || 'AI guidance only.'}
					</p>
				</CardContent>
			</Card>
		</Page>
	)
}
