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
                           width="500">
        <v-list
            dense
            nav>
          <v-list-item
              v-for="item in side_navigation_drawer_items"
              :key="item.title"
              link>
            <v-list-item-icon >
              <v-icon class="list-icon">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="list-value">
              {{ item.value }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div class="rating-container">
          <div class="graph">
            <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
          </div>
          <div class="beside-graph">
            <div class="star-rating">
              <star-rating v-bind:star-size="30" v-model="location.rating_average"
                           :read-only="true"
                           :show-rating="false"></star-rating>
            </div>
            <div class="number-rating">
                <p>{{ location.rating_average }}</p>
            </div>
          </div>


        </div>
        <v-list>
          <v-list-item v-for="(item, index) in location.ratings" :key="index">
            <v-card>
              <p>{{ item.created_by_username }}</p>
              <p>
                <star-rating v-bind:read-only="true"
                             v-bind:show-rating="false"
                             v-bind:star-size="15"
                             v-model="item.rating"></star-rating>
              </p>
              <p>{{ item.comment }}</p>
              <p>{{ item.created_at }}</p>
            </v-card>
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
import StarRating from 'vue-star-rating'

export default {
  name: "Layout",
  components: {MainPage, StarRating},
  data() {
    return {
      star_read_only: true,
      notifications: [
        {id: 1, title: 'Click Me'},
        {id: 2, title: 'Click Me'},
        {id: 3, title: 'Click Me'},
        {id: 4, title: 'Click Me 2'}
      ],
      location: {
        address: '',
        rating_average: 0,
        ratings: []
      },
      is_side_navigation_drawer_show: false,
      side_navigation_drawer_items: [
        {title: 'Address', icon: 'mdi-map-marker', value: ''},
        {title: 'Owner', icon: 'mdi-account', value: ''}
        // {title: 'Photos', icon: 'mdi-image'},
        // {title: 'About', icon: 'mdi-help-box'},
      ],
      series: [{
        data: []
      }],
      chartOptions: {
        grid: {
          show: true
        },
        colors: ['#FF9300'],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            //關掉可以下載的選項
            show: false
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: [],
          tickAmount: 1,
          labels: {
            show: false,
            formatter: function (val) {
              return val.toFixed(0)
            }
          }
        },
        yaxis: {
          labels: {
            show: true,
            formatter: function (val) {
              return val.toFixed(0)
            },
            style: {
              colors: [],
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 400,
              cssClass: 'apexcharts-yaxis-label',
            },
          }
        },
        tooltip: {
          enabled: true,
          marker: {
            show: false,
          },
          x: {
            show: true,
          },
          y: {
            formatter: undefined,
            title: {
              formatter: () => '',
            },
          },
        }
      },
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
    //這個是從MainPage的clickMarker裡傳過來的
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

      // console.log(location.ratings)
      let map = new Map();
      map.set(1, 0)
      map.set(2, 0)
      map.set(3, 0)
      map.set(4, 0)
      map.set(5, 0)
      this.location.ratings = []
      location.ratings.forEach(item => {
            if (!map.has(item.rating)) {
              map.set(item.rating, 1)
            } else {
              map.set(item.rating, map.get(item.rating) + 1)
            }
            this.location.ratings.push(item)

          }
      )
      // clear categories and series data
      this.chartOptions.xaxis.categories.splice(0)
      this.series[0]['data'].splice(0)
      let mapAsc = new Map([...map.entries()].sort());
      let mapDec = new Map([...mapAsc.entries()].reverse());
      let key_array = []
      let value_array = []
      mapDec.forEach(function (value, key) {
        // console.log(key, value)
        key_array.push(key)
        value_array.push(value)
      })
      key_array.forEach(item => this.chartOptions.xaxis.categories.push(item));
      value_array.forEach(item => this.series[0]['data'].push(item));
      let total = 0
      let count = 0
      for (let i = 0; i < key_array.length; i++) {
        count += value_array[i]
        total += key_array[i] * value_array[i]
      }
      this.location.rating_average = total / count

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


.list-icon {
  /*height: 30px;*/
  padding-top: 5px;
  padding-left: 10px;
  padding-right: 5px;
}

.list-value {
  font-family: 'Noto Serif TC', serif;
  font-size: 1.2em;
  /*font-weight: 100;*/

}

.rating-container {
  display: flex;
  /*align-items: center;*/
  /*flex-wrap: wrap;*/
}

.graph {
  width: 70%;
}

.beside-graph {
  width: 30%;
  align-items: center;
  flex-wrap: wrap;
}

.star-rating {

}

.number-rating {
  font-family: fantasy;
  font-size: 35px;
  color: black;
  height: 90%;
  /*border: black 1px solid;*/
  display: flex;
  flex-wrap: wrap;
  /*水平置中*/
  justify-content: center;
  /*垂直置中*/
  align-items: center;
}

</style>