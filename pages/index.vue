<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-toolbar-title>Gorilla Species</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
          <v-row
              class="py-8"
              justify="center"
              >
                <v-col
                  cols="12"
                >
                  <v-card >
                    <v-data-table
                    :headers="headers"
                    :options.sync="paginationOptions"
                    :server-items-length="serverSidePlaceholer"
                    :footer-props="footerProps"
                    :items="gorillas"
                    :items-per-page="5"
                    :loading="loading"
                    class="elevation-1"
                    >
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-icon
                          small
                          @click="removeGorilla(item)"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      <template v-slot:[`item.imageUrl`]="{ item }">
                        <div class="p-2">
                          <v-img :src="item.imageUrl" :alt="item.name" height="100px" width="100px" contain></v-img>
                        </div>
                      </template>
                      <template v-slot:[`footer.page-text`]>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
            </v-row>
          <v-row>
            <v-col
             class="text-right">
              <v-dialog
              v-model="dialog"
              width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                color="primary"
                  v-bind="attrs"
                  v-on="on"
                >
                  Add Gorilla
                </v-btn>
              </template>

              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Add New Gorilla Type
                </v-card-title>
                <v-container>
                    <v-row
                    class='px-4'>
                      <v-col
                      cols="12"
                      >
                        <v-text-field
                        v-model="gorillaForm.name"
                        label="Name"
                        ></v-text-field>
                        <v-textarea
                        v-model="gorillaForm.description"
                        label="Description"
                        rows="2"
                        ></v-textarea>
                        <v-text-field
                        v-model="gorillaForm.imageUrl"
                        label="Image URL"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="addGorilla"
                    type="submit"
                  >
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
              </v-dialog>
              
            </v-col>
          </v-row>
        </v-container>
    </v-main>
  </v-app>
</template>
<script>
export default {
  watch: {
      paginationOptions: {
        handler () {
          this.loadGorillas();
      },
      deep: true
      }
    },
    data(){ 
      return { 
        headers: [
          {
            text: 'Image',
            value: 'imageUrl',
            sortable: false
          },
          {
            text: 'Name',
            value: 'name',
            width: '150px'
          },
          {
            text: 'Description',
            value: 'description',
            sortable: false
          },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
        footerProps: {
          'items-per-page-options': [3, 5, 10],
        },
        gorillaForm: {
          name: '',
          description: '',
          imageUrl: ''
        },
        paginationOptions: {}
      };
    },
    computed:{
      gorillas(){
        return this.$store.getters.gorillas;
      },
      hasNextPage(){
        return this.$store.getters.hasNextPage;
      },
      dialog: {
        get () {
          return this.$store.getters.dialog;
        },
        set (value) {
          this.$store.commit('setDialog', value);
        }
      },
      loading: {
        get () {
          return this.$store.getters.loading;
        },
        set (value) {
          this.$store.commit('setLoading', value);
        }
      },
      serverSidePlaceholer() {
        const { page, itemsPerPage } = this.paginationOptions;
        return this.hasNextPage ? (page * itemsPerPage) + 1 :  ((page - 1) * itemsPerPage) + this.gorillas.length;
      }
    },
    watch: {
      paginationOptions: {
        handler () {
          this.loadGorillas();
      },
      deep: true
      }
    },
    methods: { 
      async resetPagination(){
        this.$store.commit("setCurrentPage", 1);
        this.paginationOptions.page = 1;
        await this.loadGorillas();
      },
  async addGorilla() {
    this.loading = true;
    this.dialog = false;
    await this.$store.dispatch('addGorilla', this.gorillaForm);
    this.resetPagination();
    this.gorillaForm = {
      name: '',
      description: '',
      imageUrl: ''
    };
  },
      async removeGorilla(gorilla){
        this.loading = true;
        await this.$store.dispatch('removeGorilla', gorilla.id);
        this.resetPagination();
      },
      async loadGorillas() {
        const { sortBy = [], sortDesc = [], page, itemsPerPage } = this.paginationOptions;
        this.loading = true;
        await this.$store.dispatch('loadGorillas', { sortBy: sortBy[0], desc: sortDesc[0], page, itemsPerPage});
        this.loading = false;
      }
    },
    created(){
      this.loadGorillas();
    }
  }
</script>

