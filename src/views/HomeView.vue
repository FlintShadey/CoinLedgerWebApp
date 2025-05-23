<script setup lang="ts">
import { ref } from 'vue'
import GalaGamesLogo from '@/assets/GalaGames.png'

const galaDialog = ref(false)
const galaText = ref('')
const isProcessing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const openGalaDialog = () => {
  galaDialog.value = true
  galaText.value = ''
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

const generateCSV = (amounts: string[]) => {
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
      'GALA', // Asset Received
      amount, // Amount Received
      '', // Fee Currency
      '', // Fee Amount
      'Mining Income', // Type
      '', // Description
      '', // TxHash
    ]
    rows.push(row.join(','))
  })

  return rows.join('\n')
}

const downloadCSV = (csvContent: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'gala_rewards_data.csv')
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

    const csvContent = generateCSV(amounts)
    downloadCSV(csvContent)

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
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="text-h4 primary--text">
            Welcome to the CoinLedger Conversion Tool
          </v-card-title>
            <v-card-subtitle class="text-center">Convert your GALA reward data to CoinLedger CSV format</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
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
              Paste your GALA rewards text data below and convert it to a CSV format compatible with
              CoinLedger. The tool will automatically detect "You received X GALA" entries and
              create properly formatted records.
            </p>

            <v-btn color="primary" size="large" @click="openGalaDialog" prepend-icon="mdi-upload">
              Convert GALA Data
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
  </v-container>
</template>
