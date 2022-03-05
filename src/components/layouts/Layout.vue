<template>
  <div class="layout-default">
    <v-snackbar
        v-model="snackbar"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
            icon
            v-bind="attrs"
            @click="snackbar = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
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


        </v-menu>

      </v-toolbar>
      <v-navigation-drawer app
                           absolute
                           bottom
                           temporary
                           class="white"
                           v-model="is_side_navigation_drawer_show"
                           overlay-opacity="0"
                           width="500"
                           height="100%">
        <!-- TODO delete location btn 要加上確認視窗       -->
        <div class="delete-location-btn-container"
             v-if="is_only_self_comment">
          <v-btn small
                 style="text-transform: none !important"
                 @click="deleteLocation">
            Delete Location
          </v-btn>
        </div>
        <v-list
            dense
            nav>
          <v-list-item
              v-for="item in side_navigation_drawer_items"
              :key="item.title"
              link>
            <v-list-item-icon>
              <v-icon class="list-icon">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content class="list-value">
              {{ item.value }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div class="rating-container">
          <div class="graph">
            <apexchart ref="chart" type="bar" :options="chartOptions" :series="series"></apexchart>
          </div>
          <div class="beside-graph">
            <div class="star-rating">
              <star-rating v-bind:star-size="30" v-model="location.rating_average"
                           :read-only="true"
                           :show-rating="false"></star-rating>
            </div>
            <div class="number-rating">
              <p>{{ location.rating_average }}</p>
              <div class="number-total-comment">
                <div v-if="location.ratings.length<=1">
                  {{ location.ratings.length }} comment
                </div>
                <div v-if="location.ratings.length>1">
                  {{ location.ratings.length }} comments
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="write-comment-container"
             v-if="!location.already_wrote_comment">

          <v-dialog
              v-model="add_rating_dialog"
              width="500"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  small
                  v-bind="attrs"
                  v-on="on"
                  class="write-comment-btn" style="text-transform: none !important"
              >
                <span>Write Comment</span>

              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                <span>{{ location.address }}</span>
              </v-card-title>
              <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                <span>{{ location.owner_name }}</span>
              </v-card-title>
              <div class="give-rating">
                <star-rating v-bind:read-only="false"
                             v-bind:show-rating="false"
                             v-bind:star-size="35"
                             v-model="location.self_rating"
                >
                </star-rating>
              </div>
              <v-textarea
                  solo
                  label="write your comment"
                  required
                  v-model="location.self_comment"
                  style="padding-top: 1em"
              >
              </v-textarea>
              <!--                <v-divider></v-divider>-->

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="#BDBDBD"
                    @click="add_rating_dialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    @click="addRating()"
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>


        </div>
        <!-- self comment -->
        <v-list class="comment-list-container">
          <v-list-item v-for="(item, index) in location.ratings" :key="index">
            <v-card class="comment-card"
                    v-if="item.created_by_username === username">
              <h5>Your comment</h5>
              <v-card-title>
                <span>{{ item.created_by_username }}</span>

                <v-spacer></v-spacer>

                <v-menu v-if="item.created_by_username === username"
                        bottom
                        left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon color="black">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                        v-for="(item, i) in self_card_actions"
                        :key="i"
                    >
                      <v-list-item-title>
                        <v-dialog
                            v-model="delete_rating_dialog"
                            width="500"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon
                                   v-bind="attrs"
                                   v-on="on"
                            >
                              <v-icon>
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                              <span>Are you sure to delete this comment?</span>
                            </v-card-title>
                            <v-card-actions style="display: flex;justify-content: center;">
                              <!--                              <v-spacer></v-spacer>-->
                              <v-btn
                                  color="#BDBDBD"
                                  @click="delete_rating_dialog = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                  color="primary"
                                  @click="deleteRating"
                              >
                                Sure
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
              <p>
                <star-rating v-bind:read-only="true"
                             v-bind:show-rating="false"
                             v-bind:star-size="15"
                             v-model="item.rating"></star-rating>
              </p>
              <p>{{ item.comment }}</p>
              <p>{{ item.created_at }}</p>
              <div class="edit-comment-container">
                <v-dialog
                    v-model="add_rating_dialog"
                    width="500"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        small
                        v-bind="attrs"
                        v-on="on"
                        class="write-comment-btn" style="text-transform: none !important"
                    >
                      <span>Edit Comment</span>

                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                      <span>{{ location.address }}</span>
                    </v-card-title>
                    <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                      <span>{{ location.owner_name }}</span>
                    </v-card-title>
                    <div class="give-rating">
                      <star-rating v-bind:read-only="false"
                                   v-bind:show-rating="false"
                                   v-bind:star-size="35"
                                   v-model="location.self_rating"
                      >
                      </star-rating>
                    </div>
                    <v-textarea
                        solo
                        label="write your comment"
                        required
                        v-model="location.self_comment"
                        style="padding-top: 1em"
                    >
                    </v-textarea>
                    <!--                <v-divider></v-divider>-->

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                          color="#BDBDBD"
                          @click="add_rating_dialog = false"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                          color="primary"
                          @click="editRating()"
                      >
                        Submit
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </v-card>
          </v-list-item>
        </v-list>
        <!-- comment of other people -->
        <v-list class="comment-list-container">

          <v-list-item v-for="(item, index) in location.ratings" :key="index">
            <v-card class="comment-card"
                    v-if="item.created_by_username !== username">
              <v-card-title>
                <span>{{ item.created_by_username }}</span>

                <v-spacer></v-spacer>

                <v-menu v-if="item.created_by_username === username"
                        bottom
                        left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        dark
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                      <v-icon color="black">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                        v-for="(item, i) in self_card_actions"
                        :key="i"
                    >
                      <v-list-item-title>
                        <v-dialog
                            v-model="delete_rating_dialog"
                            width="500"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon
                                   v-bind="attrs"
                                   v-on="on"
                            >
                              <v-icon>
                                mdi-delete
                              </v-icon>
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title class="text-h5 grey lighten-2" style="display: flex;justify-content: center;">
                              <span>Are you sure to delete this comment?</span>
                            </v-card-title>
                            <v-card-actions style="display: flex;justify-content: center;">
                              <!--                              <v-spacer></v-spacer>-->
                              <v-btn
                                  color="#BDBDBD"
                                  @click="delete_rating_dialog = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                  color="primary"
                                  @click="deleteRating"
                              >
                                Sure
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-title>
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
import {getUserName, getUserId, getEmail} from "@/utils/auth";
import MainPage from "@/components/pages/MainPage";
import StarRating from 'vue-star-rating'
import {location_api} from "@/api";
import {deleteLocation, listRatings, createRating, partialUpdateRating, deleteRating} from "@/api/location";
import {findIndexByColumnValue} from "@/utils/common";

export default {
  name: "Layout",
  components: {MainPage, StarRating},
  data() {
    return {
      snackbar: false,
      message: '',
      self_card_actions: [
        {title: 'Click Me'},
      ],
      rating_labels: [5, 4, 3, 2, 1],
      add_rating_dialog: false,
      delete_rating_dialog: false,
      star_read_only: true,
      location: {
        location_id: -1,
        address: '',
        owner_name: '',
        rating_average: 0,
        ratings: [],
        already_wrote_comment: false,
        self_comment: '',
        self_rating: 0,
        createdByUserName: ''
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
      // console.log(location)
      this.is_side_navigation_drawer_show = true
      this.location.address = location.address
      this.location.location_id = location.id
      this.location.owner_name = location.ownerName
      this.location.createdByUserName = location.createdByUserName
      this.side_navigation_drawer_items.forEach(item => {
        if (item.title === 'Address') {
          item.value = location.address
        }
        if (item.title === 'Owner') {
          item.value = location.ownerName
        }
      })
      this.updateLocationRatingData()
    },
    format_time(input) {
      // console.log(input)

      //2022-02-28T09:22:04.068220Z
      //Mon, 28 Feb 2022 09:22:04 GMT
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const fullMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      const day_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      if (day_names.includes(input.substring(0, 3))) {
        return input
      }
      const date = new Date(`${fullMonthNames[parseInt(input.split('-')[1], 10) - 1]} ${input.split('-')[2].split('T')[0]}, ${input.split('-')[0]}`);
      const day_index = date.getDay();
      // Sunday - Saturday : 0 - 6
      // ${monthNames[input.split('-')[1]+1]} ${input.split('-')[0]}
      return `${day_names[day_index]}, ${input.split('-')[2].split('T')[0]} ${monthNames[parseInt(input.split('-')[1], 10) - 1]} ${input.split('-')[0]} ${input.split('T')[1].split('.')[0]} GMT`
    },
    deleteLocation() {
      let location_id = this.location.location_id
      // console.log(location_id)
      deleteLocation(location_id)
          .then(res => {
            if (res.status === 204) {
              let payload = {
                location_id: this.location.location_id
              }
              // this.updateLocationData()
              this.$store.dispatch('location/delete_location', payload)
              this.is_side_navigation_drawer_show = false
              this.showSnackBar('Delete location successfully.')
            }
          })
    },
    addRating() {
      // console.log(this.location.location_id)
      // console.log('addRating')
      let form = {
        location_id: this.location.location_id,
        rating: this.location.self_rating,
        comment: this.location.self_comment
      }
      createRating(form)
          .then(res => {
            if (res.status === 201) {
              this.updateLocationRatingData()
              this.add_rating_dialog = false
              this.showSnackBar('Add comment successfully.')
            }
          })
    },
    editRating() {
      // console.log(this.user_id)
      location_api.get(`ratings?location_id=${this.location.location_id}&created_by=${this.user_id}`)
          .then(res => {
            let rating_id = res.data[0].id
            const form = {
              rating: this.location.self_rating,
              comment: this.location.self_comment
            }
            partialUpdateRating(rating_id, form)
                .then(res => {
                  if (res.status === 200) {
                    this.updateLocationRatingData()
                    this.add_rating_dialog = false
                    this.showSnackBar('Edit comment successfully.')
                  }

                })
          })


    },
    deleteRating() {
      // console.log('delete rating')
      location_api.get(`ratings?location_id=${this.location.location_id}&created_by=${this.user_id}`)
          .then(res => {
            let rating_id = res.data[0].id
            deleteRating(rating_id)
                .then(res => {
                  if (res.status === 204) {
                    this.updateLocationRatingData()
                    this.showSnackBar('Delete comment successfully.')
                  }
                })
          })
    },
    showSnackBar(message) {
      this.snackbar = true
      this.message = message
    },
    updateLocationRatingData() {
      //從DB取得此location_id的rating資料
      let params = {location_id: this.location.location_id}
      // console.log(this.location.location_id)
      listRatings(params)
          .then(res => {
            let index = findIndexByColumnValue(this.location_data, 'id', this.location.location_id)
            let ratings = res.data
            // console.log(ratings)
            //更新vuex的此location_id的rating資料
            this.$store.dispatch('location/update_location_ratings', {index, ratings})
            //初始化Map, 初始值為key:1~5, value皆為0, 用於計算各個rating個數
            let map = new Map();
            for (let i = 1; i <= 5; i++) {
              map.set(i, 0)
            }
            this.location.ratings = []
            let already_wrote_comment = false
            ratings.forEach(item => {
                  if (item.created_by_username === this.username) {
                    already_wrote_comment = true
                    this.location.self_comment = item.comment
                    this.location.self_rating = item.rating

                  }
                  if (!map.has(item.rating)) {
                    map.set(item.rating, 1)
                  } else {
                    map.set(item.rating, map.get(item.rating) + 1)
                  }
                  item.created_at = this.format_time(item.created_at)
                  this.location.ratings.push(item)

                }
            )
            this.location.already_wrote_comment = already_wrote_comment
            if (!already_wrote_comment) {
              this.location.self_comment = ''
              this.location.self_rating = 0
            }
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
            // 更新chart的Series
            this.updateSeriesLine();
            // console.log(this.chartOptions.xaxis.categories)
            // console.log(this.series[0]['data'])
            // 計算平均
            let total = 0
            let count = 0
            for (let i = 0; i < key_array.length; i++) {
              count += value_array[i]
              total += key_array[i] * value_array[i]
            }
            this.location.rating_average = total / count
          })
    },
    updateSeriesLine() {
      this.$refs.chart.updateSeries([{
        data: this.series[0].data,
      }], false, true);
    },

  },
  computed: {
    username() {
      return getUserName()
    },
    user_id() {
      return getUserId()
    },
    email() {
      return getEmail()
    },
    location_data() {
      return this.$store.getters['location/location_data']
    },
    is_only_self_comment() {
      let res = false
      if (this.location.createdByUserName === this.username) {
        if (this.location.ratings.length === 0) {
          res = true
        }
        if (this.location.ratings.length > 1) {
          res = false
        }
        if (this.location.ratings.length === 1) {
          if (this.location.ratings[0].created_by_username === this.username) {
            res = true
          } else {
            res = false
          }

        }
      } else {
        res = false
      }
      return res
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
  /*border: black 1px solid;*/
  display: flex;
  /*align-items: center;*/
  /*flex-wrap: wrap;*/
}

.graph {
  width: 70%;
  height: 15em;
  /*border: red 1px solid;*/
}

.beside-graph {
  /*border: purple 1px solid;*/
  width: 30%;
  height: 15em;
  align-items: center;
  flex-wrap: wrap;
}

.star-rating {
  height: 15%;

}

.number-rating {
  font-family: fantasy;
  font-size: 35px;
  color: black;
  height: 85%;
  /*border: steelblue 1px solid;*/
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  /*水平置中*/
  justify-content: center;
  /*垂直置中*/
  align-items: center;
}

.number-total-comment {
  font-family: Arial;
  font-size: 15px;
}

.comment-list-container {
  display: flex;
  flex-direction: column;

}

.write-comment-container {
  display: flex;
  justify-content: center;
}

.write-comment-btn {
  /*btn寬度隨著內容調整*/
  display: inline-flex


}

.comment-card {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.give-rating {
  display: flex;
  justify-content: center;
}

.edit-comment-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.delete-location-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

</style>