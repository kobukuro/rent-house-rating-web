<template>
  <div class="layout-default">
    <el-header height="auto">
      <el-row>
        <div class="right-menu">
          <el-tooltip content="Language" effect="dark" placement="bottom">
            <el-dropdown trigger="click" @command="handleLanguageCommand">
              <el-button id="btn_lang_toggle" size="medium" circle>
                <v-icon name="globe-asia"></v-icon>
              </el-button>
              <el-dropdown-menu>
                <el-dropdown-item id="option_english" command="en_us">English</el-dropdown-item>
                <el-dropdown-item id="option_traditional_chinese" command="zh_tw">繁體中文</el-dropdown-item>
                <el-dropdown-item id="option_simplified_chinese" command="zh_cn">日本語</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <el-dropdown @command="handleCommand">
            <el-button type="medium">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">
                <v-icon name="sign-out-alt"></v-icon>
                Logout
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <main-page/>
    </el-main>
  </div>
</template>

<script>
import {getUserName} from "@/utils/auth";
import MainPage from "@/components/pages/MainPage";

export default {
  name: "Layout",
  components: {MainPage},
  methods: {
    handleCommand(command) {
      switch (command) {
        case  'logout': {
          this.$store.dispatch('user/logout')
        }
      }
    },
    handleLanguageCommand(locale) {
      console.log(locale)
    }
  },
  computed: {
    username() {
      return getUserName()
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