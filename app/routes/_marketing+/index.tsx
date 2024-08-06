import { type MetaFunction } from '@remix-run/node'
import * as React from 'react'
import { Icon } from '#app/components/ui/icon.tsx'

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

export default function Index() {
	return (
		<main className="grid h-full place-items-center">
			<div>Remix Epic App</div>
			<div>
				<Icon name="pubkey-logo-white" className="h-32 w-96" />
				<Icon name="pubkey-icon" className="h-24 w-24" />
			</div>
		</main>
	)
}
