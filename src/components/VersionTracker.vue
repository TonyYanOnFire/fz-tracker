<script setup>
import {trackerVersion} from '@/config.js'

const gameInfo = inject('gameInfo')
const gameData = useLocalStorage(
	`${gameInfo.ID}-tracker`, 
	{
		name: gameInfo.name,
		author: gameInfo.author,
		records: [],
		trackerVersion,
	}, 
	{
		deep: true,
		listenToStorageChanges: true
	}
)

for (const prop of ['name', 'author']) {
	if (gameData.value[prop] !== gameInfo[prop]) {
		gameData.value[prop] = gameInfo[prop]
	}
}

const lastPlayed = computed(() => {
	const records = gameData.value.records
	if (records.length > 0) {
		return records[records.length - 1]
	}
	return null
})

const lastPlayedTime = computed(() => {
	if (lastPlayed.value) {
		return lastPlayed.value.time
	}
	return null
})

const timeAgo = useTimeAgo(lastPlayedTime)

const lastPlayedText = computed(() => {
	if (!lastPlayed.value) return ''
	const lastRecordVersion = lastPlayed.value.version
	if (lastRecordVersion === gameInfo.version) {
		return 'Finished '
	} else {
		return `Finished [${lastRecordVersion}] `
	}
})

const checked = computed({
	get () {
		return gameData.value.records.some(record => record.version === gameInfo.version)
	},
	set (newVal) {
		if (newVal) {
			gameData.value.records.push({ version: gameInfo.version, time: Date.now() })
		} else {
			gameData.value.records = gameData.value.records.filter(record => record.version !== gameInfo.version)
		}
	}
})

function handleCheckChange (event) {
	if (!event.target.checked) {
		const confirmed = window.confirm('Removing finished mark will delete the latest record. Are you sure?')
		if (!confirmed) {
			event.preventDefault()
			return
		}
	}
	checked.value = event.target.checked
}
</script>

<template>
  <span>
    <input
      v-model="checked"
      :title="checked ? 'Remove mark' : 'Mark as finished'"
      type="checkbox"
      style="height: 20px; width: 20px; cursor: pointer; margin-left: 10px;"
      @click="handleCheckChange">
    <span
      v-if="lastPlayedText"
      style="font-size: small;">
      {{ lastPlayedText }}<span :title="new Date(lastPlayedTime).toLocaleString()">{{ timeAgo }}</span>
    </span>
  </span>
</template>
