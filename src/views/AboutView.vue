<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto">
          <v-card-title class="text-h4 primary--text text-center">
            <v-icon left color="primary">mdi-information</v-icon>
            About CoinLedger WebApp
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-alert type="info" variant="tonal" class="mb-4">
                  A modern cryptocurrency portfolio tracking application
                </v-alert>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title>
                    <v-icon left color="primary">mdi-feature-search</v-icon>
                    Features
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item prepend-icon="mdi-file-document-edit-outline">
                        GALA Rewards to CSV Converter
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-pickaxe">
                        FLUX Mining to CSV Converter
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-file-upload-outline">
                        POKT Rewards to CSV Converter
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-cellphone-link">
                        Responsive Design
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-theme-light-dark">
                        Dark Mode UI
                      </v-list-item>
                      <v-list-item prepend-icon="mdi-download-box-outline">
                        Progressive Web App (PWA)
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined">
                  <v-card-title>
                    <v-icon left color="primary">mdi-code-tags</v-icon>
                    Technology Stack
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item prepend-icon="mdi-vuejs"> Vue.js 3 </v-list-item>
                      <v-list-item prepend-icon="mdi-vuetify"> Vuetify 3 </v-list-item>
                      <v-list-item prepend-icon="mdi-typescript"> TypeScript </v-list-item>
                      <v-list-item prepend-icon="mdi-lightning-bolt"> Vite </v-list-item>
                      <v-list-item prepend-icon="mdi-github"> GitHub Pages </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-4">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title>
                    <v-icon left color="primary">mdi-information-outline</v-icon>
                    Project Information
                  </v-card-title>
                  <v-card-text>
                    <p>
                      CoinLedger WebApp is a modern, responsive web application designed to help
                      cryptocurrency enthusiasts track their digital asset portfolios. Built with
                      the latest web technologies, it provides a clean and intuitive interface for
                      managing your crypto investments.
                    </p>
                    <p class="mt-3">
                      This application is built as a Progressive Web App (PWA), which means it can
                      be installed on your device and work offline. Your data is stored locally for
                      privacy and security.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              href="https://github.com/flintshadey/CoinLedgerWebApp"
              target="_blank"
            >
              <v-icon left>mdi-github</v-icon>
              View on GitHub
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
