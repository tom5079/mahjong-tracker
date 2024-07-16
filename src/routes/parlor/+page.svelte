<script lang="ts">
	const parlors = [
		{
			name: 'Berkeley Mahjong Club',
			owner: 'Tookoo',
			location: 'Berkeley, CA',
			members: 12,
			recentGame: '2024-07-15',
			tags: 'school, in person, standard ruleset, weekends only'
		},
		{
			name: 'Pacific Mahjong League',
			owner: 'konata_akemi',
			location: 'Fremont, CA',
			members: 623,
			recentGame: '2024-07-15',
			tags: 'in person, standard ruleset, 4-players, special ruleset'
		},
		{
			name: 'LAPOM',
			owner: 'omasakun.',
			location: 'Gardena, CA',
			members: 927,
			tags: 'in person, tournaments, pro'
		}
	]
</script>

<main>
	<section class="p-8">
		<h1 class="text-2xl font-medium">Parlors</h1>
		<div class="flex flex-col divide-y">
			{#each parlors as parlor}
				<div class="flex flex-row space-x-4 py-4">
					<div class="flex flex-grow flex-col space-y-2">
						<h2 class="text-xl font-semibold">{parlor.name}</h2>
						<p class="text-sm">{parlor.location}</p>
						<p class="text-sm">Owner: {parlor.owner}</p>
						<p class="text-sm">
							{parlor.members == undefined
								? 'Unknown number of members'
								: parlor.members == 1
									? '1 member'
									: `${parlor.members} members`}
						</p>
						<p class="text-sm">
							{parlor.recentGame == undefined
								? 'No recent games'
								: `Last game: ${parlor.recentGame}`}
						</p>
						<p class="text-sm">{parlor.tags == undefined ? 'No tags' : parlor.tags}</p>
					</div>
					<span class="material-symbols-rounded my-auto">chevron_right</span>
				</div>
			{/each}
		</div>
	</section>
</main>
