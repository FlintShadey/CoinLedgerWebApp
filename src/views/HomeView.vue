<script setup lang="ts">
import { ref } from 'vue'

const coinData = ref([
  { name: 'Bitcoin', symbol: 'BTC', price: 67500, change: 2.5 },
  { name: 'Ethereum', symbol: 'ETH', price: 3200, change: -1.2 },
  { name: 'Cardano', symbol: 'ADA', price: 0.65, change: 5.8 },
  { name: 'Solana', symbol: 'SOL', price: 145, change: 3.4 },
])

const portfolio = ref([
  { coin: 'Bitcoin', amount: 0.5, value: 33750 },
  { coin: 'Ethereum', amount: 2.0, value: 6400 },
  { coin: 'Cardano', amount: 1000, value: 650 },
])

const totalValue = portfolio.value.reduce((sum, item) => sum + item.value, 0)
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="text-h4 primary--text">
            <v-icon left color="primary">mdi-currency-btc</v-icon>
            Welcome to CoinLedger
          </v-card-title>
          <v-card-subtitle> Track your cryptocurrency portfolio with ease </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-chart-line</v-icon>
            Market Overview
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="coin in coinData" :key="coin.symbol" class="px-0">
                <template v-slot:prepend>
                  <v-avatar color="primary">
                    {{ coin.symbol.charAt(0) }}
                  </v-avatar>
                </template>
                <v-list-item-title>{{ coin.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ coin.symbol }}</v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-right">
                    <div>${{ coin.price.toLocaleString() }}</div>
                    <v-chip :color="coin.change > 0 ? 'green' : 'red'" size="small" variant="flat">
                      {{ coin.change > 0 ? '+' : '' }}{{ coin.change }}%
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-wallet</v-icon>
            My Portfolio
          </v-card-title>
          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-4">
              Total Portfolio Value: ${{ totalValue.toLocaleString() }}
            </v-alert>
            <v-list>
              <v-list-item v-for="item in portfolio" :key="item.coin" class="px-0">
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-currency-usd</v-icon>
                </template>
                <v-list-item-title>{{ item.coin }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.amount }} coins</v-list-item-subtitle>
                <template v-slot:append>
                  <v-chip color="primary" variant="flat">
                    ${{ item.value.toLocaleString() }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="flat" block>
              <v-icon left>mdi-plus</v-icon>
              Add Transaction
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-clock-outline</v-icon>
            Recent Transactions
          </v-card-title>
          <v-card-text>
            <v-alert type="info" variant="outlined">
              No transactions yet. Start by adding your first transaction!
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
