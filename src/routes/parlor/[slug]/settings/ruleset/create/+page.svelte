<main class="mx-auto max-w-2xl p-4">
	<section>
		<h1 class="text-2xl font-bold">Create new ruleset</h1>
	</section>
	<section>
		<form>
			<div class="grid gap-6 py-4">
				<div>
					<label for="name" class="mb-2 block text-sm font-medium text-gray-900">Name</label>
					<input
						type="text"
						id="name"
						name="name"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 p-2">
					<legend class="mb-2 block text-sm font-medium text-gray-900">Type</legend>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="four-players"
								name="player"
								value="four"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="four-players">4 Players</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="three-players"
								name="player"
								value="three"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="three-players">3 Players</label
							>
						</div>
					</div>
					<div class="flex flex-row space-x-2">
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="tonpu"
								name="length"
								value="tonpu"
								checked
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="tonpu">East only</label
							>
						</div>
						<div class="flex-1 rounded border">
							<input
								class="peer hidden h-0 w-0"
								type="radio"
								id="hanchan"
								name="length"
								value="hanchan"
							/>
							<label
								class="flex h-full cursor-pointer items-center justify-center py-2.5 text-center text-sm peer-checked:bg-blue-500 peer-checked:text-white"
								for="hanchan">Hanchan</label
							>
						</div>
					</div>
				</fieldset>
				<div>
					<label for="start" class="mb-2 block text-sm font-medium text-gray-900"
						>Starting Score</label
					>
					<input
						type="number"
						id="start"
						name="start"
						value="25000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="return" class="mb-2 block text-sm font-medium text-gray-900"
						>Return Score</label
					>
					<input
						type="number"
						id="return"
						name="return"
						value="30000"
						step="1000"
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<fieldset class="space-y-2 rounded border border-solid border-gray-300 px-2 pb-2">
					<legend class="block text-sm font-medium text-gray-900">Uma</legend>
					<div class="flex flex-row items-center space-x-2">
						<input
							type="number"
							name="uma_second"
							value="5"
							min="0"
							class="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
						<span class="text-sm text-gray-900">-</span>
						<input
							type="number"
							name="uma_first"
							value="10"
							min="0"
							class="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
					<div class="flex flex-row items-center space-x-4">
						<p class="text-sm">Binta</p>
						<input
							type="number"
							name="binta"
							value="0"
							min="0"
							class="flex-grow rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
						/>
					</div>
				</fieldset>
			</div>
		</form>
	</section>
</main>
