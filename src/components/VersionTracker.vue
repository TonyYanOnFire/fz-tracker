<script setup>
import {CirclePlusFilled, Document, Flag} from '@element-plus/icons-vue'
import {trackerVersion} from '@/config.js'
import dayjs from 'dayjs'

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
    listenToStorageChanges: true,
  },
)

for (const prop of ['name', 'author', 'scriptVersion']) {
  if (gameData.value[prop] !== gameInfo[prop]) {
    gameData.value[prop] = gameInfo[prop]
  }
}

const checked = computed({
  get () {
    return gameData.value.records.some(record => record.version === gameInfo.version)
  },
  set (newVal) {
    if (newVal)
      addRecord(gameInfo)
    else
      removeRecord(gameInfo)
  },
})

const lastRecord = computed(() => {
  const records = gameData.value.records
  if (records.length > 0) {
    return records[records.length - 1]
  }
  return null
})

const lastRecordTime = computed(() => {
  if (lastRecord.value) {
    return lastRecord.value.time
  }
  return null
})

const timeAgo = useTimeAgo(lastRecordTime)

const lastPlayedText = computed(() => {
  if (!lastRecord.value) return ''
  const lastRecordVersion = lastRecord.value.version
  if (lastRecordVersion === gameInfo.version) {
    return 'Finished '
  } else {
    return `Finished [${lastRecordVersion}] `
  }
})

const removeFlagConfirmVisible = ref(false)

function handleFlagClick () {
  if (checked.value) {
    removeFlagConfirmVisible.value = true
  } else {
    checked.value = true
  }
}

const form = reactive({
  version: '',
  date: '',
})

const rules = reactive({
  version: [
    {
      required: true,
      message: 'Please input version',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 30,
      message: 'Length should be 1 to 30',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (gameData.value.records.some(record => record.version === value)) {
          callback(new Error(`[${value}] already recorded`))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  date: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
})

const formRef = ref(null)
const popoverVisible = ref(false)

const onSubmit = () => {
  formRef.value.validate()
    .then(() => {
      addRecord({
        version: form.version,
        time: form.date.getTime(),
      })
      popoverVisible.value = false
      form.version = ''
      form.date = ''
    })
    .catch(() => {
    })
}

const popoverCommonProps = {
  effect: 'light',
  teleported: false,
  placement: 'bottom',
}

function addRecord ({version, time}) {
  time = time || Date.now()
  gameData.value.records.push({
    version,
    time,
  })
  gameData.value.records.sort((a, b) => a.time - b.time)
}

function removeRecord ({version}) {
  gameData.value.records = gameData.value.records.filter(record => record.version !== version)
}

function formatTime (time) {
  if (dayjs(time).hour() === 0 && dayjs(time).minute() === 0 && dayjs(time).second() === 0) {
    return dayjs(time).format('YYYY-MM-DD')
  } else {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  }
}
</script>

<template>
  <span>
    <el-popconfirm
      :visible="removeFlagConfirmVisible"
      v-bind="popoverCommonProps"
      width="350"
      confirm-button-text="OK"
      cancel-button-text="Cancel"
      title="Remove flag and delete corresponding record?"
      @confirm="removeFlagConfirmVisible = checked = false"
      @cancel="removeFlagConfirmVisible = false">
      <template #reference>
        <span
          class="p-1 inline-block cursor-pointer v-sub"
          :class="checked ? 'text-#ec5555' : 'text-[rgb(147,152,160)]'">
          <el-icon
            :size="35"
            @click="handleFlagClick">
            <Flag />
          </el-icon>
        </span>
      </template>
    </el-popconfirm>
    <span
      v-if="lastPlayedText"
      class="text-2xl">
      {{ lastPlayedText }}
      <el-tooltip
        v-bind="popoverCommonProps"
        :content="formatTime(lastRecordTime)">
        <span>{{ timeAgo }}</span>
      </el-tooltip>
    </span>
    <el-popover
      v-bind="popoverCommonProps"
      :visible="popoverVisible"
      :width="350"
      trigger="click">
      <template #reference>
        <el-icon
          :size="20"
          class="v-middle ml-4 cursor-pointer text-white opacity-70 hover:opacity-100">
          <CirclePlusFilled
            @click="popoverVisible = true" />
        </el-icon>
      </template>
      <el-form
        ref="formRef"
        label-width="130px"
        :rules="rules"
        :model="form">
        <el-form-item
          label="Finished Version"
          prop="version">
          <el-input v-model="form.version" />
        </el-form-item>
        <el-form-item
          label="Finished Time"
          prop="date">
          <el-date-picker
            v-model="form.date"
            :teleported="false"
            data-popper-placement="bottom"
            type="date"
            placeholder="Pick a date"
            style="width: 100%" />
        </el-form-item>
        <el-form-item class="button-group">
          <el-button
            size="small"
            @click="popoverVisible = false">Cancel</el-button>
          <el-button
            size="small"
            type="primary"
            @click="onSubmit">Create</el-button>
        </el-form-item>
      </el-form>
    </el-popover>

    <el-popover
      v-bind="popoverCommonProps"
      :width="500"
      trigger="click">
      <template #reference>
        <el-icon
          :size="20"
          class="v-middle ml-4 cursor-pointer text-white opacity-70 hover:opacity-100">
          <Document @click="1" />
        </el-icon>
      </template>
      <el-table
        :data="gameData.records"
        :default-sort="{prop: 'time', order: 'descending'}">
        <el-table-column
          min-width="120"
          property="version"
          label="Version" />
        <el-table-column
          sortable
          min-width="150"
          property="time"
          label="Time">
          <template #default="{row}">
            {{ formatTime(row.time) }}
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="Operations">
          <template #default="{row}">
            <el-button
              size="small"
              type="danger"
              @click="removeRecord(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-popover>
  </span>
</template>

<style lang="scss" scoped>
.el-form-item.button-group :deep {
   .el-form-item__content {
    justify-content: flex-end;
  }
}
</style>