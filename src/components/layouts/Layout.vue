<template>
  <div class="layout-default">
    <!--    <el-header height="auto">-->
    <!--      <el-row>-->
    <!--        <div class="right-menu">-->
    <!--          <el-tooltip content="Language" effect="dark" placement="bottom">-->
    <!--            <el-dropdown trigger="click" @command="handleLanguageCommand">-->
    <!--              <el-button id="btn_lang_toggle" size="medium" circle>-->
    <!--                <v-icon-awesome name="globe-asia"></v-icon-awesome>-->
    <!--              </el-button>-->
    <!--              <el-dropdown-menu>-->
    <!--                <el-dropdown-item id="option_english" command="en_us">English</el-dropdown-item>-->
    <!--                <el-dropdown-item id="option_traditional_chinese" command="zh_tw">繁體中文</el-dropdown-item>-->
    <!--                <el-dropdown-item id="option_simplified_chinese" command="zh_cn">日本語</el-dropdown-item>-->
    <!--              </el-dropdown-menu>-->
    <!--            </el-dropdown>-->
    <!--          </el-tooltip>-->
    <!--          <el-dropdown @command="handleCommand">-->
    <!--            <el-button type="medium">-->
    <!--              {{ username }}<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
    <!--            </el-button>-->
    <!--            <el-dropdown-menu slot="dropdown">-->
    <!--              <el-dropdown-item command="logout">-->
    <!--                <v-icon-awesome name="sign-out-alt"></v-icon-awesome>-->
    <!--                Logout-->
    <!--              </el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--          </el-dropdown>-->
    <!--        </div>-->
    <!--      </el-row>-->
    <!--    </el-header>-->
    <nav>
      <v-toolbar dense elevation="2">
        <v-spacer></v-spacer>
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs"
                   v-on="on"
                   icon>
              <v-icon>account_circle</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              {{ username }}
            </v-list-item>
            <v-list-item>
              {{ email }}
            </v-list-item>
            <v-list-item>
              <v-btn @click="logout">
                <span>Logout</span>
                <v-icon>logout</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
          <!--          <v-btn v-bind="attrs"-->
          <!--                 v-on="on"-->
          <!--                 icon>-->
          <!--            <v-icon>notifications</v-icon>-->
          <!--          </v-btn>-->

        </v-menu>
        <!--      <v-menu offset-y style="position: relative; z-index: 3">-->
        <!--        <template v-slot:activator="{ on }">-->
        <!--          <v-btn-->
        <!--              dark-->
        <!--              icon-->
        <!--              v-on="on"-->
        <!--          >-->
        <!--            <v-icon color="primary">notifications</v-icon>-->
        <!--          </v-btn>-->
        <!--        </template>-->
        <!--        <v-card>-->
        <!--          <v-list dense>-->
        <!--            <v-subheader>Notifications</v-subheader>-->
        <!--            <v-divider></v-divider>-->
        <!--            <v-list-tile-->
        <!--                v-for="notification in notifications"-->
        <!--                :key="`notification-key-${notification.id}`"-->
        <!--            >-->
        <!--              <v-list-tile-title>-->
        <!--                {{ notification.title }}-->
        <!--              </v-list-tile-title>-->
        <!--            </v-list-tile>-->
        <!--          </v-list>-->
        <!--        </v-card>-->
        <!--      </v-menu>-->
      </v-toolbar>
      <v-navigation-drawer app
                           absolute
                           bottom
                           temporary
                           class="white"
                           v-model="is_side_navigation_drawer_show"
                           overlay-opacity="0"
                           width="420">
        <v-list
            dense
            nav
        >
          <v-list-item
              v-for="item in side_navigation_drawer_items"
              :key="item.title"
              link
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.value }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>
    <el-main>

      <main-page style="position: relative; z-index: 3" @markerClicked="onClickMarker"/>
    </el-main>
  </div>
</template>

<script>
import {getUserName, getEmail} from "@/utils/auth";
import MainPage from "@/components/pages/MainPage";

export default {
  name: "Layout",
  components: {MainPage},
  data() {
    return {
      notifications: [
        {id: 1, title: 'Click Me'},
        {id: 2, title: 'Click Me'},
        {id: 3, title: 'Click Me'},
        {id: 4, title: 'Click Me 2'}
      ],
      location: {
        address: ''
      },
      is_side_navigation_drawer_show: false,
      side_navigation_drawer_items: [
        {title: 'Address', icon: 'mdi-map-marker', value: ''},
        {title: 'Owner', icon: 'mdi-account', value: ''}
        // {title: 'Photos', icon: 'mdi-image'},
        // {title: 'About', icon: 'mdi-help-box'},
      ],
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
    handleCommand(command) {
      switch (command) {
        case  'logout': {
          this.$store.dispatch('user/logout')
        }
      }
    },
    handleLanguageCommand(locale) {
      console.log(locale)
    },
    onClickMarker(location) {
      console.log(location)
      this.is_side_navigation_drawer_show = true
      this.location.address = location.address
      this.side_navigation_drawer_items.forEach(item => {
        if (item.title === 'Address') {
          item.value = location.address
        }
        if (item.title === 'Owner') {
          item.value = location.ownerName
        }
      })
    }
  },
  computed: {
    username() {
      return getUserName()
    },
    email() {
      return getEmail()
    }
  }
}
</script>

<style scoped>
.el-header {
  background-color: slategray;
  color: black;
  text-align: left;

}


.right-menu {
  float: right;
}
</style>