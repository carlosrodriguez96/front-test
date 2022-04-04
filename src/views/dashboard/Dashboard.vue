<template>
  <v-app>
    <v-app-bar color="primary" sticky app dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" app width="240" temporary>
      <v-list nav >
       <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          link
          active-class="primary white--text"
        >        

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    drawer: false,
    group: null,
    items: [
      { title: "Create Bill", to: "/" },
      { title: "List Bills" , to: "/list" },
    ],
  }),

  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>