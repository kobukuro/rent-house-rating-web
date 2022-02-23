<template>
  <div id="app">
    <b-modal @ok="addLocation" ref="addLocationModal">
      <b-form-row>
        <b-form-text>
          address
        </b-form-text>
        <b-form-input v-model="locationToAdd.address"></b-form-input>
      </b-form-row>
      <b-form-row>
        <b-form-text>
          owner name
        </b-form-text>
        <b-form-input v-model="locationToAdd.ownerName"></b-form-input>
      </b-form-row>
    </b-modal>
    <b-modal @ok="addRating" ref="addRatingModal">
      <b-form-row>
        <b-form-text>
          rating
        </b-form-text>
        <b-form-input v-model="ratingToAdd.rating"></b-form-input>
      </b-form-row>
      <b-form-row>
        <b-form-text>
          comment
        </b-form-text>
        <b-form-input v-model="ratingToAdd.comment"></b-form-input>
      </b-form-row>
    </b-modal>
    <!-- 初始化地圖設定 -->
    <l-map
        ref="myMap"
        :zoom="zoom"
        :center="center"
        :options="options"
        style="height: 100vh;"
        @contextmenu="openContextMenu"
    >

      <l-layer-group ref="newLayerGroup">
        <l-popup>
          <div>
            <v-dialog
                v-model="dialog"
                width="500"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <!--@click="showLocationModalMethod"-->
                  <v-icon dark>
                    mdi-map-marker-plus
                  </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h5 grey lighten-2">
                  Add Location
                </v-card-title>

                <v-text-field
                    v-model="locationToAdd.address"
                    label="address"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="locationToAdd.ownerName"
                    label="ownerName"
                    required
                ></v-text-field>
                <!--                <v-divider></v-divider>-->

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="#BDBDBD"
                      @click="dialog = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                      color="primary"
                      @click="addLocation"
                  >
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </l-popup>
      </l-layer-group>
      <!-- 載入圖資 -->
      <l-tile-layer :url="url" :attribution="attribution"/>
      <!-- 自己所在位置 -->
      <l-marker ref="location" :lat-lng="center">
        <l-popup>
          你的位置
        </l-popup>
      </l-marker>
      <!-- 創建標記點 -->
      <l-marker :lat-lng="item.local" v-for="item in data" :key="item.id" @click="clickMarker(item)">
        <!-- 標記點樣式判斷 -->
        <l-icon
            :icon-url="item.address === '夢時代購物中心'?icon.type.gold:icon.type.black"
            :shadow-url="icon.shadowUrl"
            :icon-size="icon.iconSize"
            :icon-anchor="icon.iconAnchor"
            :popup-anchor="icon.popupAnchor"
            :shadow-size="icon.shadowSize"

        >


        </l-icon>
        <!-- 彈出視窗 -->
        <!--        <l-popup>-->
        <!--          <p>-->
        <!--            address: {{ item.address }}-->
        <!--          </p>-->
        <!--          <p>-->
        <!--            owner name: {{ item.ownerName }}-->
        <!--          </p>-->
        <!--          <p>-->
        <!--            <b-button @click="showRatingModalMethod">add rating data</b-button>-->
        <!--          </p>-->
        <!--          <p v-for="data in item.ratings" :key="data.id">-->
        <!--            rating: {{ data.rating }}-->
        <!--            comment: {{ data.comment }}-->
        <!--          </p>-->
        <!--        </l-popup>-->
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import {getUserName} from "@/utils/auth";
import {location_api} from "@/api";
import axios from "axios";
// import ContextMenu from './ContextMenu';

export default {
  name: "App",
  // components: {ContextMenu},
  data() {
    return {
      dialog: false,
      locationToAdd: {
        country_name: '',
        country_id: 0,
        address: '',
        ownerName: '',
        lat: 0,
        lng: 0
      },
      ratingToAdd: {
        location_id: 0,
        rating: 0,
        comment: ''
      },
      showContextMenu: false,
      showModal: false,
      // 模擬資料
      data: [
        {id: 0, address: "夢時代購物中心", local: [22.595153, 120.306923], owner_name: '', ratings: []},
        {id: -1, address: "漢神百貨", local: [22.61942, 120.296386], owner_name: '', ratings: []},
        {id: -2, address: "漢神巨蛋", local: [22.669603, 120.302288], owner_name: '', ratings: []},
        {id: -3, address: "大統百貨", local: [22.630748, 120.318033], owner_name: '', ratings: []}
      ],

      zoom: 13,
      center: [22.612961, 120.304167],
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: `© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors`,
      options: {
        // zoomControl: false,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
          text: 'Show coordinates',

        }, {
          text: 'Center map here',

        }, '-', {
          text: 'Zoom in',
          icon: 'images/zoom-in.png',

        }, {
          text: 'Zoom out',
          icon: 'images/zoom-out.png',

        }]
      },
      icon: {
        type: {
          black:
              "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png",
          gold:
              "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png"
        },
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      }
    };
  },
  methods: {
    addMarker(event) {
      console.log(event.latlng);
    },
    openContextMenu(event) {
      this.$refs.newLayerGroup.mapObject.openPopup(event.latlng);
      this.locationToAdd.lat = event.latlng.lat;
      this.locationToAdd.lng = event.latlng.lng;
      let open_street_api = axios.create({
        baseURL: 'https://nominatim.openstreetmap.org', headers: {
          'Content-Type': 'application/json',
        }
      })
      open_street_api.get(`reverse?format=jsonv2&lat=${this.locationToAdd.lat}&lon=${this.locationToAdd.lng}`)
          .then(res => {
            this.locationToAdd.country_name = res.data.address.country
            location_api.get('countries')
                .then(res => {
                  res.data.forEach(element => {
                    if (element.name === this.locationToAdd.country_name) {
                      this.locationToAdd.country_id = element.id
                    }
                  })
                })
          })
          .catch(err => {
            console.log(err.response)
          })
    },
    showLocationModalMethod() {
      //要加上自動抓取的地址
      // this.$refs['addLocationModal'].show()
    },
    showRatingModalMethod() {
      this.$refs['addRatingModal'].show()
    },
    addLocation() {
      location_api.post('locations', {
        country_id: this.locationToAdd.country_id,
        address: this.locationToAdd.address,
        owner_name: this.locationToAdd.ownerName,
        lat: this.locationToAdd.lat,
        lng: this.locationToAdd.lng
      })
          .then(res => {
            let element = {
              id: res.data.id,
              address: this.locationToAdd.address,
              local: [this.locationToAdd.lat, this.locationToAdd.lng],
              ownerName: this.locationToAdd.ownerName,
              ratings: []
            }
            this.data.push(element)
            this.dialog = false
          })
    },
    addRating() {
      location_api.post('ratings', {
        location_id: this.ratingToAdd.location_id,
        rating: this.ratingToAdd.rating,
        comment: this.ratingToAdd.comment
      })
          .then(res => {
            console.log(res)
            let index = 0
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].id === this.ratingToAdd.location_id) {
                index = i;
              }
            }
            let tmp = {
              rating: this.ratingToAdd.rating,
              comment: this.ratingToAdd.comment
            }
            this.data[index].ratings.push(tmp)
          })

    },
    clickMarker(location) {
      this.$emit('markerClicked', location)
      this.ratingToAdd.location_id = location.id

    }
  },
  computed: {
    username() {
      return getUserName()
    },
  },

  mounted() {
    // 等地圖創建後執行
    this.$nextTick(() => {
      // 獲得目前位置
      navigator.geolocation.getCurrentPosition(position => {
        const p = position.coords;
        // 將中心點設為目前的位置
        this.center = [p.latitude, p.longitude];
        // 將目前的位置的標記點彈跳視窗打開
        this.$refs.location.mapObject.openPopup();
      });
      //將db中的location資料放到data中
      location_api.get('/locations')
          .then(res => {
            res.data.forEach(element => {
              location_api.get('/ratings?location_id=' + element.id)
                  .then(res => {
                    let location_to_add = {
                      id: element.id,
                      ratings: res.data,
                      address: element.address,
                      local: [element.lat, element.lng],
                      ownerName: element.owner_name
                    };
                    this.data.push(location_to_add)
                  })
            })
          })
    });
  }
};
</script>

<style>
html, body {
  padding: 0;
  margin: 0;
}
</style>