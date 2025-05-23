<script setup lang="ts">
import { ref } from 'vue'
import GalaGamesLogo from '@/assets/GalaGames.png'
import FluxImage from '@/assets/FluxImage.png'
import PoktImage from '@/assets/poktImage.jpg'

const galaDialog = ref(false)
const galaText = ref('')
const fluxDialog = ref(false)
const fluxText = ref('')
const poktDialog = ref(false)
const poktFile = ref<File | null>(null)
const isProcessing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const openGalaDialog = () => {
  galaDialog.value = true
  galaText.value = ''
  successMessage.value = ''
  errorMessage.value = ''
}

const openFluxDialog = () => {
  fluxDialog.value = true
  fluxText.value = ''
  successMessage.value = ''
  errorMessage.value = ''
}

const openPoktDialog = () => {
  poktDialog.value = true
  poktFile.value = null
  successMessage.value = ''
  errorMessage.value = ''
}

const parseGalaRewards = (text: string) => {
  // Pattern to capture GALA rewards
  const pattern = /You received ([\d,\.]+) GALA/g
  const matches = []
  let match

  while ((match = pattern.exec(text)) !== null) {
    matches.push(match[1].replace(/,/g, '')) // Remove commas from amount
  }

  return matches
}

const parseFluxMining = (text: string) => {
  // Pattern to capture FLUX mining data
  const pattern =
    /Mined (\w{3} \d{1,2}, \d{4} \d{1,2}:\d{2}:\d{2} [APM]{2}).+?CONFIRMATIONS (\d+\.\d+)/gs
  const matches = []
  let match

  while ((match = pattern.exec(text)) !== null) {
    const dateTimeStr = match[1]
    const amount = match[2]

    try {
      // Parse the datetime string
      const parsedDate = new Date(dateTimeStr)
      if (!isNaN(parsedDate.getTime())) {
        matches.push({
          dateTime: parsedDate,
          amount: amount,
        })
      }
    } catch (error) {
      console.warn('Failed to parse date:', dateTimeStr)
    }
  }

  return matches
}

const generateCSV = (amounts: string[], assetType: 'GALA' | 'FLUX' = 'GALA') => {
  // CSV headers
  const headers = [
    'Date (UTC)',
    'Platform (Optional)',
    'Asset Sent',
    'Amount Sent',
    'Asset Received',
    'Amount Received',
    'Fee Currency (Optional)',
    'Fee Amount (Optional)',
    'Type',
    'Description (Optional)',
    'TxHash (Optional)',
  ]

  const today = new Date()
  const rows = [headers.join(',')]

  amounts.forEach((amount, index) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (index + 1))
    const formattedDate = date.toLocaleDateString('en-US')

    const row = [
      formattedDate,
      '', // Platform
      '', // Asset Sent
      '', // Amount Sent
      assetType, // Asset Received
      amount, // Amount Received
      '', // Fee Currency
      '', // Fee Amount
      assetType === 'FLUX' ? 'Mining' : 'Mining Income', // Type
      '', // Description
      '', // TxHash
    ]
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

const generateFluxCSV = (fluxEntries: Array<{ dateTime: Date; amount: string }>) => {
  // CSV headers
  const headers = [
    'Date (UTC)',
    'Platform (Optional)',
    'Asset Sent',
    'Amount Sent',
    'Asset Received',
    'Amount Received',
    'Fee Currency (Optional)',
    'Fee Amount (Optional)',
    'Type',
    'Description (Optional)',
    'TxHash (Optional)',
  ]

  const rows = [headers.join(',')]

  fluxEntries.forEach((entry) => {
    const formattedDate =
      entry.dateTime.toLocaleDateString('en-US') + ' ' + entry.dateTime.toLocaleTimeString('en-US')

    const row = [
      formattedDate,
      '', // Platform
      '', // Asset Sent
      '', // Amount Sent
      'FLUX', // Asset Received
      '4.6875', // Fixed amount as per Python script
      '', // Fee Currency
      '', // Fee Amount
      'Mining', // Type
      '', // Description
      '', // TxHash
    ]
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

const downloadCSV = (csvContent: string, filename: string = 'data.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const convertToCoinledger = async () => {
  if (!galaText.value.trim()) {
    errorMessage.value = 'Please paste your GALA data first.'
    return
  }

  try {
    isProcessing.value = true
    errorMessage.value = ''

    const amounts = parseGalaRewards(galaText.value)

    if (amounts.length === 0) {
      errorMessage.value = 'No GALA rewards found in the provided text. Please check your data.'
      return
    }

    const csvContent = generateCSV(amounts, 'GALA')
    downloadCSV(csvContent, 'gala_rewards_data.csv')

    successMessage.value = `Successfully converted ${amounts.length} GALA reward entries to CSV format!`

    // Close dialog after a short delay
    setTimeout(() => {
      galaDialog.value = false
    }, 2000)
  } catch (error) {
    errorMessage.value = 'An error occurred while processing your data. Please try again.'
    console.error('Error processing GALA data:', error)
  } finally {
    isProcessing.value = false
  }
}

const convertFluxToCoinledger = async () => {
  if (!fluxText.value.trim()) {
    errorMessage.value = 'Please paste your FLUX mining data first.'
    return
  }

  try {
    isProcessing.value = true
    errorMessage.value = ''

    const fluxEntries = parseFluxMining(fluxText.value)

    if (fluxEntries.length === 0) {
      errorMessage.value = 'No FLUX mining data found in the provided text. Please check your data.'
      return
    }

    const csvContent = generateFluxCSV(fluxEntries)
    downloadCSV(csvContent, 'FLUX_output.csv')

    successMessage.value = `Successfully converted ${fluxEntries.length} FLUX mining entries to CSV format!`

    // Close dialog after a short delay
    setTimeout(() => {
      fluxDialog.value = false
    }, 2000)
  } catch (error) {
    errorMessage.value = 'An error occurred while processing your FLUX data. Please try again.'
    console.error('Error processing FLUX data:', error)
  } finally {
    isProcessing.value = false
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    poktFile.value = target.files[0]
  }
}

const parsePoktCSV = (csvText: string) => {
  const lines = csvText.split('\n')
  if (lines.length < 2) {
    throw new Error('Invalid CSV file format')
  }

  // Get headers and trim whitespace
  const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''))
  const results = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
    const row: any = {}

    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })

    // Only process rows with "Rewards Rollover" in the "Transaction Type" column
    if (row['Transaction Type'] === 'Rewards Rollover') {
      results.push(row)
    }
  }

  return results
}

const generatePoktCSV = (poktEntries: Array<any>) => {
  // CSV headers
  const headers = [
    'Date (UTC)',
    'Platform (Optional)',
    'Asset Sent',
    'Amount Sent',
    'Asset Received',
    'Amount Received',
    'Fee Currency (Optional)',
    'Fee Amount (Optional)',
    'Type',
    'Description (Optional)',
    'TxHash (Optional)',
  ]

  const rows = [headers.join(',')]

  poktEntries.forEach((entry) => {
    // Convert the date from YYYY-MM-DD HH:MM:SS to MM/DD/YYYY HH:MM:SS
    let formattedDate = entry.Date
    try {
      const dateObj = new Date(entry.Date)
      formattedDate =
        dateObj.toLocaleDateString('en-US') + ' ' + dateObj.toLocaleTimeString('en-US')
    } catch (error) {
      console.warn('Failed to parse date:', entry.Date)
    }

    const row = [
      formattedDate,
      '', // Platform
      '', // Asset Sent
      '', // Amount Sent
      'POKT', // Asset Received
      entry.Amount || '', // Amount Received
      '', // Fee Currency
      '', // Fee Amount
      'Income', // Type
      '', // Description
      '', // TxHash
    ]
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

const convertPoktToCoinledger = async () => {
  if (!poktFile.value) {
    errorMessage.value = 'Please upload a CSV file first.'
    return
  }

  try {
    isProcessing.value = true
    errorMessage.value = ''

    const fileText = await poktFile.value.text()
    const poktEntries = parsePoktCSV(fileText)

    if (poktEntries.length === 0) {
      errorMessage.value =
        'No "Rewards Rollover" entries found in the CSV file. Please check your data.'
      return
    }

    const csvContent = generatePoktCSV(poktEntries)
    downloadCSV(csvContent, 'POKT_output.csv')

    successMessage.value = `Successfully converted ${poktEntries.length} POKT reward entries to CSV format!`

    // Close dialog after a short delay
    setTimeout(() => {
      poktDialog.value = false
    }, 2000)
  } catch (error) {
    errorMessage.value = 'An error occurred while processing your POKT CSV file. Please try again.'
    console.error('Error processing POKT data:', error)
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <v-container fluid class="pa-2 pa-md-4">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="text-h4 primary--text text-center">
            Welcome to the CoinLedger Conversion Tool
          </v-card-title>
          <v-card-subtitle class="text-center"
            >Convert your cryptocurrency data to CoinLedger CSV format</v-card-subtitle
          >
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- GALA Converter Card -->
      <v-col cols="12" md="4">
        <v-card class="h-100">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-file-document-edit</v-icon>
            GALA Rewards Converter
          </v-card-title>
          <v-card-text>
            <div class="text-center mb-4">
              <img
                :src="GalaGamesLogo"
                alt="Gala Games Logo"
                style="max-width: 150px; height: auto"
              />
            </div>

            <p class="text-body-1 mb-4">
              Convert GALA rewards text data to CoinLedger CSV format. Detects "You received X GALA"
              entries.
            </p>

            <v-btn
              color="primary"
              size="large"
              @click="openGalaDialog"
              prepend-icon="mdi-upload"
              block
            >
              Convert GALA Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- FLUX Converter Card -->
      <v-col cols="12" md="4">
        <v-card class="h-100">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-pickaxe</v-icon>
            FLUX Mining Converter
          </v-card-title>
          <v-card-text>
            <div class="text-center mb-4">
              <img :src="FluxImage" alt="Flux Logo" style="max-width: 150px; height: auto" />
            </div>

            <p class="text-body-1 mb-4">
              Convert FLUX mining text data to CoinLedger CSV format. Detects mining confirmations
              with timestamps.
            </p>

            <v-btn
              color="primary"
              size="large"
              @click="openFluxDialog"
              prepend-icon="mdi-upload"
              block
            >
              Convert FLUX Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- POKT Converter Card -->
      <v-col cols="12" md="4">
        <v-card class="h-100">
          <v-card-title class="text-h5">
            <v-icon class="mr-2">mdi-file-upload</v-icon>
            POKT Rewards Converter
          </v-card-title>
          <v-card-text>
            <div class="text-center mb-4">
              <img :src="PoktImage" alt="POKT Logo" style="max-width: 150px; height: auto" />
            </div>

            <p class="text-body-1 mb-4">
              Convert POKT rewards CSV file to CoinLedger format. Upload your CSV file with "Rewards
              Rollover" entries.
            </p>

            <v-btn
              color="primary"
              size="large"
              @click="openPoktDialog"
              prepend-icon="mdi-upload"
              block
            >
              Convert POKT Data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- GALA Conversion Dialog -->
    <v-dialog v-model="galaDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 primary--text">
          <v-icon class="mr-2">mdi-file-chart</v-icon>
          GALA Rewards Converter
        </v-card-title>

        <v-card-text>
          <div class="text-center mb-4">
            <img
              :src="GalaGamesLogo"
              alt="Gala Games Logo"
              style="max-width: 200px; height: auto"
            />
          </div>

          <v-textarea
            v-model="galaText"
            label="Paste your GALA rewards text data here"
            placeholder="You received 123.45 GALA&#10;You received 67.89 GALA&#10;..."
            rows="10"
            variant="outlined"
            :disabled="isProcessing"
          ></v-textarea>

          <v-alert v-if="successMessage" type="success" class="mt-3">
            {{ successMessage }}
          </v-alert>

          <v-alert v-if="errorMessage" type="error" class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="galaDialog = false" :disabled="isProcessing">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="convertToCoinledger"
            :loading="isProcessing"
            :disabled="!galaText.trim()"
          >
            Convert to CoinLedger Format
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FLUX Conversion Dialog -->
    <v-dialog v-model="fluxDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 secondary--text">
          <v-icon class="mr-2">mdi-pickaxe</v-icon>
          FLUX Mining Converter
        </v-card-title>

        <v-card-text>
          <div class="text-center mb-4">
            <img :src="FluxImage" alt="Flux Logo" style="max-width: 200px; height: auto" />
          </div>

          <v-textarea
            v-model="fluxText"
            label="Paste your FLUX mining text data here"
            placeholder="Mined Jan 15, 2025 10:30:45 AM ... CONFIRMATIONS 4.6875&#10;Mined Jan 14, 2025 08:22:15 PM ... CONFIRMATIONS 4.6875&#10;..."
            rows="10"
            variant="outlined"
            :disabled="isProcessing"
          ></v-textarea>

          <v-alert v-if="successMessage" type="success" class="mt-3">
            {{ successMessage }}
          </v-alert>

          <v-alert v-if="errorMessage" type="error" class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="fluxDialog = false" :disabled="isProcessing">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="convertFluxToCoinledger"
            :loading="isProcessing"
            :disabled="!fluxText.trim()"
          >
            Convert to CoinLedger Format
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- POKT Conversion Dialog -->
    <v-dialog v-model="poktDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h5 success--text">
          <v-icon class="mr-2">mdi-file-upload</v-icon>
          POKT Rewards Converter
        </v-card-title>

        <v-card-text>
          <div class="text-center mb-4">
            <img :src="PoktImage" alt="POKT Logo" style="max-width: 200px; height: auto" />
          </div>

          <p class="text-body-1 mb-4">
            Upload your POKT CSV file containing "Rewards Rollover" entries. The tool will process
            only those entries and convert them to CoinLedger format.
          </p>

          <v-file-input
            label="Upload POKT CSV file"
            accept=".csv"
            prepend-icon="mdi-file-document"
            @change="handleFileUpload"
            :disabled="isProcessing"
            variant="outlined"
          ></v-file-input>

          <v-alert v-if="successMessage" type="success" class="mt-3">
            {{ successMessage }}
          </v-alert>

          <v-alert v-if="errorMessage" type="error" class="mt-3">
            {{ errorMessage }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="poktDialog = false" :disabled="isProcessing">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="convertPoktToCoinledger"
            :loading="isProcessing"
            :disabled="!poktFile"
          >
            Convert to CoinLedger Format
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
/* Ensure full width utilization */
.v-container--fluid {
  max-width: none !important;
  width: 100% !important;
}

/* Remove any default margins on cards and rows */
.v-row {
  margin: 0 !important;
}

.v-col {
  padding: 8px !important;
}

/* Ensure cards stretch to full height */
.v-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
